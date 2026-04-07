#!/bin/bash
#
# process-image.sh - Complete image pipeline helper
# Usage: ./process-image.sh input.png output-name
#
# This script:
# 1. Gets original image dimensions
# 2. Resizes to blog-friendly dimensions (1200x630 for hero images)
# 3. Optimizes and strips metadata
# 4. Outputs markdown with correct dimensions
#

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check dependencies
check_dependencies() {
    local missing_deps=()

    command -v identify >/dev/null 2>&1 || missing_deps+=("identify (ImageMagick)")
    command -v convert >/dev/null 2>&1 || missing_deps+=("convert (ImageMagick)")

    if [ ${#missing_deps[@]} -gt 0 ]; then
        echo -e "${RED}Error: Missing required dependencies:${NC}"
        for dep in "${missing_deps[@]}"; do
            echo "  - $dep"
        done
        echo ""
        echo "Install ImageMagick:"
        echo "  Ubuntu/Debian: sudo apt-get install imagemagick"
        echo "  macOS: brew install imagemagick"
        exit 1
    fi
}

# Validate input arguments
if [ $# -lt 2 ]; then
    echo -e "${RED}Error: Missing arguments${NC}"
    echo "Usage: $0 <input-file> <output-name>"
    echo ""
    echo "Example:"
    echo "  $0 /tmp/photo.jpg my-great-photo"
    echo "  This creates: cms/public/images/my-great-photo.jpg"
    exit 1
fi

INPUT="$1"
OUTPUT_NAME="$2"
OUTPUT_PATH="cms/public/images/${OUTPUT_NAME}.jpg"

# Check if input file exists
if [ ! -f "$INPUT" ]; then
    echo -e "${RED}Error: Input file not found: $INPUT${NC}"
    exit 1
fi

# Check if output directory exists
if [ ! -d "cms/public/images" ]; then
    echo -e "${YELLOW}Creating output directory: cms/public/images${NC}"
    mkdir -p cms/public/images
fi

# Check if output file already exists
if [ -f "$OUTPUT_PATH" ]; then
    echo -e "${YELLOW}Warning: Output file already exists: $OUTPUT_PATH${NC}"
    read -p "Overwrite? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 1
    fi
fi

echo -e "${GREEN}Processing image...${NC}"

# Get original dimensions
ORIG_DIMS=$(identify -format "%wx%h" "${INPUT}" 2>/dev/null) || {
    echo -e "${RED}Error: Failed to read image dimensions${NC}"
    exit 1
}
echo "Original dimensions: $ORIG_DIMS"

# Optimize and resize
convert "${INPUT}" \
    -resize 1200x630 \
    -quality 85 \
    -strip \
    "${OUTPUT_PATH}" 2>/dev/null || {
    echo -e "${RED}Error: Failed to process image${NC}"
    exit 1
}

# Get final dimensions
FINAL_DIMS=$(identify -format "%wx%h" "$OUTPUT_PATH" 2>/dev/null) || {
    echo -e "${RED}Error: Failed to read output dimensions${NC}"
    exit 1
}

WIDTH=$(echo $FINAL_DIMS | cut -d'x' -f1)
HEIGHT=$(echo $FINAL_DIMS | cut -d'x' -f2)

# Get file size
FILE_SIZE=$(ls -lh "$OUTPUT_PATH" | awk '{print $5}')

echo -e "${GREEN}✓ Image processed successfully${NC}"
echo "  Output: $OUTPUT_PATH"
echo "  Dimensions: ${FINAL_DIMS}"
echo "  File size: ${FILE_SIZE}"
echo ""
echo -e "${GREEN}Copy this markdown:${NC}"
echo ""
echo "[![Alt text](/images/${OUTPUT_NAME}.jpg)](/images/${OUTPUT_NAME}.jpg) <!-- width=\"${WIDTH}\" height=\"${HEIGHT}\" -->"
echo ""
echo "<caption>Description (click for full size)</caption>"
