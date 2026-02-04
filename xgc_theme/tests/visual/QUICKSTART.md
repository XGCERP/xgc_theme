# Visual Regression Testing - Quick Start Guide

## Prerequisites

1. **Frappe instance running**: Ensure your Frappe development server is running on `http://localhost:8000`
   ```bash
   bench start
   ```

2. **XGC Theme installed**: The xgc_theme app should be installed and selected as the active theme

3. **Authentication (for Desk tests)**: Set up cookies for authenticated pages

## Setup Authentication (One-time)

### Step 1: Log in to Frappe
Open your browser and log in to `http://localhost:8000`

### Step 2: Extract Session Cookie
1. Open Browser DevTools (F12)
2. Go to Application/Storage → Cookies
3. Find the `sid` cookie and copy its value

### Step 3: Create cookies.json
```bash
cd tests/visual/backstop_data/engine_scripts
cp cookies.json.example cookies.json
```

Edit `cookies.json` and replace `your-session-id-here` with your actual `sid` value.

## Running Visual Tests

### First Time: Generate Baseline Screenshots

```bash
npm run visual:reference
```

This creates baseline screenshots in `tests/visual/backstop_data/bitmaps_reference/`.

**Expected output**: 
- Screenshots captured for all scenarios
- No errors or failures
- Baseline images saved

### Regular Testing: Compare Against Baseline

```bash
npm run visual:test
```

This captures new screenshots and compares them to the baseline.

**Expected output**:
- Browser opens with comparison report
- Green checkmarks for matching scenarios
- Red indicators for differences (if any)

### Approve Changes (if intentional)

```bash
npm run visual:approve
```

This updates the baseline with the new screenshots.

**When to approve**:
- After intentional design changes
- After updating brand colors
- After modifying component styles

### View Report (without running tests)

```bash
npm run visual:report
```

Opens the last generated report in your browser.

## Common Scenarios

### Scenario 1: Testing a CSS Change

1. Make changes to CSS files (e.g., `xgc_components.css`)
2. Rebuild assets: `bench build --app xgc_theme`
3. Clear cache: `bench clear-cache`
4. Run visual test: `npm run visual:test`
5. Review differences in the report
6. If changes are correct: `npm run visual:approve`

### Scenario 2: Testing Dark Theme

Dark theme scenarios are automatically included in the test suite. They use the `setDarkTheme.js` script to switch themes before capture.

### Scenario 3: Testing Responsive Design

All scenarios test three viewports automatically:
- Mobile: 320px width
- Tablet: 768px width
- Desktop: 1920px width

### Scenario 4: Testing Specific Components

To test only specific scenarios, edit `backstop.config.js` and comment out unwanted scenarios, or use BackstopJS filters:

```bash
npx backstopjs test --config=backstop.config.js --filter="Desk - Sidebar"
```

## Troubleshooting

### Problem: "Connection refused" errors
**Solution**: Ensure Frappe is running on `http://localhost:8000`

### Problem: "Selector not found" errors
**Solution**: 
- Check that the page URL is correct
- Ensure the selector exists on the page
- Increase the `delay` in scenario configuration

### Problem: Authentication failures (Desk tests)
**Solution**:
- Verify `cookies.json` exists and has valid session data
- Log in again and update the `sid` cookie value
- Check that the cookie domain matches your Frappe instance

### Problem: Too many false positives
**Solution**:
- Increase `misMatchThreshold` in `backstop.config.js`
- Add dynamic elements to the hide list in `onReady.js`
- Ensure fonts are fully loaded before capture

### Problem: Tests are too slow
**Solution**:
- Reduce the number of scenarios
- Decrease `delay` values if pages load quickly
- Adjust `asyncCaptureLimit` in config (default: 5)

## Understanding the Report

### Green Checkmark ✓
- Screenshot matches baseline
- No visual changes detected
- Test passed

### Red X ✗
- Visual differences detected
- Review the comparison images
- Determine if change is intentional or a bug

### Report Sections
- **Reference**: Original baseline screenshot
- **Test**: New screenshot from current test
- **Diff**: Highlighted differences (pink overlay)

## Best Practices

1. **Run tests before committing**: Catch visual regressions early
2. **Review all differences**: Don't blindly approve changes
3. **Keep baselines updated**: Regenerate after intentional changes
4. **Test all viewports**: Ensure responsive design works
5. **Test both themes**: Verify light and dark variants
6. **Document changes**: Note visual changes in commit messages
7. **Use version control**: Commit baseline screenshots

## Advanced Usage

### Custom Scenarios

Edit `backstop.config.js` to add new scenarios:

```javascript
{
  label: "My Custom Test",
  url: "http://localhost:8000/my-page",
  selectors: [".my-component"],
  delay: 1000
}
```

### Custom Puppeteer Scripts

Create new scripts in `tests/visual/backstop_data/engine_scripts/puppet/` for custom interactions:

```javascript
module.exports = async (page, scenario, vp) => {
  // Your custom code here
  await page.click('.my-button');
  await page.waitForTimeout(500);
};
```

### CI/CD Integration

For automated testing in CI pipelines:

```bash
backstopjs test --config=backstop.config.js --ci
```

This generates a JSON report instead of opening a browser.

## Next Steps

1. Generate your first baseline: `npm run visual:reference`
2. Make a small CSS change
3. Run a test: `npm run visual:test`
4. Review the report
5. Approve if correct: `npm run visual:approve`

For detailed scenario descriptions, see [SCENARIOS.md](./SCENARIOS.md).

For full documentation, see [README.md](./README.md).
