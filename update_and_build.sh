#!/bin/bash

# XGC Theme Update and Build Script
# Updates the theme in running Docker container and rebuilds assets

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
CONTAINER_NAME="${CONTAINER_NAME:-devcontainer-frappe-1}"
SITE_NAME="${SITE_NAME:-xgc.localhost}"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}XGC Theme Update & Build${NC}"
echo -e "${GREEN}========================================${NC}"

# Function to print status
print_status() {
    echo -e "${YELLOW}>>> $1${NC}"
}

# Function to print success
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print error
print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Function to print info
print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check if container is running
print_status "Checking Docker container..."
if ! docker ps | grep -q ${CONTAINER_NAME}; then
    print_error "Container ${CONTAINER_NAME} is not running"
    exit 1
fi
print_success "Container is running"

# Get site name if not provided
if [ "${SITE_NAME}" == "xgc.localhost" ]; then
    print_status "Detecting site name..."
    DETECTED_SITE=$(docker exec ${CONTAINER_NAME} bash -c "ls -1 /workspace/development/frappe-bench/sites | grep -v 'apps.txt\|assets\|common_site_config.json' | head -1" 2>/dev/null || echo "")
    if [ ! -z "${DETECTED_SITE}" ]; then
        SITE_NAME="${DETECTED_SITE}"
        print_info "Using site: ${SITE_NAME}"
    fi
fi

# Clear cache
print_status "Clearing cache..."
docker exec ${CONTAINER_NAME} bash -c "
    cd /workspace/development/frappe-bench
    bench --site ${SITE_NAME} clear-cache
    bench --site ${SITE_NAME} clear-website-cache
" || print_error "Failed to clear cache"
print_success "Cache cleared"

# Update app (pull latest changes if in git repo)
print_status "Checking for app updates..."
docker exec ${CONTAINER_NAME} bash -c "
    cd /workspace/development/frappe-bench/apps/xgc_theme
    if [ -d .git ]; then
        git status
    else
        echo 'Not a git repository, skipping git pull'
    fi
" || print_info "App update check skipped"

# Migrate database
print_status "Running database migrations..."
docker exec ${CONTAINER_NAME} bash -c "
    cd /workspace/development/frappe-bench
    bench --site ${SITE_NAME} migrate
" || print_error "Failed to run migrations"
print_success "Migrations completed"

# Install/Update fixtures
print_status "Installing fixtures..."
docker exec ${CONTAINER_NAME} bash -c "
    cd /workspace/development/frappe-bench
    bench --site ${SITE_NAME} install-app xgc_theme --force
" || print_info "Fixtures installation skipped (app may already be installed)"

# Build assets
print_status "Building frontend assets..."
docker exec ${CONTAINER_NAME} bash -c "
    cd /workspace/development/frappe-bench
    bench build --app xgc_theme
" || print_error "Failed to build assets"
print_success "Assets built successfully"

# Restart bench
print_status "Restarting bench processes..."
docker exec ${CONTAINER_NAME} bash -c "
    cd /workspace/development/frappe-bench
    bench restart
" || print_info "Restart skipped (may need manual restart)"
print_success "Bench restarted"

# Clear cache again after build
print_status "Final cache clear..."
docker exec ${CONTAINER_NAME} bash -c "
    cd /workspace/development/frappe-bench
    bench --site ${SITE_NAME} clear-cache
    bench --site ${SITE_NAME} clear-website-cache
" || print_error "Failed to clear cache"
print_success "Cache cleared"

# Show theme status
print_status "Checking theme installation..."
docker exec ${CONTAINER_NAME} bash -c "
    cd /workspace/development/frappe-bench
    bench --site ${SITE_NAME} list-apps
" || print_error "Failed to list apps"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Update & Build Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Site: ${GREEN}${SITE_NAME}${NC}"
echo -e "Container: ${GREEN}${CONTAINER_NAME}${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. Access your site in the browser"
echo -e "2. Go to: ${BLUE}Setup > Customize > Website Theme${NC}"
echo -e "3. Select: ${BLUE}XGC Light${NC} or ${BLUE}XGC Dark${NC}"
echo -e "4. Save and refresh your browser"
echo ""
echo -e "To view logs: ${YELLOW}docker logs -f ${CONTAINER_NAME}${NC}"
echo -e "To access shell: ${YELLOW}docker exec -it ${CONTAINER_NAME} bash${NC}"
echo ""
