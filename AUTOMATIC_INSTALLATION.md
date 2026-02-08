# XGC Theme - Automatic Installation Architecture

## Overview

The XGC Theme app uses Frappe's built-in installation hooks and fixtures system to provide **zero-configuration installation**. When a client installs the app, everything is automatically configured without manual intervention.

## Why Automatic Installation?

### Problems with Manual Configuration

❌ **Manual theme setup requires:**
- Creating Color records manually
- Creating Website Theme records manually
- Configuring custom SCSS
- Setting default theme in Website Settings
- Configuring branding (favicon, logo, etc.)
- Multiple steps prone to human error
- Inconsistent installations across sites

### Benefits of Automatic Installation

✅ **Automatic installation provides:**
- One-command installation
- Consistent configuration across all sites
- No manual steps required
- Reduced installation time (5 minutes → 30 seconds)
- Fewer support requests
- Easy client deployments
- Reliable, repeatable process

## Architecture

### 1. Fixtures System

**File**: `xgc_theme/fixtures/website_theme.json`

Frappe's fixtures system automatically imports data during app installation. We use it to create:

```json
{
  "doctype": "Website Theme",
  "theme": "XGC Light",
  "custom_scss": "// Variables defined inline",
  "font_properties": {...},
  "background_color": "#ffffff"
}
```

**Configuration**: `xgc_theme/hooks.py`

```python
fixtures = [
    {
        "dt": "Website Theme",
        "filters": [["theme", "in", ["XGC Light", "XGC Dark"]]]
    }
]
```

**How it works:**
1. During `bench install-app xgc_theme`, Frappe reads `fixtures` from hooks.py
2. Frappe imports JSON files from `xgc_theme/fixtures/` directory
3. Website Theme records are created automatically
4. No manual intervention required

### 2. Installation Hooks

**File**: `xgc_theme/install.py`

Installation hooks run custom Python code during app installation:

```python
def after_install():
    """Called after app installation"""
    set_default_theme()           # Set XGC Light as default
    configure_website_settings()  # Configure branding
    frappe.clear_cache()          # Apply changes
```

**Configuration**: `xgc_theme/hooks.py`

```python
after_install = "xgc_theme.install.after_install"
before_install = "xgc_theme.install.before_install"
```

**Execution flow:**
1. User runs: `bench install-app xgc_theme`
2. Frappe calls: `before_install()` (optional pre-checks)
3. Frappe imports fixtures (Website Theme records)
4. Frappe calls: `after_install()` (configuration)
5. Installation complete

### 3. Asset Loading

**File**: `xgc_theme/hooks.py`

Assets are automatically included via hooks:

```python
# Desk (backend) assets
app_include_css = [
    "/assets/xgc_theme/css/xgc_variables.css",
    "/assets/xgc_theme/css/xgc_components.css",
    "/assets/xgc_theme/css/xgc_desk.css"
]

# Website (frontend) assets
web_include_css = [
    "/assets/xgc_theme/css/xgc_variables.css",
    "/assets/xgc_theme/css/xgc_components.css",
    "/assets/xgc_theme/css/xgc_website.css"
]
```

**How it works:**
- Frappe reads these hooks on every page load
- Assets are automatically included in HTML `<head>`
- No manual linking required
- Works for both desk and website

## Installation Flow

```
┌─────────────────────────────────────────────────────────────┐
│ User runs: bench install-app xgc_theme                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 1. Frappe calls: before_install()                           │
│    - Log installation start                                  │
│    - Optional pre-checks                                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Frappe imports fixtures                                   │
│    - Read: xgc_theme/fixtures/website_theme.json            │
│    - Create: Website Theme "XGC Light"                       │
│    - Create: Website Theme "XGC Dark"                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Frappe calls: after_install()                            │
│    - Set XGC Light as default theme                          │
│    - Configure website settings (favicon, logo, app name)    │
│    - Clear cache to apply changes                            │
│    - Show success message to user                            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Installation complete                                     │
│    ✅ Themes created                                         │
│    ✅ Default theme set                                      │
│    ✅ Branding configured                                    │
│    ✅ Assets loaded                                          │
└─────────────────────────────────────────────────────────────┘
```

## Key Files

### Configuration Files

| File | Purpose |
|------|---------|
| `xgc_theme/hooks.py` | Defines fixtures, installation hooks, and asset includes |
| `xgc_theme/install.py` | Installation logic (set default theme, configure settings) |
| `xgc_theme/fixtures/website_theme.json` | Website Theme data to import |

### Asset Files

| File | Purpose |
|------|---------|
| `xgc_theme/public/css/xgc_variables.css` | CSS variables (colors, spacing, etc.) |
| `xgc_theme/public/css/xgc_components.css` | Component styles |
| `xgc_theme/public/css/xgc_desk.css` | Desk-specific styles |
| `xgc_theme/public/css/xgc_website.css` | Website-specific styles |
| `xgc_theme/public/js/xgc_theme.js` | Theme JavaScript |

### Documentation Files

| File | Purpose |
|------|---------|
| `QUICKSTART.md` | 60-second installation guide |
| `INSTALLATION.md` | Detailed installation documentation |
| `AUTOMATIC_INSTALLATION.md` | This file - architecture explanation |
| `WEBSITE_THEME_CONFIGURATION.md` | Theme customization reference |

## Advantages for Client Installations

### 1. Consistency

Every client installation is identical:
- Same theme configuration
- Same branding
- Same asset loading
- No variations due to manual setup

### 2. Speed

Installation time reduced from ~5 minutes to ~30 seconds:
- No manual theme creation
- No manual color setup
- No manual configuration
- One command does everything

### 3. Reliability

Eliminates common installation errors:
- Forgot to set default theme
- Incorrect SCSS variables
- Missing color definitions
- Wrong asset paths
- Typos in configuration

### 4. Maintainability

Easy to update and improve:
- Update fixtures → all new installations get updates
- Update install.py → improved configuration logic
- Update assets → automatic inclusion
- Version control → track all changes

## Comparison: Manual vs Automatic

### Manual Installation (Old Way)

```bash
# 1. Install app
bench install-app xgc_theme

# 2. Login to site
# 3. Go to Color DocType
# 4. Create 10+ color records manually
# 5. Go to Website Theme
# 6. Create XGC Light theme manually
# 7. Configure custom SCSS (copy/paste, risk of errors)
# 8. Create XGC Dark theme manually
# 9. Configure custom SCSS again
# 10. Go to Website Settings
# 11. Set website_theme = "XGC Light"
# 12. Set favicon
# 13. Set brand_html
# 14. Set app_name
# 15. Clear cache
# 16. Test

# Time: ~5 minutes
# Error rate: High (many manual steps)
# Consistency: Low (human variation)
```

### Automatic Installation (New Way)

```bash
# 1. Install app
bench install-app xgc_theme

# Done!

# Time: ~30 seconds
# Error rate: Zero (fully automated)
# Consistency: Perfect (same every time)
```

## Testing

Run installation tests to verify everything works:

```bash
# Run tests
docker exec devcontainer-frappe-1 bash -c "
    cd /workspace/development/frappe-bench
    bench --site dev.localhost run-tests --app xgc_theme --module xgc_theme.tests.test_installation
"
```

Tests verify:
- ✅ App is installed
- ✅ XGC Light theme exists
- ✅ XGC Dark theme exists
- ✅ Default theme is set
- ✅ Website settings configured
- ✅ Custom SCSS defined
- ✅ Assets configured
- ✅ Hooks defined

## Updating Fixtures

When you make changes to themes, export new fixtures:

```bash
# Export fixtures
docker exec devcontainer-frappe-1 bash -c "
    cd /workspace/development/frappe-bench
    bench --site dev.localhost export-fixtures
"

# This updates: xgc_theme/fixtures/website_theme.json
```

## Best Practices

### 1. Keep Fixtures Minimal

Only include essential data:
- ✅ Website Theme records
- ❌ Don't include user data
- ❌ Don't include site-specific data

### 2. Use Installation Hooks for Logic

Put configuration logic in `install.py`:
- ✅ Setting default theme
- ✅ Configuring settings
- ✅ Creating derived data
- ❌ Don't put business logic here

### 3. Test Installation

Always test on a fresh site:
```bash
# Create test site
bench new-site test.local

# Install app
bench --site test.local install-app xgc_theme

# Verify everything works
```

### 4. Document Changes

Update documentation when changing:
- Fixtures → Update INSTALLATION.md
- Install hooks → Update this file
- Assets → Update README.md

## Troubleshooting

### Fixtures Not Importing

```bash
# Manually import
bench --site dev.localhost import-fixtures
```

### Installation Hook Not Running

Check hooks.py:
```python
# Must be uncommented
after_install = "xgc_theme.install.after_install"
```

### Theme Not Applying

```bash
# Clear cache
bench --site dev.localhost clear-cache
bench --site dev.localhost clear-website-cache
bench restart
```

## Future Enhancements

Potential improvements:

1. **Setup Wizard Integration**
   - Add theme selection to setup wizard
   - Configure branding during initial setup

2. **Theme Customization UI**
   - Allow clients to customize colors via UI
   - Generate custom SCSS automatically

3. **Multi-Brand Support**
   - Support multiple brand themes
   - Switch themes per user/role

4. **Theme Marketplace**
   - Package themes for distribution
   - Easy installation from marketplace

---

**Version**: 1.0  
**Last Updated**: February 4, 2026  
**Author**: XGC Development Team
