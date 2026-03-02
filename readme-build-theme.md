# Building XGC Website Themes Manually in Frappe

Navigate to: **Website → Website Theme → New**

---

## XGC Light Theme

| Field | Value |
|---|---|
| **Theme Name** | `XGC Light` |
| **Google Font** | `Inter` |
| **Font Size** | `16px` |
| **Font Properties** | `wght@300;400;500;600;700` |
| **Button Rounded Corners** | ✅ Checked |
| **Button Shadows** | ✅ Checked |
| **Button Gradients** | ☐ Unchecked |
| **Primary Color** | `#2d5016` |
| **Text Color** | `#1e293b` |
| **Light Color** | `#3d6b1f` |
| **Dark Color** | `#1d3a0f` |
| **Background Color** | `#ffffff` |

**Stylesheet** (leave blank — handled by `app_include_css` in hooks.py)

**Script** (leave blank — handled by `app_include_js` in hooks.py)

**Custom SCSS:**
```scss
// XGC Light Theme
$primary: #2d5016;
$primary-light: #3d6b1f;
$primary-dark: #1d3a0f;
$font-family-sans-serif: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
$font-size-base: 1rem;
$bg-color: #ffffff;
$text-color: #1e293b;
$border-color: #e2e8f0;
```

**Include Theme from Apps** — check all installed:
- ✅ ERPNext
- ✅ Frappe CRM
- ✅ Frappe Framework
- ✅ Frappe HR
- ✅ Frappe Insights
- ✅ Raven

---

## XGC Dark Theme

| Field | Value |
|---|---|
| **Theme Name** | `XGC Dark` |
| **Google Font** | `Inter` |
| **Font Size** | `16px` |
| **Font Properties** | `wght@300;400;500;600;700` |
| **Button Rounded Corners** | ✅ Checked |
| **Button Shadows** | ✅ Checked |
| **Button Gradients** | ☐ Unchecked |
| **Primary Color** | `#4a7c2a` |
| **Text Color** | `#e2e8f0` |
| **Light Color** | `#5a9c3a` |
| **Dark Color** | `#3a6c1a` |
| **Background Color** | `#0f172a` |

**Stylesheet** (leave blank)

**Script** (leave blank)

**Custom SCSS:**
```scss
// XGC Dark Theme
$primary: #4a7c2a;
$primary-light: #5a9c3a;
$primary-dark: #3a6c1a;
$font-family-sans-serif: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
$font-size-base: 1rem;
$bg-color: #0f172a;
$surface-color: #1e293b;
$text-color: #e2e8f0;
$border-color: #334155;
```

**Include Theme from Apps** — check all installed:
- ✅ ERPNext
- ✅ Frappe CRM
- ✅ Frappe Framework
- ✅ Frappe HR
- ✅ Frappe Insights
- ✅ Raven

---

## Activate the Theme

1. Go to **Website → Website Settings**
2. Set **Website Theme** to `XGC Light` (or `XGC Dark`)
3. Save
4. Run `bench --site <site> clear-cache` or use **Settings → Clear Cache** in the desk

---

## How the App CSS Layers Work

The `xgc_theme` app injects CSS into the **desk** (admin UI) on every page via `hooks.py`:

```
xgc_variables.css   → CSS custom properties (:root tokens, overrides Frappe v16 --primary etc.)
xgc_components.css  → Buttons, forms, cards, tables, modals
xgc_desk.css        → Navbar, sidebar (.standard-sidebar), page layout (.layout-main-section)
xgc_dark.css        → Loaded only when XGC Dark theme is active (overrides all tokens for dark)
```

The **Website Theme** record (built above) controls the **public-facing website** (portal pages). The desk and website are styled independently.

---

## Export as Fixture (after manual creation)

Once you have saved both themes manually, export them so future installs are automatic:

```bash
bench --site <site> export-fixtures --app xgc_theme
```

This updates `xgc_theme/fixtures/website_theme.json` with the exact values you entered.

---

## Color Reference

| Token | Light | Dark |
|---|---|---|
| Primary | `#2d5016` (forest green) | `#4a7c2a` (lighter green) |
| Primary Light | `#3d6b1f` | `#5a9c3a` |
| Primary Dark | `#1d3a0f` | `#3a6c1a` |
| Gold Accent | `#9c7a10` | `#f0c14b` |
| Background | `#ffffff` | `#0f172a` |
| Surface | `#f9fafb` | `#1e293b` |
| Text | `#1e293b` | `#e2e8f0` |
| Border | `#e2e8f0` | `#334155` |
