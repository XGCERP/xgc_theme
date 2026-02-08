# XGC Theme

Professional OneUI-based theme for Frappe/ERPNext with automatic installation and configuration.

## Features

- 🎨 **Two Theme Variants**: XGC Light (default) and XGC Dark
- 🚀 **Automatic Installation**: No manual configuration required
- 🎯 **OneUI Design System**: Modern, professional interface
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile
- ♿ **Accessible**: WCAG AA compliant color contrast
- 🔧 **Customizable**: Easy to extend and modify

## Quick Start

### One-Command Installation

```bash
# Docker environment
docker exec devcontainer-frappe-1 bash -c "
    cd /workspace/development/frappe-bench && \
    bench --site dev.localhost install-app xgc_theme && \
    bench --site dev.localhost clear-cache && \
    bench restart
"

# Standard bench
cd ~/frappe-bench
bench --site your-site.local install-app xgc_theme
bench --site your-site.local clear-cache
bench restart
```

**That's it!** The theme is automatically configured and active.

### What Gets Installed Automatically

When you install the app, it automatically:

1. ✅ Creates Website Theme records (XGC Light and XGC Dark)
2. ✅ Sets XGC Light as the default theme
3. ✅ Configures website settings with XGC branding
4. ✅ Loads all theme assets (CSS, JavaScript, images)

**No manual theme configuration needed!**

## Documentation

### Quick Start
- **[QUICKSTART.md](xgc_theme/QUICKSTART.md)** - Get started in 60 seconds
- **[THEME_INSTALLATION_SUMMARY.md](THEME_INSTALLATION_SUMMARY.md)** - Overview of automatic installation

### Installation & Deployment
- **[INSTALLATION.md](xgc_theme/INSTALLATION.md)** - Detailed installation guide
- **[AUTOMATIC_INSTALLATION.md](AUTOMATIC_INSTALLATION.md)** - Architecture and how it works
- **[CLIENT_DEPLOYMENT.md](CLIENT_DEPLOYMENT.md)** - Production deployment checklist

### Customization
- **[WEBSITE_THEME_CONFIGURATION.md](WEBSITE_THEME_CONFIGURATION.md)** - Theme customization reference

## Theme Variants

### XGC Light (Default)
- Professional light theme
- Forest green primary color (#2d5016)
- Gold accent color (#9c7a10)
- Optimized for business use

### XGC Dark
- Modern dark theme
- Reduced eye strain
- Same professional styling
- Perfect for low-light environments

Switch themes in: **Setup > Website > Website Settings > Website Theme**

## For Client Installations

This app is designed for easy deployment to client sites:

1. **Install once** - Theme is automatically configured
2. **No manual setup** - All settings applied automatically
3. **Consistent branding** - Same look across all installations
4. **Easy updates** - Update app to get theme improvements

See [INSTALLATION.md](xgc_theme/INSTALLATION.md) for client deployment guide.

## Development

### Get the App

```bash
cd ~/frappe-bench
bench get-app https://github.com/your-org/xgc_theme.git
```

### Install on Site

```bash
bench --site dev.localhost install-app xgc_theme
```

### Build Assets

```bash
bench build --app xgc_theme
```

### Contributing

This app uses `pre-commit` for code formatting and linting. Please [install pre-commit](https://pre-commit.com/#installation) and enable it for this repository:

```bash
cd apps/xgc_theme
pre-commit install
```

Pre-commit is configured to use the following tools for checking and formatting your code:

- ruff
- eslint
- prettier
- pyupgrade

### License
Private XGC CORP.
