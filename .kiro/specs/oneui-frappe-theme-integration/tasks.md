# Implementation Plan: OneUI-Frappe Theme Integration

## Overview

This implementation plan breaks down the OneUI-Frappe theme integration into discrete, actionable tasks. The plan follows an incremental approach: setup → CSS variables → component styling → interface-specific styling → dark theme → JavaScript enhancements → testing → deployment. Each task builds on previous work, with property-based tests integrated throughout to validate correctness properties early.

## Tasks

- [ ] 1. Project setup and theme registration
  - [x] 1.1 Create xgc_theme app directory structure
    - Create `xgc_theme/` directory with standard Frappe app structure
    - Create `xgc_theme/public/css/` directory for stylesheets
    - Create `xgc_theme/public/js/` directory for JavaScript files
    - Create `xgc_theme/tests/` directory with subdirectories: `unit/`, `property/`, `visual/`
    - _Requirements: 9.3_

  - [x] 1.2 Configure hooks.py for theme registration
    - Write `xgc_theme/hooks.py` with app metadata (name, title, publisher, description, version)
    - Register Desk assets in `app_include_css` and `app_include_js` arrays
    - Register Website assets in `web_include_css` and `web_include_js` arrays
    - Define theme variants in `themes` dictionary (XGC Light and XGC Dark)
    - _Requirements: 1.1, 1.4, 9.1, 9.2_

  - [x] 1.3 Write unit tests for theme registration
    - Test that hooks.py contains correct app metadata
    - Test that asset paths are correctly formatted
    - Test that theme variants are properly defined
    - _Requirements: 1.1, 1.4_

- [ ] 2. Checkpoint - Verify theme registration
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 3. Implement CSS variable system (xgc_variables.css)
  - [x] 3.1 Define XGC brand color variables
    - Create `xgc_theme/public/css/xgc_variables.css`
    - Define forest green color scale: base (#2d5016), light, lighter, dark, darker
    - Define gold color scale: base (#d4af37), light, lighter, dark, darker
    - _Requirements: 4.1, 4.2, 4.5_

  - [x] 3.2 Override Frappe core color variables
    - Override `--primary`, `--primary-light`, `--primary-dark` with forest green values
    - Override `--accent`, `--accent-light`, `--accent-dark` with gold values
    - Override text colors: `--text-color`, `--text-muted`, `--text-light`
    - Override background colors: `--bg-color`, `--surface-color`, `--surface-hover`
    - Override border colors: `--border-color`, `--border-color-dark`
    - _Requirements: 3.2, 3.3, 4.3_

  - [x] 3.3 Define OneUI typography system variables
    - Define font families: `--font-family-sans-serif`, `--font-family-monospace`
    - Define font size scale: xs (12px) through 4xl (36px)
    - Define line heights: tight (1.25), base (1.5), relaxed (1.75)
    - Define font weights: normal (400), medium (500), semibold (600), bold (700)
    - Define letter spacing: tight, normal, wide
    - _Requirements: 12.1, 12.2, 12.4_

  - [x] 3.4 Define OneUI spacing system variables
    - Define spacing scale: xs (4px), sm (8px), md (16px), lg (24px), xl (32px), 2xl (40px), 3xl (48px)
    - _Requirements: 11.5_

  - [x] 3.5 Define OneUI border system variables
    - Define border widths: standard (1px), thick (2px)
    - Define border radius scale: sm (4px), base (6px), md (8px), lg (12px), xl (16px), full (9999px)
    - _Requirements: 11.5_

  - [x] 3.6 Define OneUI shadow system variables
    - Define shadow scale: xs, sm, md, lg, xl, 2xl with appropriate rgba values
    - _Requirements: 11.5_

  - [x] 3.7 Define OneUI transition and z-index variables
    - Define transition timings: fast (150ms), base (200ms), slow (300ms)
    - Define z-index scale: dropdown (1000), sticky (1020), fixed (1030), modal-backdrop (1040), modal (1050), popover (1060), tooltip (1070)
    - _Requirements: 11.5_

  - [ ] 3.8 Write property test for CSS variable completeness (Property 1)
    - **Property 1: CSS Variable Override Completeness**
    - Test that all CSS variables defined in xgc_variables.css are accessible via computed styles
    - Generate random CSS variable names from the defined set
    - Query computed styles and verify each variable has a non-empty value
    - **Validates: Requirements 3.2, 3.3**

  - [x] 3.9 Write property test for color variation availability (Property 4)
    - **Property 4: Color Variation Availability**
    - Test that each brand color has lighter, light, base, dark, darker variations
    - Generate test cases for forest-green and gold color families
    - Verify CSS variables exist with naming pattern --xgc-{color}-{variant}
    - **Validates: Requirements 4.5**

  - [x] 3.10 Write property test for brand color contrast compliance (Property 3)
    - **Property 3: Brand Color Contrast Compliance**
    - Test that all brand color and background combinations meet WCAG 2.1 AA requirements
    - Generate all combinations of brand colors (foreground) and background colors
    - Calculate contrast ratios and verify: 4.5:1 for normal text, 3:1 for large text/UI
    - **Validates: Requirements 4.4**

- [x] 4. Checkpoint - Verify CSS variables
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement component styling (xgc_components.css)
  - [x] 5.1 Style button components
    - Create `xgc_theme/public/css/xgc_components.css`
    - Style `.btn` base class with OneUI foundation (typography, spacing, borders, transitions)
    - Style button variants: primary (forest green), secondary, success, danger, warning (gold)
    - Style button sizes: sm, base, lg
    - Style button states: hover, active, focus, disabled
    - _Requirements: 2.5, 11.1_

  - [x] 5.2 Style form control components
    - Style input base styles: text, email, password, number, tel, url, search, date, time
    - Style textarea with minimum height and vertical resize
    - Style select with custom dropdown arrow
    - Style checkbox and radio with custom styling
    - Style form labels and form groups
    - Style input states: hover, focus, disabled, invalid
    - _Requirements: 2.5, 11.2_

  - [x] 5.3 Style card components
    - Style `.card` and `.frappe-card` base classes with OneUI elevation and spacing
    - Style card header with background and border
    - Style card body with padding
    - Style card footer with background and border
    - Add hover effects with transform and shadow
    - _Requirements: 2.5, 11.4_

  - [x] 5.4 Style navigation components
    - Style `.navbar` with brand colors and shadow
    - Style `.nav-link` with colors, hover, and active states
    - Style `.breadcrumb` with separators and link colors
    - _Requirements: 2.5, 11.4_

  - [x] 5.5 Style table components
    - Style `.table` base class with borders and shadows
    - Style table header with background and bold text
    - Style table body with borders and hover effects
    - _Requirements: 2.5, 11.4_

  - [x] 5.6 Style alert and feedback components
    - Style `.alert` base class with padding and borders
    - Style alert variants: success, warning, danger, info with semantic colors
    - Style `.toast` notifications with shadow and borders
    - Style `.modal-content`, `.modal-header`, `.modal-body`, `.modal-footer`
    - _Requirements: 2.5, 11.3_

  - [x] 5.7 Write property test for component styling consistency (Property 6)
    - **Property 6: Component Styling Consistency**
    - Test that all instances of each component type share consistent base styling
    - Generate test cases for buttons, form controls, feedback elements, data display elements
    - Verify border-radius (within ±1px), padding (within ±2px), transition duration (within ±50ms)
    - **Validates: Requirements 11.1, 11.2, 11.3, 11.4**

  - [x] 5.8 Write property test for OneUI component styling preservation (Property 15)
    - **Property 15: OneUI Component Styling Preservation**
    - Test that Frappe components have OneUI characteristic styling
    - Generate test cases for buttons, form controls, cards, navigation elements
    - Verify border-radius (0.25rem-0.5rem), box-shadow present, transition duration (0.15s-0.3s)
    - **Validates: Requirements 2.3, 2.4, 2.5**

  - [x] 5.9 Write property test for brand color application to UI elements (Property 2)
    - **Property 2: Brand Color Application to UI Elements**
    - Test that primary UI elements use brand colors
    - Generate test cases for headers, primary buttons, primary links, toolbar elements
    - Verify computed colors match forest green (#2d5016) or gold (#d4af37) or their variations
    - **Validates: Requirements 4.3**

- [x] 6. Checkpoint - Verify component styling
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implement Desk interface styling (xgc_desk.css)
  - [x] 7.1 Style Desk sidebar navigation
    - Create `xgc_theme/public/css/xgc_desk.css`
    - Style `.desk-sidebar` with dark forest green background
    - Style `.sidebar-item` with colors, hover, and active states using brand colors
    - _Requirements: 6.1_

  - [x] 7.2 Style Desk toolbar and page headers
    - Style `.page-head` with white background and shadow
    - Style `.page-title` with forest green color and bold weight
    - _Requirements: 6.3_

  - [x] 7.3 Style Desk forms and lists
    - Style `.frappe-control` with spacing
    - Style `.grid-row` with border radius and hover effects
    - _Requirements: 6.2, 6.4_

  - [x] 7.4 Write property test for Desk component styling (Property 16)
    - **Property 16: Desk Component Styling**
    - Test that Desk-specific components have theme styling applied
    - Generate test cases for sidebar items, page headers, form controls, grid rows, dashboard widgets
    - Verify brand colors used, OneUI border-radius values, proper spacing variables
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.5**

- [x] 8. Implement Website interface styling (xgc_website.css)
  - [x] 8.1 Style Website header and navigation
    - Create `xgc_theme/public/css/xgc_website.css`
    - Style `.web-header` with white background and shadow
    - Style `.navbar-brand` with forest green color
    - Style `.nav-link` with forest green and gold hover colors
    - _Requirements: 7.1, 7.2_

  - [x] 8.2 Style Website content areas
    - Style `.web-content` with padding
    - Style headings (h1, h2, h3) with forest green color
    - Style links with forest green and gold hover colors
    - _Requirements: 7.1, 7.2_

  - [x] 8.3 Style Website forms
    - Style `.web-form .form-control` with border radius
    - Style `.web-form .btn-primary` with forest green background
    - _Requirements: 7.3_

  - [x] 8.4 Write property test for Website component styling (Property 17)
    - **Property 17: Website Component Styling**
    - Test that Website-specific components have theme styling applied
    - Generate test cases for navigation links, content headings, form controls, call-to-action buttons
    - Verify brand colors used, OneUI border-radius values, proper spacing variables
    - **Validates: Requirements 7.1, 7.2, 7.3**

  - [x] 8.5 Write property test for Website responsive design (Property 9)
    - **Property 9: Website Responsive Design**
    - Test that Website pages maintain proper layout at standard viewport widths
    - Generate test cases for 320px, 768px, 1024px, 1920px viewport widths
    - Verify no horizontal scrolling (document width ≤ viewport width) and readable text (font-size ≥ 14px)
    - **Validates: Requirements 7.4**

- [x] 9. Checkpoint - Verify interface styling
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Implement dark theme variant (xgc_dark.css)
  - [x] 10.1 Override background and text colors for dark mode
    - Create `xgc_theme/public/css/xgc_dark.css`
    - Override background colors: `--bg-color` (#111827), `--surface-color` (#1f2937), `--surface-hover` (#374151)
    - Override text colors: `--text-color` (#f9fafb), `--text-muted` (#d1d5db), `--text-light` (#9ca3af)
    - _Requirements: 5.2_

  - [x] 10.2 Adjust brand colors for dark mode visibility
    - Override forest green colors with lighter, more vibrant values for dark backgrounds
    - Override gold colors with brighter, warmer values for dark backgrounds
    - _Requirements: 5.4_

  - [x] 10.3 Override border and shadow colors for dark mode
    - Override border colors: `--border-color` (#374151), `--border-color-dark` (#4b5563)
    - Override shadow values with darker, more pronounced rgba values
    - _Requirements: 5.4_

  - [x] 10.4 Style components for dark mode
    - Style cards and surfaces with dark backgrounds
    - Style form controls with dark backgrounds and proper focus states
    - Style buttons with adjusted colors
    - Style navigation with dark backgrounds
    - Style tables and lists with dark backgrounds
    - Style modals and overlays with dark backgrounds
    - Style alerts with dark semantic colors
    - Style scrollbars for dark mode (webkit browsers)
    - _Requirements: 5.2, 5.4_

  - [x] 10.5 Write property test for theme variant color characteristics (Property 5)
    - **Property 5: Theme Variant Color Characteristics**
    - Test that light and dark themes maintain appropriate contrast characteristics
    - Generate test cases for both theme variants
    - Verify light theme: light backgrounds (luminance > 0.5) with dark text (luminance < 0.5)
    - Verify dark theme: dark backgrounds (luminance < 0.5) with light text (luminance > 0.5)
    - **Validates: Requirements 5.1, 5.2, 5.4**

- [x] 11. Implement responsive design features
  - [x] 11.1 Add responsive media queries to components
    - Add mobile breakpoint styles (<768px) to xgc_components.css
    - Add tablet breakpoint styles (768px-1023px) to xgc_components.css
    - Add desktop breakpoint styles (≥1024px) to xgc_components.css
    - _Requirements: 2.2, 8.1, 8.2_

  - [x] 11.2 Write property test for responsive breakpoint behavior (Property 7)
    - **Property 7: Responsive Breakpoint Behavior**
    - Test that layout adapts at defined OneUI breakpoints
    - Generate test cases for viewport widths at and crossing breakpoints (mobile: <768px, tablet: 768px-1023px, desktop: ≥1024px)
    - Verify breakpoint-specific media query styles apply and body has corresponding class
    - **Validates: Requirements 2.2, 8.1, 8.2**

  - [x] 11.3 Write property test for touch target sizing on mobile (Property 8)
    - **Property 8: Touch Target Sizing on Mobile**
    - Test that interactive elements have minimum 44x44px dimensions on mobile
    - Generate test cases for buttons, links, form controls, clickable icons at mobile viewport widths (<768px)
    - Verify computed dimensions: width ≥ 44px and height ≥ 44px
    - **Validates: Requirements 8.3**

- [x] 12. Implement typography features
  - [x] 12.1 Ensure typographic hierarchy in components
    - Verify heading styles (h1-h6) have decreasing font sizes in xgc_components.css
    - Add distinct styling for body text and code blocks
    - _Requirements: 12.1, 12.5_

  - [x] 12.2 Write property test for typographic hierarchy (Property 10)
    - **Property 10: Typographic Hierarchy**
    - Test that heading elements maintain proper size hierarchy
    - Generate test cases for sequences of heading elements (h1 through h6) within containers
    - Verify each subsequent heading level has font-size ≤ previous level (h1 ≥ h2 ≥ h3 ≥ h4 ≥ h5 ≥ h6)
    - **Validates: Requirements 12.1**

  - [x] 12.3 Write property test for font loading success (Property 11)
    - **Property 11: Font Loading Success**
    - Test that custom fonts load or fall back gracefully
    - Generate test cases for all font-family declarations in the theme
    - Verify font loads successfully (font-family matches) or falls back to web-safe font (sans-serif, serif, monospace)
    - **Validates: Requirements 12.2**

  - [x] 12.4 Write property test for typography consistency (Property 12)
    - **Property 12: Typography Consistency**
    - Test that text elements within categories have consistent line-height and letter-spacing
    - Generate test cases for headings, body text, code blocks
    - Verify consistency within ±0.1 for line-height, within ±0.01em for letter-spacing
    - **Validates: Requirements 12.4**

  - [x] 12.5 Write property test for text type distinction (Property 13)
    - **Property 13: Text Type Distinction**
    - Test that different text types have distinguishable styles
    - Generate test cases for pairs: heading vs body, body vs code, heading vs code
    - Verify difference in at least one property: font-size (≥2px), font-weight (≥100), font-family, or color
    - **Validates: Requirements 12.5**

- [x] 13. Checkpoint - Verify responsive and typography features
  - Ensure all tests pass, ask the user if questions arise.

- [x] 14. Implement JavaScript extensions (xgc_theme.js)
  - [x] 14.1 Create theme initialization module
    - Create `xgc_theme/public/js/xgc_theme.js`
    - Define `xgc_theme` namespace with `init()` function
    - Call initialization on document ready
    - _Requirements: 10.3_

  - [x] 14.2 Implement theme switcher enhancements
    - Write `setup_theme_switcher()` function
    - Add smooth transitions when theme changes
    - Listen for 'theme-change' event and add/remove 'theme-transitioning' class
    - _Requirements: 1.3_

  - [x] 14.3 Implement component enhancements
    - Write `apply_component_enhancements()` function
    - Add OneUI-style ripple effects to buttons on click
    - _Requirements: 2.5_

  - [x] 14.4 Implement responsive handlers
    - Write `setup_responsive_handlers()` function
    - Add debounced resize handler to toggle body classes (mobile-view, tablet-view, desktop-view)
    - _Requirements: 8.2_

  - [x] 14.5 Write unit tests for JavaScript initialization
    - Test that xgc_theme namespace is defined
    - Test that init() function executes without errors
    - Test that event handlers are properly attached
    - _Requirements: 10.3_

- [x] 15. Implement cross-browser compatibility
  - [x] 15.1 Add CSS fallbacks for older browsers
    - Add fallback values for CSS variables in xgc_variables.css
    - Add vendor prefixes where needed for transitions and transforms
    - _Requirements: 14.3_

  - [x] 15.2 Write property test for cross-browser style consistency (Property 14)
    - **Property 14: Cross-Browser Style Consistency**
    - Test that styles match across major browsers
    - Generate test cases for Chrome, Firefox, Safari, Edge with key components (buttons, form controls, cards)
    - Verify computed styles match within tolerances: dimensions (±2px), colors (exact), border-radius (±1px)
    - **Validates: Requirements 14.1**

- [x] 16. Integration and build
  - [x] 16.1 Verify asset paths and registration
    - Double-check all asset paths in hooks.py match actual file locations
    - Verify CSS files are in correct load order (variables → components → context-specific)
    - _Requirements: 9.1, 9.2, 9.3_

  - [x] 16.2 Build assets with bench build
    - Run `bench build --app xgc_theme` to compile and bundle assets
    - Verify no build errors or warnings
    - Check that bundled assets are created in public/dist/
    - _Requirements: 9.4_

  - [x] 16.3 Clear cache and test in Frappe instance
    - Run `bench clear-cache` to clear cached assets
    - Restart Frappe instance
    - Log in and verify theme appears in theme switcher
    - Select theme and verify assets load correctly
    - _Requirements: 9.5, 1.2_

  - [x] 16.4 Write unit tests for asset loading
    - Test that all CSS files load without 404 errors
    - Test that all JavaScript files load without errors
    - Test that theme selection persists across page loads
    - _Requirements: 1.5, 9.4, 9.5_

- [x] 17. Visual regression testing
  - [x] 17.1 Set up visual regression testing framework
    - Install BackstopJS or Percy for visual regression testing
    - Create backstop.config.js with test scenarios
    - Define scenarios for Desk interface, Website interface, theme variants
    - _Requirements: 11.5_

  - [x] 17.2 Create visual test scenarios
    - Create scenario for Desk sidebar, toolbar, forms, lists
    - Create scenario for Website header, content, forms
    - Create scenario for light theme variant
    - Create scenario for dark theme variant
    - Create scenario for responsive breakpoints (mobile, tablet, desktop)
    - _Requirements: 6.1, 6.2, 6.3, 7.1, 7.2, 7.3, 8.1, 8.2_

  - [x] 17.3 Run visual regression tests
    - Generate baseline screenshots for all scenarios
    - Run visual regression tests and review differences
    - Approve expected changes, investigate unexpected changes
    - _Requirements: 11.5_

- [x] 18. Accessibility testing
  - [x] 18.1 Run automated accessibility tests
    - Install jest-axe for accessibility testing
    - Write tests to check contrast ratios for all color combinations
    - Write tests to check keyboard navigation
    - Write tests to check ARIA attributes
    - _Requirements: 4.4_

  - [x] 18.2 Manual accessibility verification
    - Test with screen reader (NVDA, JAWS, or VoiceOver)
    - Test keyboard navigation through all interactive elements
    - Verify focus indicators are visible
    - _Requirements: 4.4_

- [x] 19. Performance testing
  - [x] 19.1 Measure page load performance
    - Use Lighthouse or WebPageTest to measure page load time
    - Compare performance with default Frappe theme
    - Verify no significant degradation (>10% slower)
    - _Requirements: 13.1, 13.2, 13.3, 13.5_

  - [x] 19.2 Optimize CSS and JavaScript if needed
    - Minify CSS and JavaScript files
    - Remove unused CSS selectors
    - Optimize CSS specificity to reduce rendering time
    - _Requirements: 13.1, 13.2, 13.4_

- [x] 20. Final checkpoint - Comprehensive testing
  - Ensure all tests pass, ask the user if questions arise.
  - Verify all 17 correctness properties are validated
  - Verify theme works in all supported browsers
  - Verify accessibility compliance (WCAG AA)
  - Verify performance is acceptable

## Notes

- All tasks are required for comprehensive implementation
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties with minimum 100 iterations
- Unit tests validate specific examples and edge cases
- Visual regression tests ensure no unexpected UI changes
- Checkpoints ensure incremental validation throughout implementation
- All CSS files should be created in `xgc_theme/public/css/`
- All JavaScript files should be created in `xgc_theme/public/js/`
- All test files should be created in `xgc_theme/tests/` with appropriate subdirectories
