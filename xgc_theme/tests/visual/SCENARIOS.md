# Visual Regression Test Scenarios

This document describes all visual regression test scenarios for the XGC Theme.

## Scenario Categories

### 1. Desk Interface Scenarios

#### 1.1 Desk - Sidebar Navigation (Light)
- **Label**: `Desk - Sidebar Navigation (Light)`
- **URL**: `http://localhost:8000/app`
- **Selector**: `.desk-sidebar`
- **Viewports**: Mobile, Tablet, Desktop
- **Requirements**: 6.1
- **Description**: Tests the Desk sidebar navigation styling in light theme, including:
  - Sidebar background color (dark forest green)
  - Sidebar item colors and hover states
  - Active item highlighting with gold accent
  - Proper spacing and typography
  - Icon alignment and sizing

#### 1.2 Desk - Sidebar Navigation (Dark)
- **Label**: `Desk - Sidebar Navigation (Dark)`
- **URL**: `http://localhost:8000/app`
- **Selector**: `.desk-sidebar`
- **Viewports**: Mobile, Tablet, Desktop
- **Requirements**: 6.1, 5.2
- **Description**: Tests the Desk sidebar navigation styling in dark theme with adjusted colors for dark backgrounds.

#### 1.3 Desk - Toolbar and Page Header (Light)
- **Label**: `Desk - Toolbar and Page Header (Light)`
- **URL**: `http://localhost:8000/app`
- **Selector**: `.page-head`
- **Viewports**: Mobile, Tablet, Desktop
- **Requirements**: 6.3
- **Description**: Tests the Desk toolbar and page header styling, including:
  - White background with subtle shadow
  - Forest green page title
  - Action button styling
  - Breadcrumb navigation
  - Search bar styling

#### 1.4 Desk - Toolbar and Page Header (Dark)
- **Label**: `Desk - Toolbar and Page Header (Dark)`
- **URL**: `http://localhost:8000/app`
- **Selector**: `.page-head`
- **Viewports**: Mobile, Tablet, Desktop
- **Requirements**: 6.3, 5.2
- **Description**: Tests the Desk toolbar and page header styling in dark theme.

#### 1.5 Desk - Form View (Light)
- **Label**: `Desk - Form View (Light)`
- **URL**: `http://localhost:8000/app/user`
- **Selector**: `document`
- **Viewports**: Mobile, Tablet, Desktop
- **Requirements**: 6.2
- **Description**: Tests Desk form styling, including:
  - Form control styling (inputs, selects, textareas)
  - Form labels and help text
  - Form sections and cards
  - Button styling in forms
  - Validation states (focus, error, disabled)
  - Field spacing and layout

#### 1.6 Desk - Form View (Dark)
- **Label**: `Desk - Form View (Dark)`
- **URL**: `http://localhost:8000/app/user`
- **Selector**: `document`
- **Viewports**: Mobile, Tablet, Desktop
- **Requirements**: 6.2, 5.2
- **Description**: Tests Desk form styling in dark theme with proper contrast.

#### 1.7 Desk - List View (Light)
- **Label**: `Desk - List View (Light)`
- **URL**: `http://localhost:8000/app/user`
- **Selector**: `.page-content`
- **Viewports**: Mobile, Tablet, Desktop
- **Requirements**: 6.2
- **Description**: Tests Desk list/grid view styling, including:
  - Grid row styling and borders
  - Hover effects on rows
  - Column headers
  - Sorting indicators
  - Action buttons in rows
  - Pagination controls

#### 1.8 Desk - List View (Dark)
- **Label**: `Desk - List View (Dark)`
- **URL**: `http://localhost:8000/app/user`
- **Selector**: `.page-content`
- **Viewports**: Mobile, Tablet, Desktop
- **Requirements**: 6.2, 5.2
- **Description**: Tests Desk list/grid view styling in dark theme.

### 2. Website Interface Scenarios

#### 2.1 Website - Header and Navigation (Light)
- **Label**: `Website - Header and Navigation (Light)`
- **URL**: `http://localhost:8000`
- **Selector**: `.web-header`
- **Viewports**: Mobile, Tablet, Desktop
- **Requirements**: 7.1, 7.2
- **Description**: Tests Website header and navigation styling, including:
  - White background with shadow
  - Forest green brand logo/text
  - Navigation link colors (forest green)
  - Hover states (gold accent)
  - Mobile menu toggle button
  - Responsive navigation collapse

#### 2.2 Website - Header and Navigation (Dark)
- **Label**: `Website - Header and Navigation (Dark)`
- **URL**: `http://localhost:8000`
- **Selector**: `.web-header`
- **Viewports**: Mobile, Tablet, Desktop
- **Requirements**: 7.1, 7.2, 5.2
- **Description**: Tests Website header and navigation styling in dark theme.

#### 2.3 Website - Content Area (Light)
- **Label**: `Website - Content Area (Light)`
- **URL**: `http://localhost:8000`
- **Selector**: `.web-content`
- **Viewports**: Mobile, Tablet, Desktop
- **Requirements**: 7.1, 7.2
- **Description**: Tests Website content area styling, including:
  - Heading colors (forest green)
  - Body text typography
  - Link colors and hover states
  - Content spacing and padding
  - Card/section styling
  - Image styling

#### 2.4 Website - Content Area (Dark)
- **Label**: `Website - Content Area (Dark)`
- **URL**: `http://localhost:8000`
- **Selector**: `.web-content`
- **Viewports**: Mobile, Tablet, Desktop
- **Requirements**: 7.1, 7.2, 5.2
- **Description**: Tests Website content area styling in dark theme.

#### 2.5 Website - Form (Light)
- **Label**: `Website - Form (Light)`
- **URL**: `http://localhost:8000/contact`
- **Selector**: `.web-form`
- **Viewports**: Mobile, Tablet, Desktop
- **Requirements**: 7.3
- **Description**: Tests Website form styling, including:
  - Form control styling
  - Submit button (forest green background)
  - Form labels and placeholders
  - Validation messages
  - Form layout and spacing

#### 2.6 Website - Form (Dark)
- **Label**: `Website - Form (Dark)`
- **URL**: `http://localhost:8000/contact`
- **Selector**: `.web-form`
- **Viewports**: Mobile, Tablet, Desktop
- **Requirements**: 7.3, 5.2
- **Description**: Tests Website form styling in dark theme.

### 3. Responsive Breakpoint Scenarios

#### 3.1 Responsive - Mobile Layout (Light)
- **Label**: `Responsive - Mobile Layout (Light)`
- **URL**: `http://localhost:8000`
- **Selector**: `document`
- **Viewports**: Mobile (320px)
- **Requirements**: 8.1, 8.2
- **Description**: Tests full page layout at mobile breakpoint, including:
  - Mobile navigation (hamburger menu)
  - Content stacking
  - Touch-friendly button sizes (min 44x44px)
  - Readable text sizes
  - No horizontal scrolling
  - Proper spacing on small screens

#### 3.2 Responsive - Tablet Layout (Light)
- **Label**: `Responsive - Tablet Layout (Light)`
- **URL**: `http://localhost:8000`
- **Selector**: `document`
- **Viewports**: Tablet (768px)
- **Requirements**: 8.1, 8.2
- **Description**: Tests full page layout at tablet breakpoint, including:
  - Tablet navigation layout
  - Two-column layouts where appropriate
  - Proper spacing for medium screens
  - Touch-friendly interactions

#### 3.3 Responsive - Desktop Layout (Light)
- **Label**: `Responsive - Desktop Layout (Light)`
- **URL**: `http://localhost:8000`
- **Selector**: `document`
- **Viewports**: Desktop (1920px)
- **Requirements**: 8.1, 8.2
- **Description**: Tests full page layout at desktop breakpoint, including:
  - Full navigation bar
  - Multi-column layouts
  - Optimal content width
  - Hover states for mouse interactions
  - Proper use of screen real estate

## Test Execution Strategy

### Phase 1: Generate Baselines
1. Ensure Frappe instance is running with XGC theme applied
2. Run `npm run visual:reference` to generate baseline screenshots
3. Review baselines manually to ensure they represent the desired state

### Phase 2: Regression Testing
1. Make code changes to theme files
2. Run `npm run visual:test` to compare against baselines
3. Review the HTML report that opens automatically
4. Investigate any unexpected differences

### Phase 3: Baseline Updates
1. If changes are intentional, run `npm run visual:approve`
2. Commit updated baseline screenshots to version control
3. Document the reason for visual changes in commit message

## Scenario Configuration Details

### Common Settings
- **misMatchThreshold**: 0.1% (allows for minor rendering differences)
- **delay**: 1000-1500ms (ensures page is fully loaded)
- **requireSameDimensions**: true (ensures layout consistency)

### Dynamic Element Handling
The `onReady.js` script automatically hides:
- Timestamps and dates
- User avatars
- Other user-specific content

### Authentication
For Desk scenarios, authentication cookies are loaded via `loadCookies.js`. Ensure `cookies.json` is configured with valid session data.

### Theme Switching
Dark theme scenarios use `setDarkTheme.js` to apply dark theme before capture. This ensures consistent theme application across all dark scenarios.

## Maintenance

### When to Update Baselines
- After intentional design changes
- After updating OneUI version
- After changing brand colors
- After modifying component styles

### When to Investigate Failures
- Unexpected visual differences
- Layout shifts
- Color changes
- Missing elements
- Broken responsive behavior

### Best Practices
1. Review all visual changes carefully before approving
2. Keep baselines in version control
3. Run visual tests before merging theme changes
4. Document visual changes in pull requests
5. Test across all viewports and theme variants
6. Ensure authentication cookies are valid for Desk tests

## Requirements Traceability

| Requirement | Scenarios |
|-------------|-----------|
| 6.1 - Desk sidebar styling | 1.1, 1.2 |
| 6.2 - Desk forms and lists | 1.5, 1.6, 1.7, 1.8 |
| 6.3 - Desk toolbar | 1.3, 1.4 |
| 7.1 - Website styling | 2.1, 2.2, 2.3, 2.4 |
| 7.2 - Website brand colors | 2.1, 2.2, 2.3, 2.4 |
| 7.3 - Website forms | 2.5, 2.6 |
| 8.1 - Responsive breakpoints | 3.1, 3.2, 3.3 |
| 8.2 - Responsive adaptation | 3.1, 3.2, 3.3 |
| 5.2 - Dark theme variant | All dark scenarios |
| 11.5 - Component consistency | All scenarios |
