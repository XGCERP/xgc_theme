# Performance Testing

This directory contains performance tests for the XGC Theme to ensure optimal page load times and rendering performance.

## Overview

Performance tests measure:
- Page load time
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Total Blocking Time (TBT)
- Cumulative Layout Shift (CLS)
- CSS and JavaScript bundle sizes

## Requirements

Performance tests validate:
- **Requirement 13.1**: Minimize CSS file sizes through efficient selectors
- **Requirement 13.2**: Minimize JavaScript file sizes by including only necessary code
- **Requirement 13.3**: Leverage Frappe's asset bundling for optimal loading
- **Requirement 13.5**: No noticeable performance degradation (>10% slower than default theme)

## Running Tests

### Automated Performance Tests

```bash
# Run all performance tests
npm run test:performance

# Run specific performance test
npm test tests/performance/test_page_load_performance.test.js
```

### Manual Lighthouse Testing

```bash
# Run Lighthouse audit on Desk interface
npm run lighthouse:desk

# Run Lighthouse audit on Website interface
npm run lighthouse:website

# Generate performance report
npm run lighthouse:report
```

## Performance Benchmarks

### Target Metrics (Desktop)
- **Performance Score**: ≥ 90
- **First Contentful Paint**: < 1.8s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.8s
- **Total Blocking Time**: < 200ms
- **Cumulative Layout Shift**: < 0.1

### Target Metrics (Mobile)
- **Performance Score**: ≥ 85
- **First Contentful Paint**: < 2.5s
- **Largest Contentful Paint**: < 4.0s
- **Time to Interactive**: < 5.0s
- **Total Blocking Time**: < 300ms
- **Cumulative Layout Shift**: < 0.1

### Comparison with Default Theme
- XGC Theme should not be more than 10% slower than default Frappe theme
- CSS bundle size should not exceed default theme by more than 20%
- JavaScript bundle size should not exceed default theme by more than 15%

## Test Files

- `test_page_load_performance.test.js` - Automated performance measurements
- `test_asset_sizes.test.js` - CSS and JavaScript bundle size validation
- `lighthouse.config.js` - Lighthouse configuration for manual audits
- `run_lighthouse.js` - Script to run Lighthouse audits programmatically

## Interpreting Results

### Performance Score
- **90-100**: Excellent - No optimization needed
- **50-89**: Good - Minor optimizations recommended
- **0-49**: Poor - Significant optimization required

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: Measures loading performance
- **FID (First Input Delay)**: Measures interactivity
- **CLS (Cumulative Layout Shift)**: Measures visual stability

### Action Items
If performance tests fail:
1. Review CSS specificity and remove unused selectors
2. Minify CSS and JavaScript files
3. Optimize image assets
4. Enable compression and caching
5. Consider code splitting for large bundles
