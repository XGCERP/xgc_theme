# XGC Theme - Client Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Verification

- [ ] Frappe version: v14 or higher
- [ ] ERPNext version: v14 or higher (if applicable)
- [ ] Python version: 3.10 or higher
- [ ] Node.js version: 16 or higher
- [ ] Site backup taken
- [ ] Staging environment tested

### 2. App Preparation

- [ ] Latest version pulled from repository
- [ ] All tests passing
- [ ] Documentation reviewed
- [ ] Custom configurations documented

### 3. Client Communication

- [ ] Deployment window scheduled
- [ ] Client notified of downtime (if any)
- [ ] Rollback plan communicated
- [ ] Support contact information provided

---

## Deployment Steps

### Step 1: Backup

```bash
# Create full backup
bench --site client-site.com backup --with-files

# Verify backup created
ls -lh sites/client-site.com/private/backups/
```

### Step 2: Get App

```bash
# Navigate to bench directory
cd ~/frappe-bench

# Get app from repository
bench get-app https://github.com/your-org/xgc_theme.git

# Or from local path
bench get-app /path/to/xgc_theme
```

### Step 3: Install App

```bash
# Install on site
bench --site client-site.com install-app xgc_theme

# Expected output:
# Installing xgc_theme...
# XGC Theme: Starting installation...
# XGC Theme: Set 'XGC Light' as default theme
# XGC Theme: Configured website settings
# XGC Theme: Installation completed successfully!
```

### Step 4: Build Assets

```bash
# Build app assets
bench build --app xgc_theme

# Or build all
bench build
```

### Step 5: Clear Cache

```bash
# Clear all caches
bench --site client-site.com clear-cache
bench --site client-site.com clear-website-cache
```

### Step 6: Restart Services

```bash
# Development
bench restart

# Production (supervisor)
sudo supervisorctl restart all

# Production (systemd)
sudo systemctl restart frappe-bench-web
sudo systemctl restart frappe-bench-workers
```

---

## Verification

### 1. Check Installation

```bash
# Verify app is installed
bench --site client-site.com list-apps

# Should show:
# frappe
# erpnext (if applicable)
# xgc_theme
```

### 2. Verify Theme in UI

1. Login to site: `https://client-site.com`
2. Go to: **Setup > Website > Website Settings**
3. Verify: **Website Theme** = "XGC Light"
4. Go to: **Setup > Website > Website Theme**
5. Verify: Both "XGC Light" and "XGC Dark" exist

### 3. Test Website

1. Visit: `https://client-site.com`
2. Check:
   - [ ] XGC branding visible
   - [ ] Forest green color scheme applied
   - [ ] Favicon shows XGC logo
   - [ ] Navigation works correctly
   - [ ] Responsive design on mobile

### 4. Test Desk

1. Login to desk: `https://client-site.com/app`
2. Check:
   - [ ] Theme styling applied
   - [ ] Forms render correctly
   - [ ] Lists display properly
   - [ ] Buttons styled correctly
   - [ ] No console errors

### 5. Run Tests (Optional)

```bash
# Run installation tests
bench --site client-site.com run-tests \
    --app xgc_theme \
    --module xgc_theme.tests.test_installation
```

---

## Post-Deployment

### 1. Monitor Logs

```bash
# Watch logs for errors
tail -f sites/client-site.com/logs/web.log

# Check for XGC Theme messages
grep "XGC Theme" sites/client-site.com/logs/web.log
```

### 2. User Training

Provide training on:
- [ ] Theme features
- [ ] Dark mode option (if needed)
- [ ] Responsive design
- [ ] Any custom functionality

### 3. Documentation

Provide client with:
- [ ] QUICKSTART.md
- [ ] INSTALLATION.md
- [ ] Support contact information
- [ ] Troubleshooting guide

### 4. Support Handoff

- [ ] Document any custom configurations
- [ ] Note any client-specific requirements
- [ ] Set up monitoring/alerts
- [ ] Schedule follow-up check-in

---

## Rollback Procedure

If issues occur, rollback using these steps:

### Step 1: Uninstall App

```bash
# Uninstall app
bench --site client-site.com uninstall-app xgc_theme
```

### Step 2: Restore Backup

```bash
# List backups
ls -lh sites/client-site.com/private/backups/

# Restore backup
bench --site client-site.com restore \
    sites/client-site.com/private/backups/YYYYMMDD_HHMMSS-client-site-com-database.sql.gz \
    --with-private-files \
    --with-public-files
```

### Step 3: Restart Services

```bash
# Restart
bench restart

# Or for production
sudo supervisorctl restart all
```

### Step 4: Verify

- [ ] Site accessible
- [ ] Data intact
- [ ] Original theme restored
- [ ] No errors in logs

---

## Troubleshooting

### Theme Not Applying

**Symptoms:**
- Site looks like default Frappe theme
- XGC colors not visible

**Solution:**
```bash
# 1. Verify theme is set
bench --site client-site.com console
>>> frappe.get_single("Website Settings").website_theme
'XGC Light'  # Should show this

# 2. Rebuild assets
bench build --app xgc_theme

# 3. Clear cache
bench --site client-site.com clear-cache
bench --site client-site.com clear-website-cache

# 4. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
```

### SCSS Compilation Errors

**Symptoms:**
- Error when saving Website Theme
- "Undefined variable" errors

**Solution:**
```bash
# Check custom SCSS in Website Theme
# Ensure variables are defined before use

# Example correct order:
# 1. Define variables
$xgc-primary: #2E7D32;

# 2. Use variables
.navbar { background: $xgc-primary; }
```

### Assets Not Loading

**Symptoms:**
- 404 errors for CSS/JS files
- Styling partially applied

**Solution:**
```bash
# 1. Rebuild assets
bench build --app xgc_theme

# 2. Check file permissions
ls -la sites/assets/xgc_theme/

# 3. Verify hooks.py configuration
cat apps/xgc_theme/xgc_theme/hooks.py | grep include_css
```

### Installation Hook Failed

**Symptoms:**
- App installs but theme not set
- Website settings not configured

**Solution:**
```bash
# Manually run after_install
bench --site client-site.com console
>>> from xgc_theme.install import after_install
>>> after_install()
```

---

## Common Client Questions

### Q: Can we customize the colors?

**A:** Yes! Edit the Website Theme:
1. Go to: **Setup > Website > Website Theme > XGC Light**
2. Modify **Custom SCSS** section
3. Change color values (e.g., `$xgc-primary: #YOUR_COLOR;`)
4. Save and clear cache

### Q: How do we switch to dark mode?

**A:** Change in Website Settings:
1. Go to: **Setup > Website > Website Settings**
2. Change **Website Theme** to "XGC Dark"
3. Save and clear cache

### Q: Can we have multiple themes?

**A:** Yes! You can:
1. Duplicate existing theme
2. Modify colors and styling
3. Switch between themes in Website Settings

### Q: How do we update the theme?

**A:** Update the app:
```bash
# Pull latest changes
cd ~/frappe-bench/apps/xgc_theme
git pull

# Migrate site
bench --site client-site.com migrate

# Build assets
bench build --app xgc_theme

# Clear cache
bench --site client-site.com clear-cache
```

---

## Support Escalation

### Level 1: Client Self-Service

Resources:
- QUICKSTART.md
- INSTALLATION.md
- This deployment guide

### Level 2: Technical Support

Contact:
- Email: support@xgccorp.com
- Documentation: [Link to docs]
- Forum: [Link to forum]

### Level 3: Development Team

For critical issues:
- Emergency contact: [Phone/Email]
- Issue tracker: [GitHub/GitLab link]
- Response time: [SLA]

---

## Deployment Checklist Summary

### Pre-Deployment
- [ ] Environment verified
- [ ] Backup taken
- [ ] Client notified

### Deployment
- [ ] App installed
- [ ] Assets built
- [ ] Cache cleared
- [ ] Services restarted

### Verification
- [ ] Installation confirmed
- [ ] Theme applied
- [ ] Website tested
- [ ] Desk tested

### Post-Deployment
- [ ] Logs monitored
- [ ] Users trained
- [ ] Documentation provided
- [ ] Support handoff complete

---

**Deployment Version**: 1.0  
**Last Updated**: February 4, 2026  
**Next Review**: [Date]
