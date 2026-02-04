# Requirements Document

## Introduction

This document specifies the requirements for integrating the OneUI 5.12 design system into a Frappe/ERPNext v16 theme application. The xgc_theme app will provide a custom theme that combines OneUI's modern design patterns with XGC's brand identity (forest green and gold colors), offering both light and dark variants while maintaining full compatibility with Frappe's theming system.

## Glossary

- **Theme_App**: The xgc_theme Frappe application that provides custom styling
- **OneUI**: The OneUI 5.12 HTML/CSS design system used as the base theme
- **Frappe_Core**: The Frappe Framework v16 core system
- **Desk**: The administrative interface used by internal users
- **Website**: The public-facing portal interface
- **Theme_Switcher**: Frappe's built-in interface for selecting themes
- **CSS_Variables**: CSS custom properties used by Frappe for theming
- **Brand_Colors**: XGC's forest green and gold color palette
- **Asset_Bundle**: Collection of CSS and JavaScript files registered via hooks.py

## Requirements

### Requirement 1: Theme Registration and Selection

**User Story:** As a system administrator, I want to register the custom theme with Frappe, so that users can select it via the theme switcher.

#### Acceptance Criteria

1. WHEN the Theme_App is installed, THE Frappe_Core SHALL recognize it as an available theme
2. WHEN a user accesses the Theme_Switcher, THE Frappe_Core SHALL display the xgc_theme as a selectable option
3. WHEN a user selects the xgc_theme, THE Frappe_Core SHALL apply the theme's CSS and JavaScript assets
4. THE Theme_App SHALL register all assets through hooks.py without modifying Frappe_Core files
5. WHEN the theme is selected, THE Frappe_Core SHALL persist the selection across user sessions

### Requirement 2: OneUI Design System Integration

**User Story:** As a developer, I want to integrate OneUI 5.12 styling into Frappe, so that the interface uses OneUI's design patterns.

#### Acceptance Criteria

1. THE Theme_App SHALL incorporate OneUI 5.12 CSS components from the OneUI source directory
2. THE Theme_App SHALL preserve OneUI's responsive design breakpoints and grid system
3. THE Theme_App SHALL adapt OneUI components to work with Frappe's HTML structure
4. WHEN OneUI styles conflict with Frappe defaults, THE Theme_App SHALL override Frappe styles using appropriate CSS specificity
5. THE Theme_App SHALL maintain OneUI's component styling for buttons, forms, cards, and navigation elements

### Requirement 3: CSS Variable Override System

**User Story:** As a developer, I want to override Frappe's CSS variables, so that the theme integrates cleanly with Frappe's theming architecture.

#### Acceptance Criteria

1. THE Theme_App SHALL identify all relevant Frappe CSS_Variables used for theming
2. THE Theme_App SHALL override CSS_Variables with OneUI-equivalent values
3. THE Theme_App SHALL override CSS_Variables with Brand_Colors where appropriate
4. WHEN Frappe_Core updates CSS_Variables, THE Theme_App SHALL remain compatible through variable-based overrides
5. THE Theme_App SHALL document all overridden CSS_Variables and their purposes

### Requirement 4: Brand Color Implementation

**User Story:** As a brand manager, I want XGC's forest green and gold colors throughout the interface, so that the theme reflects our brand identity.

#### Acceptance Criteria

1. THE Theme_App SHALL define forest green as the primary brand color
2. THE Theme_App SHALL define gold as the secondary accent color
3. THE Theme_App SHALL apply Brand_Colors to primary UI elements including headers, buttons, and links
4. THE Theme_App SHALL ensure Brand_Colors meet WCAG 2.1 AA contrast requirements for accessibility
5. THE Theme_App SHALL provide color variations (lighter/darker shades) for hover states and disabled elements

### Requirement 5: Light and Dark Theme Variants

**User Story:** As a user, I want to switch between light and dark theme variants, so that I can choose my preferred visual experience.

#### Acceptance Criteria

1. THE Theme_App SHALL provide a light theme variant with light backgrounds and dark text
2. THE Theme_App SHALL provide a dark theme variant with dark backgrounds and light text
3. WHEN a user switches variants via Theme_Switcher, THE Frappe_Core SHALL apply the selected variant immediately
4. THE Theme_App SHALL ensure both variants use the same Brand_Colors with appropriate contrast adjustments
5. THE Theme_App SHALL maintain readability and usability in both light and dark variants

### Requirement 6: Desk Interface Styling

**User Story:** As an internal user, I want the Desk interface styled with the custom theme, so that my administrative work environment reflects the new design.

#### Acceptance Criteria

1. THE Theme_App SHALL style the Desk sidebar navigation with OneUI patterns
2. THE Theme_App SHALL style Desk forms, lists, and reports with OneUI components
3. THE Theme_App SHALL style the Desk toolbar and action buttons with Brand_Colors
4. THE Theme_App SHALL maintain all Frappe Desk functionality while applying custom styling
5. THE Theme_App SHALL ensure Desk widgets and dashboards render correctly with the theme

### Requirement 7: Website Interface Styling

**User Story:** As a website visitor, I want the public portal styled with the custom theme, so that I have a consistent brand experience.

#### Acceptance Criteria

1. THE Theme_App SHALL style Website pages with OneUI design patterns
2. THE Theme_App SHALL apply Brand_Colors to Website navigation and call-to-action elements
3. THE Theme_App SHALL ensure Website forms and interactive elements use OneUI styling
4. THE Theme_App SHALL maintain responsive design on Website pages across all device sizes
5. THE Theme_App SHALL style both standard and custom Website templates

### Requirement 8: Responsive Design Preservation

**User Story:** As a mobile user, I want the theme to work on all device sizes, so that I can use Frappe on any device.

#### Acceptance Criteria

1. THE Theme_App SHALL preserve OneUI's responsive breakpoints (mobile, tablet, desktop)
2. WHEN viewport width changes, THE Theme_App SHALL adapt layouts using OneUI's responsive patterns
3. THE Theme_App SHALL ensure touch-friendly interface elements on mobile devices
4. THE Theme_App SHALL maintain readability and usability at all supported screen sizes
5. THE Theme_App SHALL test responsive behavior on common device sizes (320px, 768px, 1024px, 1920px widths)

### Requirement 9: Asset Management and Build Process

**User Story:** As a developer, I want proper asset management, so that theme files are correctly bundled and cached.

#### Acceptance Criteria

1. THE Theme_App SHALL register all CSS files in hooks.py under appropriate asset bundles
2. THE Theme_App SHALL register all JavaScript files in hooks.py under appropriate asset bundles
3. THE Theme_App SHALL place all assets in the public/ directory structure
4. WHEN assets are modified, THE Theme_App SHALL require bench build to rebuild bundles
5. WHEN assets are modified, THE Theme_App SHALL require bench clear-cache to clear cached versions

### Requirement 10: Upgrade-Safe Implementation

**User Story:** As a system administrator, I want the theme to survive Frappe upgrades, so that I don't lose customizations when updating.

#### Acceptance Criteria

1. THE Theme_App SHALL NOT modify any Frappe_Core files directly
2. THE Theme_App SHALL use only documented Frappe hooks and extension points
3. WHEN JavaScript customizations are needed, THE Theme_App SHALL extend Frappe classes rather than replacing them
4. THE Theme_App SHALL isolate all custom code within the xgc_theme app directory
5. WHEN Frappe_Core is upgraded, THE Theme_App SHALL continue functioning without requiring code changes

### Requirement 11: Component Styling Consistency

**User Story:** As a user, I want consistent styling across all UI components, so that the interface feels cohesive.

#### Acceptance Criteria

1. THE Theme_App SHALL style all button variants (primary, secondary, danger, success) consistently
2. THE Theme_App SHALL style all form controls (inputs, selects, checkboxes, radios) with OneUI patterns
3. THE Theme_App SHALL style all feedback elements (alerts, toasts, modals) consistently
4. THE Theme_App SHALL style all data display elements (tables, cards, lists) with OneUI patterns
5. THE Theme_App SHALL ensure consistent spacing, typography, and shadows across all components

### Requirement 12: Typography System

**User Story:** As a user, I want readable and hierarchical typography, so that content is easy to scan and understand.

#### Acceptance Criteria

1. THE Theme_App SHALL define a clear typographic hierarchy using OneUI's font sizing
2. THE Theme_App SHALL use web-safe or properly loaded custom fonts
3. THE Theme_App SHALL ensure text remains readable at all supported font sizes
4. THE Theme_App SHALL apply consistent line heights and letter spacing within typographic sub-categories (large headings: h1-h2, small headings: h3-h6, body text, code blocks)
5. THE Theme_App SHALL style headings, body text, and code blocks distinctly

### Requirement 13: Performance Optimization

**User Story:** As a user, I want fast page loads, so that the theme doesn't slow down my work.

#### Acceptance Criteria

1. THE Theme_App SHALL minimize CSS file sizes through efficient selectors
2. THE Theme_App SHALL minimize JavaScript file sizes by including only necessary code
3. THE Theme_App SHALL leverage Frappe's asset bundling for optimal loading
4. THE Theme_App SHALL avoid unnecessary CSS specificity that could impact rendering performance
5. WHEN the theme loads, THE Frappe_Core SHALL not experience noticeable performance degradation

### Requirement 14: Browser Compatibility

**User Story:** As a user, I want the theme to work in my browser, so that I'm not forced to switch browsers.

#### Acceptance Criteria

1. THE Theme_App SHALL support Chrome, Firefox, Safari, and Edge browsers
2. THE Theme_App SHALL support browser versions released within the last 2 years
3. THE Theme_App SHALL use CSS features with appropriate fallbacks for older browsers
4. THE Theme_App SHALL test critical functionality across all supported browsers
5. WHEN unsupported CSS features are used, THE Theme_App SHALL provide graceful degradation
