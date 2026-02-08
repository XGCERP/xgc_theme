# XGC Theme Deployment Guide

## Quick Deploy to Existing Docker Instance

### Prerequisites
- Docker Desktop running with Frappe/ERPNext containers
- XGC Theme app already installed in the bench

### Deployment Steps

#### 1. Update and Build Theme
```bash
./update_and_build.sh
```

This script will:
- Clear cache
- Run database migrations
- Build frontend assets
- Restart bench processes

#### 2. Manual Bench Commands (Alternative)

If you prefer to run commands manually:

```bash
# Access the container
docker exec -it devcontainer-frappe-1 bash

# Navigate to bench directory
cd /workspace/development/frappe-bench

# Clear cache
bench --site <your-site-name> clear-cache
bench --site <your-site-name> clear-website-cache

# Run migrations
bench --site <your-site-name> migrate

# Build assets
bench build --app xgc_theme

# Restart
bench restart
```

#### 3. Activate Theme

1. Log in to your Frappe/ERPNext site
2. Go to: **Setup > Customize > Website Theme**
3. Select either:
   - **XGC Light** (default light theme)
   - **XGC Dark** (dark variant)
4. Click **Save**
5. Refresh your browser

### Environment Variables

You can customize the deployment by setting these environment variables:

```bash
# Container name (default: devcontainer-frappe-1)
export CONTAINER_NAME=your-container-name

# Site name (default: auto-detected)
export SITE_NAME=your-site-name

# Run the script
./update_and_build.sh
```

### Troubleshooting

#### Theme not appearing
```bash
docker exec -it devcontainer-frappe-1 bash
cd /workspace/development/frappe-bench
bench --site <site-name> install-app xgc_theme --force
bench build --app xgc_theme
bench --site <site-name> clear-cache
```

#### Assets not loading
```bash
docker exec -it devcontainer-frappe-1 bash
cd /workspace/development/frappe-bench
bench build --app xgc_theme --force
bench --site <site-name> clear-website-cache
```

#### Check app installation
```bash
docker exec -it devcontainer-frappe-1 bash
cd /workspace/development/frappe-bench
bench --site <site-name> list-apps
```

#### View logs
```bash
# Container logs
docker logs -f devcontainer-frappe-1

# Bench logs
docker exec -it devcontainer-frappe-1 bash
cd /workspace/development/frappe-bench
tail -f logs/web.error.log
tail -f logs/web.log
```

### Development Workflow

For active development:

1. Make changes to theme files
2. Run update script:
   ```bash
   ./update_and_build.sh
   ```
3. Refresh browser (hard refresh: Cmd+Shift+R or Ctrl+Shift+R)

### Quick Commands Reference

```bash
# Update and build everything
./update_and_build.sh

# Just build assets
docker exec devcontainer-frappe-1 bash -c "cd /workspace/development/frappe-bench && bench build --app xgc_theme"

# Clear cache only
docker exec devcontainer-frappe-1 bash -c "cd /workspace/development/frappe-bench && bench --site <site> clear-cache"

# Restart bench
docker exec devcontainer-frappe-1 bash -c "cd /workspace/development/frappe-bench && bench restart"

# Access container shell
docker exec -it devcontainer-frappe-1 bash
```

### File Structure in Container

```
/workspace/development/frappe-bench/
├── apps/
│   └── xgc_theme/           # Your theme app
│       ├── xgc_theme/
│       │   ├── public/      # Static assets
│       │   │   ├── css/
│       │   │   ├── js/
│       │   │   └── media/
│       │   ├── templates/   # Jinja templates
│       │   └── hooks.py     # App configuration
│       └── pyproject.toml
└── sites/
    └── <your-site>/
        └── public/
            └── files/       # Uploaded files
```

### Production Deployment

For production deployment to AWS ECS/EKS:

1. Build custom Docker image with theme pre-installed
2. Push to ECR
3. Update ECS task definition or Kubernetes deployment
4. Run migrations on deployment

See `terra-eks-frappe-aws` or `terra-ecs-africa-aws` repositories for infrastructure code.
