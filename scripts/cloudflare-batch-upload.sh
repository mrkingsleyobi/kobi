#!/bin/bash
#
# cloudflare-batch-upload.sh - Batch upload images to Cloudflare Images with parallel processing
# Usage: ./cloudflare-batch-upload.sh [directory]
#
# Environment variables required:
#   CF_API_TOKEN - Cloudflare API token with Images permissions
#   CF_ACCOUNT_ID - Cloudflare Account ID (optional, will auto-detect)
#

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Cloudflare Images API endpoint
CF_API_BASE="https://api.cloudflare.com/client/v4"

# Default directory to scan
IMAGE_DIR="${1:-cms/public/images}"

# CSV mapping file
CSV_FILE="cloudflare-image-mapping.csv"

# Parallel uploads (default: 4)
PARALLEL_UPLOADS=4

# Check dependencies
check_dependencies() {
    command -v jq >/dev/null 2>&1 || {
        echo -e "${RED}Error: jq is required but not installed${NC}"
        echo "Install: sudo apt-get install jq"
        exit 1
    }
}

# Load environment variables
load_env() {
    if [ -f .env ]; then
        source .env
    fi

    if [ -z "${CF_API_TOKEN:-}" ]; then
        echo -e "${RED}Error: CF_API_TOKEN environment variable not set${NC}"
        echo "Set it in your shell or .env file:"
        echo "  export CF_API_TOKEN='your_api_token_here'"
        exit 1
    fi
}

# Get account ID
get_account_id() {
    if [ -n "${CF_ACCOUNT_ID:-}" ]; then
        echo "$CF_ACCOUNT_ID"
        return
    fi

    echo -e "${BLUE}Auto-detecting account ID...${NC}" >&2

    ACCOUNTS=$(curl -s -X GET "$CF_API_BASE/accounts" \
        -H "Authorization: Bearer $CF_API_TOKEN" \
        -H "Content-Type: application/json")

    if ACCOUNT_ID=$(echo "$ACCOUNTS" | jq -r '.result[0].id' 2>/dev/null); then
        if [ "$ACCOUNT_ID" != "null" ] && [ -n "$ACCOUNT_ID" ]; then
            echo "$ACCOUNT_ID"
            return
        fi
    fi

    echo -e "${RED}Error: Could not auto-detect account ID${NC}" >&2
    echo "Set CF_ACCOUNT_ID environment variable" >&2
    exit 1
}

# Upload single image
upload_image() {
    local image_path="$1"
    local account_id="$2"
    local filename=$(basename "$image_path")

    response=$(curl -s -X POST "$CF_API_BASE/accounts/$account_id/images/v1" \
        -H "Authorization: Bearer $CF_API_TOKEN" \
        -F "file=@$image_path" 2>&1)

    if echo "$response" | jq -e '.success' >/dev/null 2>&1; then
        image_id=$(echo "$response" | jq -r '.result.id')
        echo "$filename,$image_id"
        return 0
    else
        echo -e "${RED}✗ $filename failed${NC}" >&2
        echo "$filename,FAILED" >&2
        return 1
    fi
}

# Export function for parallel execution
export -f upload_image
export CF_API_TOKEN CF_API_BASE RED GREEN YELLOW BLUE NC

# Main execution
main() {
    check_dependencies
    load_env
    ACCOUNT_ID=$(get_account_id)

    echo -e "${BLUE}Cloudflare Images Batch Upload${NC}"
    echo "================================"
    echo "Directory: $IMAGE_DIR"
    echo "Account ID: $ACCOUNT_ID"
    echo "Parallel uploads: $PARALLEL_UPLOADS"
    echo ""

    # Check if directory exists
    if [ ! -d "$IMAGE_DIR" ]; then
        echo -e "${RED}Error: Directory not found: $IMAGE_DIR${NC}"
        exit 1
    fi

    # Find all images (jpg, jpeg, png, webp, gif)
    echo -e "${BLUE}Scanning for images...${NC}"
    mapfile -t images < <(find "$IMAGE_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" -o -iname "*.gif" \) | sort)

    if [ ${#images[@]} -eq 0 ]; then
        echo -e "${YELLOW}No images found in $IMAGE_DIR${NC}"
        exit 0
    fi

    echo "Found ${#images[@]} image(s)"
    echo ""

    # Check for existing CSV and read uploaded image IDs
    declare -A uploaded_ids
    if [ -f "$CSV_FILE" ]; then
        echo -e "${BLUE}Reading existing CSV...${NC}"
        while IFS=, read -r filename image_id; do
            if [ "$image_id" != "FAILED" ]; then
                uploaded_ids["$filename"]="$image_id"
            fi
        done < "$CSV_FILE"
        echo "Found ${#uploaded_ids[@]} already uploaded"
        echo ""
    fi

    # Filter out already uploaded images
    mapfile -t to_upload < <(
        for img in "${images[@]}"; do
            filename=$(basename "$img")
            if [ -z "${uploaded_ids[$filename]:-}" ]; then
                echo "$img"
            fi
        done
    )

    if [ ${#to_upload[@]} -eq 0 ]; then
        echo -e "${GREEN}All images already uploaded!${NC}"
        exit 0
    fi

    echo "Uploading ${#to_upload[@]} new image(s)..."
    echo ""

    # Create or truncate CSV with header
    echo "filename,image_id" > "$CSV_FILE"

    # Append previously uploaded images to CSV
    for filename in "${!uploaded_ids[@]}"; do
        echo "$filename,${uploaded_ids[$filename]}" >> "$CSV_FILE"
    done

    # Upload images in parallel
    uploaded=0
    failed=0

    for img in "${to_upload[@]}"; do
        # Run upload in background with limit
        (
            result=$(upload_image "$img" "$ACCOUNT_ID")
            echo "$result" >> "$CSV_FILE"
        ) &

        # Limit parallel jobs
        if (( $(jobs -r | wc -l) >= PARALLEL_UPLOADS )); then
            wait -n
        fi

        ((uploaded++))
        progress=$((uploaded * 100 / ${#to_upload[@]}))
        printf "\r${BLUE}Progress:${NC} [%3d%%] (%d/%d)" "$progress" "$uploaded" "${#to_upload[@]}"
    done

    # Wait for all background jobs
    wait

    echo ""
    echo ""
    echo -e "${GREEN}✓ Batch upload complete!${NC}"
    echo "CSV mapping saved to: $CSV_FILE"
    echo ""

    # Count successes and failures
    total=$(wc -l < "$CSV_FILE")
    successes=$(grep -c ",img-" "$CSV_FILE" || true)
    failures=$(grep -c ",FAILED" "$CSV_FILE" || true)

    echo "Summary:"
    echo "  Total entries: $((total - 1))"
    echo "  Successful: $successes"
    echo "  Failed: $failures"
}

main "$@"
