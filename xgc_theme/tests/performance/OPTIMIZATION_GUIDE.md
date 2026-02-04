# Asset Optimization Guide

This guide explains how to optimize CSS and JavaScript assets for the XGC Theme to meet performance requirements.

## Requirements

This optimization addresses:
- **Requirement 13.1**: Minimize CSS file sizes through efficient selectors
- **Requirement 13.2**: Minimize JavaScript file sizes by including only necessary code
- **Requirement 13.4**: Avoid unnecessary CSS specificity that could impact rendering performance

## Quick Start

### 1. Analyze Current Assets

Run the optimization script in dry-run mode to see potential improvements:

```bash
node xgc_theme/tests/performance/optimize_assets.js --dry-run
```

This will show:
- Current file sizes
- Potential savings from minification
- Optimization issues (specificity, duplicates, console statements)

### 2. Generate Optimized Assets

Create minified versions of all assets:

```bash
node xgc_theme/tests/performance/optimize_assets.js
```

Optimized files will be saved to `xgc_theme/public/dist/` with `.min.css` and `.min.js` extensions.

### 3. Use Production Tools (Recommended)

For production deployments, use professional optimization tools:

```bash
# Install optimization tools
npm install --save-dev cssnano postcss-cli terser purgecss

# Optimize CSS with cssnano
npx postcss public/css/*.css --use cssnano --dir public/dist/css

# Minify JavaScript with terser
npx terser public/js/xgc_theme.js -o public/dist/js/xgc_theme.min.js --compress --mangle

# Remove unused CSS with PurgeCSS (requires configuration)
npx purgecss --css public/css/*.css --content templates/**/*.html --output public/dist/css
```

## Optimization Techniques

### CSS Optimization

#### 1. Minification

Removes unnecessary characters without changing functionality:
- Comments
- Whitespace
- Line breaks
- Empty rules

**Before (30 KB):**
```css
/* Button styles */
.btn {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    transition: all 0.2s ease;
}

.btn:hover {
    transform: translateY(-1px);
}
```

**After (15 KB):**
```css
.btn{padding:.5rem 1rem;border-radius:.375rem;transition:all .2s ease}.btn:hover{transform:translateY(-1px)}
```

#### 2. Reduce CSS Specificity

Overly specific selectors slow down rendering:

**Bad (slow):**
```css
.page-container .content-wrapper .card-list .card-item .card-header .card-title {
    color: var(--xgc-forest-green);
}
```

**Good (fast):**
```css
.card-title {
    color: var(--xgc-forest-green);
}
```

#### 3. Eliminate Duplicate Selectors

Consolidate repeated rules:

**Before:**
```css
.btn-primary { background: var(--xgc-forest-green); }
.btn-primary { color: white; }
.btn-primary { border: none; }
```

**After:**
```css
.btn-primary {
    background: var(--xgc-forest-green);
    color: white;
    border: none;
}
```

#### 4. Remove Unused CSS

Use PurgeCSS to remove selectors not used in your templates:

```bash
# Create purgecss.config.js
cat > purgecss.config.js << 'EOF'
module.exports = {
  content: [
    './templates/**/*.html',
    './templates/**/*.py',
    './public/js/**/*.js'
  ],
  css: ['./public/css/**/*.css'],
  safelist: [
    // Add classes that are dynamically added via JavaScript
    'theme-transitioning',
    'mobile-view',
    'tablet-view',
    'desktop-view'
  ]
}
EOF

# Run PurgeCSS
npx purgecss --config purgecss.config.js --output public/dist/css
```

### JavaScript Optimization

#### 1. Minification

Removes unnecessary characters and shortens variable names:

**Before (8 KB):**
```javascript
function setupThemeSwitcher() {
    const themeSwitcher = document.querySelector('.theme-switcher');
    if (themeSwitcher) {
        themeSwitcher.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
        });
    }
}
```

**After (4 KB):**
```javascript
function setupThemeSwitcher(){const t=document.querySelector('.theme-switcher');t&&t.addEventListener('click',function(){document.body.classList.toggle('dark-mode')})}
```

#### 2. Remove Console Statements

Remove debugging code in production:

**Before:**
```javascript
function init() {
    console.log('Initializing XGC Theme');
    setupThemeSwitcher();
    console.log('Theme initialized');
}
```

**After:**
```javascript
function init() {
    setupThemeSwitcher();
}
```

#### 3. Code Splitting

Split large JavaScript files into smaller chunks:

```javascript
// xgc_theme_core.js - Essential functionality
// xgc_theme_desk.js - Desk-specific features
// xgc_theme_website.js - Website-specific features
```

Register conditionally in hooks.py:
```python
app_include_js = [
    "/assets/xgc_theme/js/xgc_theme_core.min.js"
]

# Only load desk features in Desk
desk_include_js = [
    "/assets/xgc_theme/js/xgc_theme_desk.min.js"
]

# Only load website features on Website
web_include_js = [
    "/assets/xgc_theme/js/xgc_theme_website.min.js"
]
```

## Optimization Workflow

### Development

During development, use unminified files for easier debugging:

```python
# hooks.py
app_include_css = [
    "/assets/xgc_theme/css/xgc_variables.css",
    "/assets/xgc_theme/css/xgc_components.css",
    "/assets/xgc_theme/css/xgc_desk.css"
]
```

### Production

For production, switch to minified files:

```python
# hooks.py
app_include_css = [
    "/assets/xgc_theme/css/xgc_variables.min.css",
    "/assets/xgc_theme/css/xgc_components.min.css",
    "/assets/xgc_theme/css/xgc_desk.min.css"
]
```

Or use environment-based configuration:

```python
# hooks.py
import os

is_production = os.getenv('FRAPPE_ENV') == 'production'
css_ext = '.min.css' if is_production else '.css'
js_ext = '.min.js' if is_production else '.js'

app_include_css = [
    f"/assets/xgc_theme/css/xgc_variables{css_ext}",
    f"/assets/xgc_theme/css/xgc_components{css_ext}",
    f"/assets/xgc_theme/css/xgc_desk{css_ext}"
]
```

## Automated Optimization

### NPM Scripts

Add optimization scripts to package.json:

```json
{
  "scripts": {
    "optimize": "node tests/performance/optimize_assets.js",
    "optimize:dry-run": "node tests/performance/optimize_assets.js --dry-run",
    "optimize:css": "postcss public/css/*.css --use cssnano --dir public/dist/css",
    "optimize:js": "terser public/js/xgc_theme.js -o public/dist/js/xgc_theme.min.js --compress --mangle",
    "optimize:all": "npm run optimize:css && npm run optimize:js"
  }
}
```

### Pre-commit Hook

Automatically optimize assets before committing:

```bash
# .git/hooks/pre-commit
#!/bin/sh
npm run optimize:dry-run
```

### CI/CD Integration

Add optimization to your deployment pipeline:

```yaml
# .github/workflows/deploy.yml
- name: Optimize Assets
  run: |
    npm install
    npm run optimize:all
    
- name: Build Frappe Assets
  run: |
    bench build --app xgc_theme
```

## Measuring Optimization Impact

### Before Optimization

```bash
# Run performance tests
npm test tests/performance/test_page_load_performance.test.js
```

Expected output:
```
CSS File Sizes:
  xgc_variables.css: 5.91 KB
  xgc_components.css: 30.27 KB
  xgc_desk.css: 10.60 KB
  xgc_website.css: 36.29 KB
  xgc_dark.css: 10.61 KB
  Total: 93.67 KB

JavaScript File Sizes:
  xgc_theme.js: 8.66 KB
  Total: 8.66 KB
```

### After Optimization

Expected improvements:
```
CSS File Sizes (minified):
  xgc_variables.min.css: 3.50 KB (-40%)
  xgc_components.min.css: 18.00 KB (-40%)
  xgc_desk.min.css: 6.30 KB (-40%)
  xgc_website.min.css: 21.50 KB (-40%)
  xgc_dark.min.css: 6.30 KB (-40%)
  Total: 55.60 KB (-40%)

JavaScript File Sizes (minified):
  xgc_theme.min.js: 4.30 KB (-50%)
  Total: 4.30 KB (-50%)
```

### Gzipped Sizes

With server compression enabled:
```
CSS (gzipped): ~15 KB (-84% from original)
JavaScript (gzipped): ~2 KB (-77% from original)
```

## Troubleshooting

### Issue: Minified CSS breaks styling

**Cause**: CSS minifier removed important whitespace or comments

**Solution**: 
1. Check for CSS hacks that rely on comments
2. Use a more conservative minifier
3. Add safelist for specific selectors

### Issue: Minified JavaScript causes errors

**Cause**: Minifier mangled variable names that are accessed externally

**Solution**:
1. Use `--mangle reserved=['frappe','$']` to preserve specific names
2. Mark global variables with `window.variableName`
3. Use `--keep-fnames` to preserve function names

### Issue: PurgeCSS removes needed styles

**Cause**: Styles are applied to dynamically generated elements

**Solution**:
Add to safelist in purgecss.config.js:
```javascript
safelist: [
  'theme-transitioning',
  'mobile-view',
  /^frappe-/,  // Preserve all frappe- prefixed classes
  /^btn-/      // Preserve all button variants
]
```

## Best Practices

1. **Always test after optimization**: Run visual regression tests to catch styling issues
2. **Keep source files**: Never overwrite original files with minified versions
3. **Use source maps**: Generate source maps for easier debugging in production
4. **Optimize images**: Don't forget to optimize image assets as well
5. **Enable compression**: Configure server to serve gzipped assets
6. **Monitor bundle sizes**: Set up alerts if bundle sizes exceed thresholds
7. **Regular audits**: Run Lighthouse audits regularly to catch regressions

## Resources

- [cssnano Documentation](https://cssnano.co/)
- [Terser Documentation](https://terser.org/)
- [PurgeCSS Documentation](https://purgecss.com/)
- [Web.dev: Minify CSS](https://web.dev/minify-css/)
- [Web.dev: Minify JavaScript](https://web.dev/minify-javascript/)
