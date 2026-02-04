# Visual Regression Testing

This directory contains visual regression tests for the XGC Theme using BackstopJS.

## Overview

Visual regression testing captures screenshots of the application and compares them against baseline images to detect unintended visual changes. This ensures that theme updates don't break the UI.

## Test Coverage

The visual tests cover:

### Desk Interface (Requirements: 6.1, 6.2, 6.3)
- Sidebar navigation (light and dark themes)
- Toolbar and page headers (light and dark themes)
- Form views (light and dark themes)
- List views (light and dark themes)

### Website Interface (Requirements: 7.1, 7.2, 7.3)
- Header and navigation (light and dark themes)
- Content areas (light and dark themes)
- Forms (light and dark themes)

### Responsive Breakpoints (Requirements: 8.1, 8.2)
- Mobile layout (320px width)
- Tablet layout (768px width)
- Desktop layout (1920px width)

### Theme Variants (Requirement: 11.5)
- Light theme variant
- Dark theme variant

## Setup

### 1. Install Dependencies

Dependencies are already installed via the main package.json.

### 2. Configure Authentication (Optional)

For testing authenticated pages (Desk interface), you need to provide session cookies:

1. Copy the example cookies file:
   ```bash
   cp tests/visual/backstop_data/engine_scripts/cookies.json.example tests/visual/backstop_data/engine_scripts/cookies.json
   ```

2. Log in to your Frappe instance in a browser

3. Open browser DevTools → Application/Storage → Cookies

4. Copy the `sid` cookie value and update `cookies.json`

### 3. Start Frappe Development Server

Ensure your Frappe instance is running on `http://localhost:8000`:

```bash
bench start
```

## Running Tests

### Generate Baseline Screenshots (First Time)

```bash
npm run visual:reference
```

This creates baseline screenshots in `tests/visual/backstop_data/bitmaps_reference/`.

### Run Visual Regression Tests

```bash
npm run visual:test
```

This captures new screenshots and compares them against the baseline. A browser will open showing the comparison report.

### Approve Changes

If the visual changes are intentional:

```bash
npm run visual:approve
```

This updates the baseline screenshots with the new versions.

## Configuration

The BackstopJS configuration is in `backstop.config.js` at the project root.

### Key Configuration Options

- **viewports**: Defines screen sizes for responsive testing
- **scenarios**: Defines pages and elements to test
- **paths**: Defines where screenshots and reports are stored
- **misMatchThreshold**: Tolerance for pixel differences (0.1 = 0.1%)

### Customizing Scenarios

Edit `backstop.config.js` to add or modify test scenarios. Each scenario can specify:

- `label`: Descriptive name for the test
- `url`: Page URL to test
- `selectors`: CSS selectors to capture
- `viewports`: Specific viewports for this scenario
- `delay`: Wait time before capture (ms)
- `onBeforeScript`: Script to run before navigation
- `readySelector`: Wait for this element before capture

## Puppeteer Scripts

Custom Puppeteer scripts in `tests/visual/backstop_data/engine_scripts/puppet/`:

- **onBefore.js**: Runs before each scenario (loads cookies)
- **onReady.js**: Runs when page is ready (hides dynamic elements)
- **loadCookies.js**: Loads authentication cookies
- **setDarkTheme.js**: Switches to dark theme for dark variant tests

## Troubleshooting

### Tests Fail Due to Dynamic Content

Edit `onReady.js` to hide or stabilize dynamic elements like timestamps or user-specific data.

### Authentication Issues

Ensure `cookies.json` contains valid session cookies. You may need to refresh them periodically.

### Timeout Errors

Increase the `delay` value in scenario configuration or adjust `readySelector` to wait for the correct element.

### Port Conflicts

If Frappe is running on a different port, update the URLs in `backstop.config.js`.

## CI/CD Integration

For continuous integration, use the `ci_report` output format:

```bash
backstopjs test --config=backstop.config.js --ci
```

This generates a JSON report suitable for CI systems.

## Best Practices

1. **Keep baselines up to date**: Regenerate baselines when intentional design changes are made
2. **Use appropriate selectors**: Target specific components rather than full pages when possible
3. **Handle dynamic content**: Hide or mock elements that change frequently
4. **Set reasonable thresholds**: Use `misMatchThreshold` to allow for minor rendering differences
5. **Test critical paths**: Focus on key user journeys and important UI components
6. **Review failures carefully**: Not all differences are bugs - some may be expected

## Requirements Validation

This visual regression testing framework validates:

- **Requirement 11.5**: Component styling consistency through visual comparison
- **Requirements 6.1, 6.2, 6.3**: Desk interface styling preservation
- **Requirements 7.1, 7.2, 7.3**: Website interface styling preservation
- **Requirements 8.1, 8.2**: Responsive design at defined breakpoints
- **Requirement 5.1**: Theme variant visual consistency
