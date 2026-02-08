# XGC Theme Installation Guide

Complete guide for installing and configuring the XGC Theme app in Frappe/ERPNext.

## Overview

The XGC Theme app provides a professional, OneUI-based theme for Frappe/ERPNext with automatic installation and configuration. When installed, the app automatically:

1. ✅ Creates Website Theme records (XGC Light and XGC Dark)
2. ✅ Sets XGC Light as the default theme
3. ✅ Configures website settings with XGC branding
4. ✅ Applies theme assets (CSS, JavaScript, images)

**No manual configuration required!**

---

## Installation Methods

### Method 1: Docker Development Environment (Recommended)

If you're using the Docker development environment:

```bash
# 1. Install the app on your site
docker exec devcontainer-frappe-1 bash -c "
    cd /workspace/development/frappe-bench
    bench --site dev.localhost install-app xgc_theme
"

# 2. Clear cache (done automatically, but can be run manually)
docker exec devcontainer-frappe-1 bash -c "
    cd /workspace/development/frappe-bench
    bench --site dev.localhost clear-cache
    bench --site dev.localhost clear-website-cache
"

# 3. Restart bench to apply changes
docker exec devcontainer-frappe-1 bash -c "
    cd /workspace/development/frappe-bench
    bench restart
"
```

### Method 2: Standard Bench Installation

For standard Frappe bench installations:

```bash
# 1. Navigate to your bench directory
cd ~/frappe-bench

# 2. Install the app
bench --site your-site.local install-app xgc_theme

# 3. Clear cache
bench --site your-site.local clear-cache
bench --site your-site.local clear-website-cache

# 4. Restart bench
bench restart
```

### Method 3: Production Installation

For production sites:

```bash
# 1. Get the app (if not already in apps directory)
cd ~/frappe-bench
bench get-app https://github.com/your-org/xgc_theme.git

# 2. Install on site
bench --site your-site.com install-app xgc_theme

# 3. Build assets
bench build --app xgc_theme

# 4. Clear cache
bench --site your-site.com clear-cache
bench --site your-site.com clear-website-cache

# 5. Restart services
sudo supervisorctl restart all
```

---

## What Happens During Installation

### 1. Fixtures Import

The app automatically imports these fixtures:

- **Website Theme: XGC Light** - Professional light theme with forest green branding
- **Website Theme: XGC Dark** - Modern dark theme variant

### 2. Default Theme Configuration

The `after_install` hook automatically:

```python
# Sets XGC Light as default
website_settings.website_theme = "XGC Light"

# Configures branding
website_settings.favicon = "/assets/xgc_theme/media/favicons/favicon.ico"
website_settings.brand_html = '<img src="/assets/xgc_theme/media/logo/xgc_carbon_wide-h400.webp" alt="XGC">'
website_settings.app_name = "XGC"
```

### 3. Asset Loading

The following assets are automatically included:

**Desk (Backend):**
- `/assets/xgc_theme/css/xgc_variables.css` - CSS variables
- `/assets/xgc_theme/css/xgc_components.css` - Component styles
- `/assets/xgc_theme/css/xgc_desk.css` - Desk-specific styles
- `/assets/xgc_theme/js/xgc_theme.js` - Theme JavaScript

**Website (Frontend):**
- `/assets/xgc_theme/css/xgc_variables.css` - CSS variables
- `/assets/xgc_theme/css/xgc_components.css` - Component styles
- `/assets/xgc_theme/css/xgc_website.css` - Website-specific styles
- `/assets/xgc_theme/js/xgc_theme.js` - Theme JavaScript

---

## Verification

### Check Installation Status

```bash
# List installed apps
docker exec devcontainer-frappe-1 bash -c "
    cd /workspace/development/frappe-bench
    bench --site dev.localhost list-apps
"

# Should show:
# frappe
# erpnext (if installed)
# xgc_theme
```

### Verify Theme in UI

1. **Login to your site**: http://localhost:8000
2. **Go to Website Settings**: Setup > Website > Website Settings
3. **Check Website Theme field**: Should show "XGC Light"
4. **View Website Theme**: Setup > Website > Website Theme
5. **Verify themes exist**: XGC Light and XGC Dark should be listed

### Check Theme Assets

```bash
# Verify CSS files exist
docker exec devcontainer-frappe-1 bash -c "
    cd /workspace/development/frappe-bench
    ls -la sites/assets/xgc_theme/css/
"

# Should show:
# xgc_variables.css
# xgc_components.css
# xgc_desk.css
# xgc_website.css
# xgc_dark.css
```

---

## Switching Themes

### Via UI

1. Go to **Setup > Website > Website Settings**
2. Change **Website Theme** field to:
   - `XGC Light` - Professional light theme
   - `XGC Dark` - Modern dark theme
3. Save
4. Clear cache: `bench --site dev.localhost clear-cache`

### Via Command Line

```bash
# Switch to XGC Dark
docker exec devcontainer-frappe-1 bash -c "
    cd /workspace/development/frappe-bench
    bench --site dev.localhost set-config theme 'XGC Dark'
    bench --site dev.localhost clear-cache
"

# Switch back to XGC Light
docker exec devcontainer-frappe-1 bash -c "
    cd /workspace/development/frappe-bench
    bench --site dev.localhost set-config theme 'XGC Light'
    bench --site dev.localhost clear-cache
"
```

### Programmatically

```python
import frappe

# Switch theme
frappe.db.set_value('Website Settings', None, 'website_theme', 'XGC Dark')
frappe.db.commit()

# Clear cache
frappe.clear_cache()
frappe.clear_website_cache()
```

---

## Troubleshooting

### Theme Not Applying

```bash
# 1. Rebuild assets
docker exec devcontainer-frappe-1 bash -c "
    cd /workspace/development/frappe-bench
    bench build --app xgc_theme
"

# 2. Clear all caches
docker exec devcontainer-frappe-1 bash -c "
    cd /workspace/development/frappe-bench
    bench --site dev.localhost clear-cache
    bench --site dev.localhost clear-website-cache
"

# 3. Restart bench
docker exec devcontainer-frappe-1 bash -c "
    cd /workspace/development/frappe-bench
    bench restart
"

# 4. Hard refresh browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows/Linux)
```

### Fixtures Not Imported

```bash
# Manually import fixtures
docker exec devcontainer-frappe-1 bash -c "
    cd /workspace/development/frappe-bench
    bench --site dev.localhost import-fixtures
"
```

### Reset Theme to Default

```python
# Run in Frappe console
import frappe
from xgc_theme.setup.install import reset_theme_to_default

reset_theme_to_default()
```

### Check Installation Logs

```bash
# View recent logs
docker exec devcontainer-frappe-1 bash -c "
    cd /workspace/development/frappe-bench
    tail -f sites/dev.localhost/logs/web.log
"

# Search for XGC Theme messages
docker exec devcontainer-frappe-1 bash -c "
    cd /workspace/development/frappe-bench
    grep 'XGC Theme' sites/dev.localhost/logs/web.log
"
```

---

## Uninstallation

### Remove App from Site

```bash
# Uninstall app
docker exec devcontainer-frappe-1 bash -c "
    cd /workspace/development/frappe-bench
    bench --site dev.localhost uninstall-app xgc_theme
"

# This will:
# - Remove Website Theme records
# - Reset website theme to default
# - Remove app assets
```

### Remove App from Bench

```bash
# Remove app completely
docker exec devcontainer-frappe-1 bash -c "
    cd /workspace/development/frappe-bench
    bench remove-app xgc_theme
"
```

---

## Advanced Configuration

### Custom Installation Hook

If you need to customize the installation process, edit `xgc_theme/install.py`:

```python
def after_install():
    """Custom post-installation logic"""
    
    # Your custom code here
    set_default_theme()
    configure_website_settings()
    
    # Add custom configuration
    # create_custom_pages()
    # setup_custom_roles()
    
    frappe.clear_cache()
```

### Add Additional Fixtures

To export additional data with the app, update `xgc_theme/hooks.py`:

```python
fixtures = [
    {
        "dt": "Website Theme",
        "filters": [["theme", "in", ["XGC Light", "XGC Dark"]]]
    },
    # Add more fixtures
    {"dt": "Web Page", "filters": [["name", "like", "xgc-%"]]},
    {"dt": "Blog Post", "filters": [["custom_field", "=", 1]]},
]
```

Then export:

```bash
docker exec devcontainer-frappe-1 bash -c "
    cd /workspace/development/frappe-bench
    bench --site dev.localhost export-fixtures
"
```

---

## For Client Installations

### Pre-Installation Checklist

- [ ] Frappe/ERPNext version compatibility verified
- [ ] Backup taken of target site
- [ ] App tested in staging environment
- [ ] Custom configurations documented

### Installation Steps for Clients

1. **Backup the site**
   ```bash
   bench --site client-site.com backup
   ```

2. **Install app**
   ```bash
   bench --site client-site.com install-app xgc_theme
   ```

3. **Verify installation**
   - Check Website Theme is set to XGC Light
   - Test website pages render correctly
   - Verify desk interface styling
   - Test on mobile devices

4. **Train users**
   - Show theme features
   - Explain dark mode option
   - Demonstrate responsive design

### Post-Installation Support

If clients need to reset or reconfigure:

```bash
# Reset theme
bench --site client-site.com console
>>> from xgc_theme.setup.install import reset_theme_to_default
>>> reset_theme_to_default()
```

---

## Support

For issues or questions:

- **Documentation**: See `WEBSITE_THEME_CONFIGURATION.md`
- **Logs**: Check `sites/[site-name]/logs/web.log`
- **Community**: Frappe Forum
- **Email**: support@xgccorp.com

---

**Version**: 0.0.1  
**Last Updated**: February 4, 2026  
**Compatibility**: Frappe v14+, ERPNext v14+
