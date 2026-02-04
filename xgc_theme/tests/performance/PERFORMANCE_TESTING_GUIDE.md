# Performance Testing Guide

This guide explains how to measure and validate the performance of the XGC Theme.

## Prerequisites

### Required Tools

1. **Node.js and npm** (already installed)
2. **Lighthouse** (optional, for detailed audits)
   ```bash
   npm install --save-dev lighthouse chrome-launcher
   ```
3. **Chrome/Chromium browser** (for Lighthouse)

### Frappe Instance

Performance tests require a running Frappe instance:
```bash
# Start Frappe development server
bench start
```

## Running Performance Tests

### 1. Automated Performance Tests

Run the Jest-based performance tests:

```bash
# Run all performance tests
npm test tests/performance/

# Run specific test
npm test tests/performance/test_page_load_performance.test.js
```

These tests validate:
- CSS and JavaScript bundle sizes
- CSS efficiency (specificity, duplicates)
- Asset loading order
- Frappe bundling configuration

### 2. Lighthouse Audits (Manual)

For detailed performance metrics, use Lighthouse:

#### Option A: Chrome DevTools (Recommended for beginners)

1. Open Chrome browser
2. Navigate to your Frappe instance (e.g., `http://localhost:8000`)
3. Open DevTools (F12 or Cmd+Option+I)
4. Go to "Lighthouse" tab
5. Select "Performance" category
6. Choose "Desktop" or "Mobile"
7. Click "Analyze page load"
8. Review the report

#### Option B: Lighthouse CLI

```bash
# Install Lighthouse globally
npm install -g lighthouse

# Run audit on Desk interface (desktop)
lighthouse http://localhost:8000/app --output html --output-path ./lighthouse-desk.html

# Run audit on Website (mobile)
lighthouse http://localhost:8000 --preset=mobile --output html --output-path ./lighthouse-website-mobile.html
```

#### Option C: Automated Script

Use the provided script for consistent audits:

```bash
# Desktop audit
node xgc_theme/tests/performance/run_lighthouse.js --url http://localhost:8000/app

# Mobile audit
node xgc_theme/tests/performance/run_lighthouse.js --url http://localhost:8000 --mobile

# Custom output directory
node xgc_theme/tests/performance/run_lighthouse.js --url http://localhost:8000/app --output ./reports
```

## Interpreting Results

### Performance Score

Lighthouse provides an overall performance score (0-100):

- **90-100**: Excellent ✅
- **50-89**: Needs improvement ⚠️
- **0-49**: Poor ❌

### Core Web Vitals

#### First Contentful Paint (FCP)
- **Good**: < 1.8s (desktop), < 2.5s (mobile)
- **Needs Improvement**: 1.8-3.0s (desktop), 2.5-4.0s (mobile)
- **Poor**: > 3.0s (desktop), > 4.0s (mobile)

#### Largest Contentful Paint (LCP)
- **Good**: < 2.5s (desktop), < 4.0s (mobile)
- **Needs Improvement**: 2.5-4.0s (desktop), 4.0-5.0s (mobile)
- **Poor**: > 4.0s (desktop), > 5.0s (mobile)

#### Time to Interactive (TTI)
- **Good**: < 3.8s (desktop), < 5.0s (mobile)
- **Needs Improvement**: 3.8-7.3s (desktop), 5.0-7.3s (mobile)
- **Poor**: > 7.3s

#### Total Blocking Time (TBT)
- **Good**: < 200ms (desktop), < 300ms (mobile)
- **Needs Improvement**: 200-600ms (desktop), 300-600ms (mobile)
- **Poor**: > 600ms

#### Cumulative Layout Shift (CLS)
- **Good**: < 0.1
- **Needs Improvement**: 0.1-0.25
- **Poor**: > 0.25

### Bundle Sizes

From automated tests:

```
CSS File Sizes:
  xgc_variables.css: X.XX KB
  xgc_components.css: X.XX KB
  xgc_desk.css: X.XX KB
  xgc_website.css: X.XX KB
  xgc_dark.css: X.XX KB
  Total: X.XX KB

JavaScript File Sizes:
  xgc_theme.js: X.XX KB
  Total: X.XX KB
```

**Acceptable Limits:**
- Total CSS (unminified): < 150 KB
- Total JavaScript (unminified): < 30 KB

## Comparing with Default Theme

To validate Requirement 13.5 (no more than 10% slower):

### Step 1: Measure XGC Theme Performance

```bash
# Run Lighthouse on XGC Theme
node xgc_theme/tests/performance/run_lighthouse.js --url http://localhost:8000/app --output ./reports/xgc
```

### Step 2: Switch to Default Theme

1. Log in to Frappe
2. Go to User Settings
3. Change theme to "Frappe Light" or "Frappe Dark"
4. Refresh the page

### Step 3: Measure Default Theme Performance

```bash
# Run Lighthouse on default theme
node xgc_theme/tests/performance/run_lighthouse.js --url http://localhost:8000/app --output ./reports/default
```

### Step 4: Compare Results

Calculate the percentage difference:

```
Difference = ((XGC_Metric - Default_Metric) / Default_Metric) × 100%
```

**Acceptance Criteria:**
- Performance degradation should be ≤ 10% for all metrics
- CSS bundle size increase should be ≤ 20%
- JavaScript bundle size increase should be ≤ 15%

Example:
```
Metric                    | Default | XGC Theme | Difference
--------------------------|---------|-----------|------------
Performance Score         | 95      | 92        | -3.2%  ✅
First Contentful Paint    | 1.2s    | 1.3s      | +8.3%  ✅
Largest Contentful Paint  | 2.0s    | 2.1s      | +5.0%  ✅
Time to Interactive       | 3.0s    | 3.2s      | +6.7%  ✅
Total Blocking Time       | 150ms   | 165ms     | +10.0% ✅
```

## Troubleshooting Performance Issues

### Issue: Large CSS Bundle Size

**Solutions:**
1. Remove unused CSS selectors
2. Reduce CSS specificity
3. Eliminate duplicate rules
4. Minify CSS files

### Issue: Large JavaScript Bundle Size

**Solutions:**
1. Remove unused JavaScript code
2. Minimize dependencies
3. Use code splitting
4. Minify JavaScript files

### Issue: Slow First Contentful Paint

**Solutions:**
1. Optimize critical CSS (inline above-the-fold styles)
2. Defer non-critical CSS
3. Optimize font loading
4. Reduce render-blocking resources

### Issue: High Total Blocking Time

**Solutions:**
1. Reduce JavaScript execution time
2. Break up long tasks
3. Defer non-critical JavaScript
4. Use web workers for heavy computations

### Issue: Poor Cumulative Layout Shift

**Solutions:**
1. Specify image dimensions
2. Reserve space for dynamic content
3. Avoid inserting content above existing content
4. Use CSS transforms instead of layout-triggering properties

## Continuous Monitoring

### During Development

Run automated tests frequently:
```bash
npm test tests/performance/
```

### Before Deployment

Run full Lighthouse audits:
```bash
# Desktop
node xgc_theme/tests/performance/run_lighthouse.js --url http://localhost:8000/app

# Mobile
node xgc_theme/tests/performance/run_lighthouse.js --url http://localhost:8000 --mobile
```

### After Deployment

Monitor real-user metrics using:
- Google Analytics (Core Web Vitals report)
- Frappe's built-in monitoring (if available)
- Custom performance monitoring tools

## Performance Optimization Checklist

- [ ] CSS bundle size < 150 KB (unminified)
- [ ] JavaScript bundle size < 30 KB (unminified)
- [ ] No excessive CSS specificity (< 10 deep selectors)
- [ ] Minimal duplicate CSS selectors (< 20)
- [ ] Assets loaded in correct order (variables → components → context)
- [ ] Frappe asset bundling configured correctly
- [ ] Performance score ≥ 90 (desktop)
- [ ] Performance score ≥ 85 (mobile)
- [ ] FCP < 1.8s (desktop), < 2.5s (mobile)
- [ ] LCP < 2.5s (desktop), < 4.0s (mobile)
- [ ] TTI < 3.8s (desktop), < 5.0s (mobile)
- [ ] TBT < 200ms (desktop), < 300ms (mobile)
- [ ] CLS < 0.1
- [ ] Performance degradation ≤ 10% vs default theme

## Resources

- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [Web Vitals](https://web.dev/vitals/)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [Frappe Framework Documentation](https://frappeframework.com/docs)
