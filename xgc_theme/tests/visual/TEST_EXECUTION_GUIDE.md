# Visual Regression Test Execution Guide

This guide provides detailed instructions for executing visual regression tests for the XGC Theme.

## Prerequisites Checklist

Before running visual regression tests, ensure:

- [ ] Frappe/ERPNext v16 instance is installed
- [ ] xgc_theme app is installed in the Frappe instance
- [ ] Frappe development server is running on `http://localhost:8000`
- [ ] XGC Theme is selected as the active theme
- [ ] Node.js dependencies are installed (`npm install`)
- [ ] BackstopJS is installed (included in devDependencies)

## Test Execution Phases

### Phase 1: Initial Setup (One-time)

#### Step 1: Start Frappe Instance

```bash
# Navigate to your Frappe bench directory
cd /path/to/frappe-bench

# Start the development server
bench start
```

Verify Frappe is running by visiting `http://localhost:8000` in your browser.

#### Step 2: Configure Authentication

For Desk interface tests, you need to provide authentication cookies:

1. **Log in to Frappe**:
   - Open `http://localhost:8000` in your browser
   - Log in with Administrator credentials

2. **Extract Session Cookie**:
   - Open Browser DevTools (F12 or Cmd+Option+I)
   - Navigate to: Application → Storage → Cookies → http://localhost:8000
   - Find the `sid` cookie
   - Copy its value (long alphanumeric string)

3. **Create cookies.json**:
   ```bash
   cd xgc_theme/tests/visual/backstop_data/engine_scripts
   cp cookies.json.example cookies.json
   ```

4. **Update cookies.json**:
   ```json
   [
     {
       "name": "sid",
       "value": "YOUR_ACTUAL_SID_VALUE_HERE",
       "domain": "localhost",
       "path": "/",
       "httpOnly": true,
       "secure": false
     },
     {
       "name": "user_id",
       "value": "Administrator",
       "domain": "localhost",
       "path": "/",
       "httpOnly": false,
       "secure": false
     }
   ]
   ```

#### Step 3: Verify Theme Installation

1. Log in to Frappe Desk
2. Go to: Settings → Theme Switcher
3. Verify "XGC Light" and "XGC Dark" themes are available
4. Select "XGC Light" as the active theme
5. Refresh the page to ensure theme is applied

### Phase 2: Generate Baseline Screenshots

Baseline screenshots represent the "correct" visual state of your application. Generate them when:
- Running tests for the first time
- After intentional design changes that you want to make the new baseline
- After major theme updates

#### Command:

```bash
cd xgc_theme
npm run visual:reference
```

#### What Happens:

1. BackstopJS launches a headless browser (Puppeteer)
2. Navigates to each scenario URL
3. Applies viewport sizes (mobile, tablet, desktop)
4. Waits for page to load and stabilize
5. Captures screenshots
6. Saves screenshots to `tests/visual/backstop_data/bitmaps_reference/`

#### Expected Output:

```
BackstopJS Reference
...
Generating reference files...
✓ Desk - Sidebar Navigation (Light) - mobile
✓ Desk - Sidebar Navigation (Light) - tablet
✓ Desk - Sidebar Navigation (Light) - desktop
✓ Desk - Sidebar Navigation (Dark) - mobile
...
Reference files created successfully!
```

#### Verification:

Check that baseline screenshots were created:

```bash
ls -la tests/visual/backstop_data/bitmaps_reference/
```

You should see PNG files for each scenario and viewport combination.

### Phase 3: Run Visual Regression Tests

Run regression tests after making changes to verify no unintended visual changes occurred.

#### Command:

```bash
cd xgc_theme
npm run visual:test
```

#### What Happens:

1. BackstopJS captures new screenshots (same process as baseline)
2. Compares new screenshots pixel-by-pixel against baseline
3. Calculates mismatch percentage for each scenario
4. Generates HTML report with comparison results
5. Opens report in your default browser

#### Expected Output (No Changes):

```
BackstopJS Test
...
Testing scenarios...
✓ Desk - Sidebar Navigation (Light) - mobile - PASS
✓ Desk - Sidebar Navigation (Light) - tablet - PASS
✓ Desk - Sidebar Navigation (Light) - desktop - PASS
...
All tests passed!
```

#### Expected Output (With Changes):

```
BackstopJS Test
...
Testing scenarios...
✓ Desk - Sidebar Navigation (Light) - mobile - PASS
✗ Desk - Toolbar and Page Header (Light) - desktop - FAIL
  Mismatch: 2.3%
...
Some tests failed. Review the report.
```

#### Interpreting Results:

The HTML report shows three images for each failed scenario:

1. **Reference**: The baseline screenshot (expected)
2. **Test**: The new screenshot (actual)
3. **Diff**: Highlighted differences (pink overlay)

**Review each failure**:
- **Expected change**: If you intentionally modified the design, approve the change
- **Unexpected change**: If the change is unintended, investigate and fix the issue

### Phase 4: Approve Changes (If Intentional)

If visual changes are intentional and correct, update the baseline:

#### Command:

```bash
cd xgc_theme
npm run visual:approve
```

#### What Happens:

1. Copies test screenshots to baseline directory
2. Replaces old baseline screenshots with new ones
3. Future tests will compare against these new baselines

#### When to Approve:

- ✅ After intentionally changing component styles
- ✅ After updating brand colors
- ✅ After modifying typography
- ✅ After adjusting spacing or layout
- ❌ When differences are bugs or regressions
- ❌ When you haven't reviewed the changes

### Phase 5: Investigate Failures

If tests fail unexpectedly, follow this troubleshooting process:

#### Step 1: Review the Report

Open the HTML report (automatically opens after test):

```bash
npm run visual:report
```

#### Step 2: Identify the Issue

Common causes of failures:

1. **CSS Changes**: Unintended style modifications
2. **Dynamic Content**: Timestamps, user data, random content
3. **Font Loading**: Fonts not fully loaded before capture
4. **Animation Timing**: Animations not complete before capture
5. **Browser Differences**: Rendering differences across browsers
6. **Viewport Issues**: Responsive breakpoints not working correctly

#### Step 3: Fix the Issue

**For CSS bugs**:
1. Identify the affected component
2. Review recent CSS changes
3. Fix the styling issue
4. Re-run tests

**For dynamic content**:
1. Edit `tests/visual/backstop_data/engine_scripts/puppet/onReady.js`
2. Add selectors to hide dynamic elements:
   ```javascript
   const dynamicElements = document.querySelectorAll('.my-dynamic-element');
   dynamicElements.forEach(el => el.style.visibility = 'hidden');
   ```
3. Re-run tests

**For timing issues**:
1. Edit `backstop.config.js`
2. Increase `delay` for affected scenarios
3. Re-run tests

## Automated Test Execution

Use the provided shell script for automated testing:

```bash
cd xgc_theme
./tests/visual/run_visual_tests.sh
```

This script:
1. Checks if Frappe is running
2. Checks if authentication cookies exist
3. Checks if baseline screenshots exist
4. Runs appropriate command (reference or test)
5. Provides helpful error messages

## Continuous Integration

For CI/CD pipelines, use the `--ci` flag:

```bash
backstopjs test --config=backstop.config.js --ci
```

This:
- Runs tests without opening a browser
- Generates JSON report for parsing
- Returns exit code 0 (pass) or 1 (fail)

### Example CI Configuration (GitHub Actions):

```yaml
name: Visual Regression Tests

on: [push, pull_request]

jobs:
  visual-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd xgc_theme
          npm install
      
      - name: Start Frappe (mock or actual)
        run: |
          # Start your Frappe instance or mock server
          # bench start &
          # sleep 30
      
      - name: Run visual regression tests
        run: |
          cd xgc_theme
          npm run visual:test -- --ci
      
      - name: Upload test results
        if: failure()
        uses: actions/upload-artifact@v2
        with:
          name: visual-test-results
          path: xgc_theme/tests/visual/backstop_data/
```

## Test Maintenance

### Regular Maintenance Tasks

1. **Update baselines after design changes**:
   ```bash
   npm run visual:reference
   ```

2. **Refresh authentication cookies** (monthly or when expired):
   - Log in to Frappe
   - Extract new `sid` cookie
   - Update `cookies.json`

3. **Review and update scenarios** (as features are added):
   - Edit `backstop.config.js`
   - Add new scenarios for new pages/components
   - Remove scenarios for deprecated features

4. **Clean up old test data** (periodically):
   ```bash
   rm -rf tests/visual/backstop_data/bitmaps_test/
   rm -rf tests/visual/backstop_data/html_report/
   ```

### Baseline Management

**Version Control**:
- ✅ Commit baseline screenshots to Git
- ✅ Commit `backstop.config.js`
- ❌ Don't commit test screenshots or reports
- ❌ Don't commit `cookies.json` (sensitive data)

**Baseline Updates**:
- Document reason for baseline updates in commit messages
- Review all changes before approving
- Consider creating a separate branch for baseline updates
- Get team approval for significant visual changes

## Troubleshooting Common Issues

### Issue: "Connection refused" or "ERR_CONNECTION_REFUSED"

**Cause**: Frappe instance is not running

**Solution**:
```bash
cd /path/to/frappe-bench
bench start
```

### Issue: "Selector not found" errors

**Cause**: Page structure changed or selector is incorrect

**Solution**:
1. Open the URL in a browser
2. Inspect the page to verify the selector exists
3. Update the selector in `backstop.config.js` if needed
4. Increase `delay` if page loads slowly

### Issue: Authentication failures (401/403 errors)

**Cause**: Invalid or expired session cookies

**Solution**:
1. Log in to Frappe again
2. Extract fresh `sid` cookie
3. Update `cookies.json`
4. Re-run tests

### Issue: Too many false positives

**Cause**: Minor rendering differences or dynamic content

**Solution**:
1. Increase `misMatchThreshold` in `backstop.config.js`:
   ```javascript
   misMatchThreshold: 0.5  // Allow 0.5% difference
   ```
2. Hide dynamic elements in `onReady.js`
3. Ensure fonts are fully loaded

### Issue: Tests are very slow

**Cause**: Too many scenarios or high delays

**Solution**:
1. Reduce number of scenarios (test critical paths only)
2. Decrease `delay` values if pages load quickly
3. Increase `asyncCaptureLimit` in config:
   ```javascript
   asyncCaptureLimit: 10  // Capture 10 scenarios in parallel
   ```

### Issue: Puppeteer installation fails

**Cause**: Missing system dependencies

**Solution** (Ubuntu/Debian):
```bash
sudo apt-get install -y \
  libnss3 \
  libatk-bridge2.0-0 \
  libdrm2 \
  libxkbcommon0 \
  libgbm1 \
  libasound2
```

## Best Practices

1. **Run tests before committing**: Catch regressions early
2. **Review all failures**: Don't blindly approve changes
3. **Test incrementally**: Test after each significant change
4. **Document changes**: Note visual changes in commit messages
5. **Keep baselines updated**: Regenerate after intentional changes
6. **Test all variants**: Verify both light and dark themes
7. **Test all viewports**: Ensure responsive design works
8. **Use meaningful scenarios**: Test real user workflows
9. **Maintain authentication**: Keep cookies fresh
10. **Clean up regularly**: Remove old test data

## Success Criteria

Visual regression tests are successful when:

- ✅ All scenarios pass (green checkmarks)
- ✅ No unexpected visual differences
- ✅ Both light and dark themes render correctly
- ✅ All responsive breakpoints work properly
- ✅ Desk interface styling is consistent
- ✅ Website interface styling is consistent
- ✅ Brand colors are applied correctly
- ✅ Typography is consistent and readable
- ✅ Components have proper spacing and alignment
- ✅ Interactive states (hover, focus) work correctly

## Requirements Validation

This test execution validates:

- **Requirement 11.5**: Component styling consistency
- **Requirements 6.1, 6.2, 6.3**: Desk interface styling
- **Requirements 7.1, 7.2, 7.3**: Website interface styling
- **Requirements 8.1, 8.2**: Responsive design
- **Requirement 5.1**: Theme variant consistency

## Next Steps

1. Complete the setup checklist
2. Generate baseline screenshots
3. Make a small CSS change to test the workflow
4. Run regression tests
5. Review the report
6. Approve or fix as needed
7. Integrate into your development workflow

For quick reference, see [QUICKSTART.md](./QUICKSTART.md).

For scenario details, see [SCENARIOS.md](./SCENARIOS.md).
