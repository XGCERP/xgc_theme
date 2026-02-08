#!/bin/bash

# XGC Theme Deployment Script
# This script builds and deploys the XGC theme to Docker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
SITE_NAME="${SITE_NAME:-xgc.localhost}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-admin}"
DB_ROOT_PASSWORD="${DB_ROOT_PASSWORD:-admin}"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}XGC Theme Deployment${NC}"
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

# Check if Docker is running
print_status "Checking Docker..."
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi
print_success "Docker is running"

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose down || true
print_success "Containers stopped"

# Build the custom image (optional - if you want to use custom Dockerfile)
# print_status "Building custom Docker image..."
# docker build -t xgc-theme:latest .
# print_success "Image built successfully"

# Start the services
print_status "Starting Docker services..."
docker-compose up -d mariadb redis-cache redis-queue redis-socketio
print_success "Database and cache services started"

# Wait for MariaDB to be ready
print_status "Waiting for MariaDB to be ready..."
sleep 10
until docker-compose exec -T mariadb mysqladmin ping -h localhost --password=${DB_ROOT_PASSWORD} --silent; do
    echo "Waiting for database connection..."
    sleep 2
done
print_success "MariaDB is ready"

# Run configurator
print_status "Configuring Frappe..."
docker-compose run --rm configurator
print_success "Configuration complete"

# Create site if it doesn't exist
print_status "Creating Frappe site: ${SITE_NAME}..."
docker-compose exec -T backend bash -c "
    if [ ! -d sites/${SITE_NAME} ]; then
        bench new-site ${SITE_NAME} \
            --mariadb-root-password ${DB_ROOT_PASSWORD} \
            --admin-password ${ADMIN_PASSWORD} \
            --no-mariadb-socket
    else
        echo 'Site already exists'
    fi
" || print_error "Failed to create site"
print_success "Site created/verified"

# Install xgc_theme app
print_status "Installing XGC Theme app..."
docker-compose exec -T backend bash -c "
    cd /home/frappe/frappe-bench
    if [ -d apps/xgc_theme ]; then
        bench --site ${SITE_NAME} install-app xgc_theme
    else
        echo 'Theme app not found in apps directory'
        exit 1
    fi
" || print_error "Failed to install theme"
print_success "XGC Theme installed"

# Build assets
print_status "Building frontend assets..."
docker-compose exec -T backend bash -c "
    bench --site ${SITE_NAME} clear-cache
    bench --site ${SITE_NAME} clear-website-cache
    bench build --app xgc_theme
" || print_error "Failed to build assets"
print_success "Assets built successfully"

# Set theme as default
print_status "Setting XGC Light as default theme..."
docker-compose exec -T backend bash -c "
    bench --site ${SITE_NAME} set-config theme 'XGC Light'
" || print_error "Failed to set theme"
print_success "Theme set as default"

# Start all services
print_status "Starting all services..."
docker-compose up -d
print_success "All services started"

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 5

# Show status
print_status "Checking service status..."
docker-compose ps

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Site URL: ${GREEN}http://localhost:8080${NC}"
echo -e "Site Name: ${GREEN}${SITE_NAME}${NC}"
echo -e "Admin Username: ${GREEN}Administrator${NC}"
echo -e "Admin Password: ${GREEN}${ADMIN_PASSWORD}${NC}"
echo ""
echo -e "To view logs: ${YELLOW}docker-compose logs -f${NC}"
echo -e "To stop: ${YELLOW}docker-compose down${NC}"
echo -e "To restart: ${YELLOW}docker-compose restart${NC}"
echo ""
