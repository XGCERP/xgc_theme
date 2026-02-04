#!/bin/bash

# Visual Regression Test Runner Script
# This script automates the process of running visual regression tests
# for the XGC Theme application.

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "XGC Theme Visual Regression Test Runner"
echo "=========================================="
echo ""

# Check if Frappe is running
echo "Checking if Frappe instance is running..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8000 | grep -q "200\|302"; then
    echo -e "${GREEN}✓ Frappe instance is running${NC}"
else
    echo -e "${RED}✗ Frappe instance is not running on http://localhost:8000${NC}"
    echo "Please start Frappe with: bench start"
    exit 1
fi

# Check if cookies.json exists for authenticated tests
COOKIES_FILE="tests/visual/backstop_data/engine_scripts/cookies.json"
if [ -f "$COOKIES_FILE" ]; then
    echo -e "${GREEN}✓ Authentication cookies found${NC}"
else
    echo -e "${YELLOW}⚠ No cookies.json found. Desk tests may fail.${NC}"
    echo "To set up authentication:"
    echo "  1. Copy cookies.json.example to cookies.json"
    echo "  2. Log in to Frappe and extract the 'sid' cookie"
    echo "  3. Update cookies.json with your session ID"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check if baseline screenshots exist
BASELINE_DIR="tests/visual/backstop_data/bitmaps_reference"
if [ -d "$BASELINE_DIR" ] && [ "$(ls -A $BASELINE_DIR)" ]; then
    echo -e "${GREEN}✓ Baseline screenshots found${NC}"
    echo ""
    echo "Running visual regression tests..."
    npm run visual:test
else
    echo -e "${YELLOW}⚠ No baseline screenshots found${NC}"
    echo ""
    echo "Generating baseline screenshots..."
    npm run visual:reference
    echo ""
    echo -e "${GREEN}✓ Baseline screenshots generated${NC}"
    echo "Run this script again to perform regression testing."
fi

echo ""
echo "=========================================="
echo "Visual regression tests complete!"
echo "=========================================="
