# XGC Theme - Quick Start

## One-Command Installation

```bash
docker exec devcontainer-frappe-1 bash -c "
    cd /workspace/development/frappe-bench && \
    bench --site dev.localhost install-app xgc_theme && \
    bench --site dev.localhost clear-cache && \
    bench restart
"
```

**That's it!** The theme is now active with:
- ✅ XGC Light theme set as default
- ✅ XGC Dark theme available
- ✅ All assets loaded
- ✅ Website settings configured

## What Was Installed Automatically

### 1. Website Themes
- **XGC Light** (default) - Professional light theme
- **XGC Dark** - Modern dark theme

### 2. Website Settings
- Favicon: XGC logo
- Brand HTML: XGC branding
- App Name: XGC

### 3. Assets
- CSS: Variables, components, desk, website styles
- JavaScript: Theme enhancements
- Media: Logos, favicons, images

## Verify Installation

Visit: http://localhost:8000

You should see:
- XGC branding in navbar
- Forest green color scheme
- Professional styling throughout

## Switch to Dark Theme

```bash
docker exec devcontainer-frappe-1 bash -c "
    cd /workspace/development/frappe-bench && \
    bench --site dev.localhost execute 'frappe.db.set_value(\"Website Settings\", None, \"website_theme\", \"XGC Dark\"); frappe.db.commit()' && \
    bench --site dev.localhost clear-cache
"
```

## Need Help?

See `INSTALLATION.md` for detailed documentation.
