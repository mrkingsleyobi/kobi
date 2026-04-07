#!/bin/bash
#
# cloudflare-images.sh - Upload single image to Cloudflare Images
# Usage: ./cloudflare-images.sh upload <image-path>
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

# Check dependencies
check_dependencies() {
    command -v jq >/dev/null 2>&1 || {
        echo -e "${RED}Error: jq is required but not installed${NC}"
        echo "Install: sudo apt-get install jq  # Ubuntu/Debian"
        echo "        brew install jq            # macOS"
        exit 1
    }

    command -v curl >/dev/null 2>&1 || {
        echo -e "${RED}Error: curl is required but not installed${NC}"
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
        echo ""
        echo "Set it in your shell or .env file:"
        echo "  export CF_API_TOKEN='your_api_token_here'"
        echo ""
        echo "Get your API token from: https://dash.cloudflare.com/profile/api-tokens"
        echo "Required permissions: Account > Cloudflare Images > Edit"
        exit 1
    fi
}

# Get account ID (auto-detect if not set)
get_account_id() {
    if [ -n "${CF_ACCOUNT_ID:-}" ]; then
        echo "$CF_ACCOUNT_ID"
        return
    fi

    echo -e "${BLUE}Auto-detecting account ID...${NC}" >&2

    # Try to get account ID from user info
    ACCOUNTS=$(curl -s -X GET "$CF_API_BASE/user/tokens/verify" \
        -H "Authorization: Bearer $CF_API_TOKEN" \
        -H "Content-Type: application/json")

    # If that fails, try listing accounts
    if echo "$ACCOUNTS" | jq -e '.success' >/dev/null 2>&1; then
        # Token is valid, try to get accounts
        ACCOUNTS=$(curl -s -X GET "$CF_API_BASE/accounts" \
            -H "Authorization: Bearer $CF_API_TOKEN" \
            -H "Content-Type: application/json")

        if ACCOUNT_ID=$(echo "$ACCOUNTS" | jq -r '.result[0].id' 2>/dev/null); then
            if [ "$ACCOUNT_ID" != "null" ] && [ -n "$ACCOUNT_ID" ]; then
                echo "$ACCOUNT_ID"
                return
            fi
        fi
    fi

    echo -e "${RED}Error: Could not auto-detect account ID${NC}" >&2
    echo "Set CF_ACCOUNT_ID environment variable" >&2
    exit 1
}

# Upload image to Cloudflare Images
upload_image() {
    local image_path="$1"
    local account_id="$2"

    if [ ! -f "$image_path" ]; then
        echo -e "${RED}Error: Image file not found: $image_path${NC}"
        exit 1
    fi

    local filename=$(basename "$image_path")
    echo -e "${BLUE}Uploading: $filename${NC}"

    # Upload using multipart/form-data
    response=$(curl -s -X POST "$CF_API_BASE/accounts/$account_id/images/v1" \
        -H "Authorization: Bearer $CF_API_TOKEN" \
        -F "file=@$image_path")

    # Check for success
    if echo "$response" | jq -e '.success' >/dev/null 2>&1; then
        image_id=$(echo "$response" | jq -r '.result.id')
        upload_url=$(echo "$response" | jq -r '.result.upload_url')

        echo -e "${GREEN}✓ Upload successful!${NC}"
        echo ""
        echo "Image ID: $image_id"
        echo ""
        echo "Image URLs:"
        echo "  Original: https://imagedelivery.net/$CF_ACCOUNT_ID/$image_id/public"
        echo "  Blog hero (1200x630): https://imagedelivery.net/$CF_ACCOUNT_ID/$image_id/w=1200,h=630,fit=crop"
        echo "  Large (1200w): https://imagedelivery.net/$CF_ACCOUNT_ID/$image_id/w=1200"
        echo "  Medium (800w): https://imagedelivery.net/$CF_ACCOUNT_ID/$image_id/w=800"
        echo "  Small (400w): https://imagedelivery.net/$CF_ACCOUNT_ID/$image_id/w=400"
        echo ""
        echo "Markdown for blog post:"
        echo "[![Alt text](https://imagedelivery.net/$CF_ACCOUNT_ID/$image_id/w=1200,h=630,fit=crop)](https://imagedelivery.net/$CF_ACCOUNT_ID/$image_id/public)"
        echo ""
        echo "<caption>Description (click for full size)</caption>"
    else
        errors=$(echo "$response" | jq -r '.errors[]?.message // "Unknown error"')
        echo -e "${RED}Error: Upload failed${NC}"
        echo "$errors"
        exit 1
    fi
}

# Main
check_dependencies
load_env

if [ $# -lt 1 ]; then
    echo "Usage: $0 upload <image-path>"
    echo ""
    echo "Example:"
    echo "  $0 upload cms/public/images/photo.jpg"
    exit 1
fi

COMMAND="$1"
shift

case "$COMMAND" in
    upload)
        if [ $# -lt 1 ]; then
            echo "Usage: $0 upload <image-path>"
            exit 1
        fi
        ACCOUNT_ID=$(get_account_id)
        upload_image "$1" "$ACCOUNT_ID"
        ;;
    *)
        echo -e "${RED}Error: Unknown command: $COMMAND${NC}"
        echo "Available commands: upload"
        exit 1
        ;;
esac
