# Design Document: OneUI-Frappe Theme Integration

## Overview

The xgc_theme application integrates the OneUI 5.12 design system into Frappe/ERPNext v16, creating a custom theme that combines modern UI patterns with XGC's brand identity. The design follows Frappe's theming architecture by overriding CSS variables and extending framework classes, ensuring upgrade-safe implementation without modifying core files.

The theme provides both light and dark variants, styles both Desk (admin) and Website (public) interfaces, and maintains OneUI's responsive design patterns. All assets are registered through Frappe's hooks system and bundled using Frappe's build process.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frappe Framework v16                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Theme Switcher & Asset Loader             │ │
│  └────────────────────────────────────────────────────────┘ │
│                            ↓                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    hooks.py Registry                    │ │
│  │  • app_include_css / app_include_js (Desk)            │ │
│  │  • web_include_css / web_include_js (Website)         │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      xgc_theme App                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   public/css/                           │ │
│  │  • xgc_variables.css (CSS variable overrides)          │ │
│  │  • xgc_desk.css (Desk-specific styling)               │ │
│  │  • xgc_website.css (Website-specific styling)         │ │
│  │  • xgc_components.css (OneUI component adaptations)   │ │
│  │  • xgc_dark.css (Dark theme variant)                  │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   public/js/                            │ │
│  │  • xgc_theme.js (Theme initialization & extensions)    │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   OneUI/                                │ │
│  │  • OneUI 5.12 source files (reference)                │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Component Interaction Flow

1. **Theme Registration**: hooks.py registers CSS/JS assets with Frappe
2. **Asset Loading**: Frappe loads assets based on context (Desk vs Website)
3. **Variable Override**: xgc_variables.css overrides Frappe's CSS variables
4. **Component Styling**: xgc_components.css applies OneUI patterns to Frappe elements
5. **Context Styling**: xgc_desk.css or xgc_website.css applies context-specific styles
6. **Variant Selection**: xgc_dark.css loads when dark theme is selected
7. **JS Enhancement**: xgc_theme.js extends Frappe classes for dynamic behavior

## Components and Interfaces

### 1. Theme Configuration (hooks.py)

**Purpose**: Register theme assets with Frappe framework

**Structure**:
```python
app_name = "xgc_theme"
app_title = "XGC Theme"
app_publisher = "XGC"
app_description = "OneUI-based theme for Frappe/ERPNext"
app_version = "0.0.1"

# Desk assets (admin interface)
app_include_css = [
    "/assets/xgc_theme/css/xgc_variables.css",
    "/assets/xgc_theme/css/xgc_components.css",
    "/assets/xgc_theme/css/xgc_desk.css"
]

app_include_js = [
    "/assets/xgc_theme/js/xgc_theme.js"
]

# Website assets (public portal)
web_include_css = [
    "/assets/xgc_theme/css/xgc_variables.css",
    "/assets/xgc_theme/css/xgc_components.css",
    "/assets/xgc_theme/css/xgc_website.css"
]

web_include_js = [
    "/assets/xgc_theme/js/xgc_theme.js"
]

# Theme variants
themes = {
    "XGC Light": {
        "app_include_css": app_include_css,
        "web_include_css": web_include_css
    },
    "XGC Dark": {
        "app_include_css": app_include_css + ["/assets/xgc_theme/css/xgc_dark.css"],
        "web_include_css": web_include_css + ["/assets/xgc_theme/css/xgc_dark.css"]
    }
}
```

**Responsibilities**:
- Register CSS and JavaScript assets
- Define theme variants (light/dark)
- Specify asset loading order
- Separate Desk and Website assets

### 2. CSS Variable Override System (xgc_variables.css)

**Purpose**: Override Frappe's CSS variables with OneUI and brand values

**Key Variable Categories**:

```css
:root {
    /* ===== XGC Brand Colors ===== */
    /* Primary: Forest Green */
    --xgc-forest-green: #2d5016;
    --xgc-forest-green-light: #3d6b1f;
    --xgc-forest-green-lighter: #4d7c2a;
    --xgc-forest-green-dark: #1d3a0f;
    --xgc-forest-green-darker: #0d2005;
    
    /* Secondary: Gold */
    --xgc-gold: #d4af37;
    --xgc-gold-light: #e6c966;
    --xgc-gold-lighter: #f0d68a;
    --xgc-gold-dark: #b8941f;
    --xgc-gold-darker: #9c7a10;
    
    /* ===== Frappe Core Variable Overrides ===== */
    /* Primary colors - used for main actions, links, active states */
    --primary: var(--xgc-forest-green);
    --primary-light: var(--xgc-forest-green-light);
    --primary-dark: var(--xgc-forest-green-dark);
    
    /* Accent colors - used for highlights, secondary actions */
    --accent: var(--xgc-gold);
    --accent-light: var(--xgc-gold-light);
    --accent-dark: var(--xgc-gold-dark);
    
    /* Text colors */
    --text-color: #1f2937;
    --text-muted: #6b7280;
    --text-light: #9ca3af;
    
    /* Background colors */
    --bg-color: #ffffff;
    --surface-color: #f9fafb;
    --surface-hover: #f3f4f6;
    
    /* Border colors */
    --border-color: #e5e7eb;
    --border-color-dark: #d1d5db;
    
    /* ===== OneUI Typography System ===== */
    --font-family-sans-serif: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    --font-family-monospace: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace;
    
    /* Font sizes - OneUI scale */
    --font-size-xs: 0.75rem;      /* 12px */
    --font-size-sm: 0.875rem;     /* 14px */
    --font-size-base: 0.9375rem;  /* 15px */
    --font-size-md: 1rem;         /* 16px */
    --font-size-lg: 1.125rem;     /* 18px */
    --font-size-xl: 1.25rem;      /* 20px */
    --font-size-2xl: 1.5rem;      /* 24px */
    --font-size-3xl: 1.875rem;    /* 30px */
    --font-size-4xl: 2.25rem;     /* 36px */
    
    /* Line heights */
    --line-height-tight: 1.25;
    --line-height-base: 1.5;
    --line-height-relaxed: 1.75;
    
    /* Font weights */
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
    
    /* Letter spacing */
    --letter-spacing-tight: -0.025em;
    --letter-spacing-normal: 0;
    --letter-spacing-wide: 0.025em;
    
    /* ===== OneUI Spacing System ===== */
    --spacing-xs: 0.25rem;   /* 4px */
    --spacing-sm: 0.5rem;    /* 8px */
    --spacing-md: 1rem;      /* 16px */
    --spacing-lg: 1.5rem;    /* 24px */
    --spacing-xl: 2rem;      /* 32px */
    --spacing-2xl: 2.5rem;   /* 40px */
    --spacing-3xl: 3rem;     /* 48px */
    
    /* ===== OneUI Border System ===== */
    --border-width: 1px;
    --border-width-thick: 2px;
    
    --border-radius-sm: 0.25rem;   /* 4px */
    --border-radius: 0.375rem;     /* 6px */
    --border-radius-md: 0.5rem;    /* 8px */
    --border-radius-lg: 0.75rem;   /* 12px */
    --border-radius-xl: 1rem;      /* 16px */
    --border-radius-full: 9999px;  /* Fully rounded */
    
    /* ===== OneUI Shadow System ===== */
    --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    
    /* ===== OneUI Transition System ===== */
    --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
    
    /* ===== OneUI Z-Index System ===== */
    --z-dropdown: 1000;
    --z-sticky: 1020;
    --z-fixed: 1030;
    --z-modal-backdrop: 1040;
    --z-modal: 1050;
    --z-popover: 1060;
    --z-tooltip: 1070;
}
```

**Responsibilities**:
- Define XGC brand colors with comprehensive variation scales (lighter, light, base, dark, darker)
- Override Frappe's primary/accent colors with brand colors
- Provide complete OneUI typography system (fonts, sizes, weights, spacing)
- Provide complete OneUI spacing scale for consistent layouts
- Provide complete OneUI border system (widths, radii)
- Provide complete OneUI shadow system for depth and elevation
- Provide OneUI transition timing for smooth interactions
- Provide z-index scale for proper layering

### 3. Component Adaptation Layer (xgc_components.css)

**Purpose**: Apply OneUI styling to Frappe's HTML components

**Component Categories**:

**Buttons**:

```css
/* ===== Button Base Styles ===== */
.btn {
    /* OneUI button foundation */
    font-family: var(--font-family-sans-serif);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-semibold);
    line-height: var(--line-height-base);
    
    /* Spacing and sizing */
    padding: 0.5rem 1rem;
    min-height: 2.5rem;
    
    /* Visual styling */
    border-radius: var(--border-radius);
    border-width: var(--border-width);
    border-style: solid;
    
    /* Interaction */
    cursor: pointer;
    transition: all var(--transition-fast);
    user-select: none;
    
    /* Layout */
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
}

.btn:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
}

.btn:active {
    transform: translateY(0);
    box-shadow: var(--shadow-sm);
}

.btn:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(45, 80, 22, 0.25);
}

/* ===== Button Variants ===== */
.btn-primary {
    background-color: var(--xgc-forest-green);
    border-color: var(--xgc-forest-green);
    color: #ffffff;
}

.btn-primary:hover {
    background-color: var(--xgc-forest-green-dark);
    border-color: var(--xgc-forest-green-dark);
}

.btn-secondary {
    background-color: transparent;
    border-color: var(--border-color-dark);
    color: var(--text-color);
}

.btn-secondary:hover {
    background-color: var(--surface-hover);
    border-color: var(--xgc-forest-green);
    color: var(--xgc-forest-green);
}

.btn-success {
    background-color: #10b981;
    border-color: #10b981;
    color: #ffffff;
}

.btn-danger {
    background-color: #ef4444;
    border-color: #ef4444;
    color: #ffffff;
}

.btn-warning {
    background-color: var(--xgc-gold);
    border-color: var(--xgc-gold);
    color: #1f2937;
}

/* ===== Button Sizes ===== */
.btn-sm {
    padding: 0.375rem 0.75rem;
    font-size: var(--font-size-sm);
    min-height: 2rem;
}

.btn-lg {
    padding: 0.75rem 1.5rem;
    font-size: var(--font-size-lg);
    min-height: 3rem;
}

/* ===== Button States ===== */
.btn:disabled,
.btn.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}
```

**Form Controls**:

```css
/* ===== Input Base Styles ===== */
.form-control,
input[type="text"],
input[type="email"],
input[type="password"],
input[type="number"],
input[type="tel"],
input[type="url"],
input[type="search"],
input[type="date"],
input[type="time"],
textarea,
select {
    /* OneUI input foundation */
    font-family: var(--font-family-sans-serif);
    font-size: var(--font-size-base);
    line-height: var(--line-height-base);
    color: var(--text-color);
    
    /* Spacing and sizing */
    padding: 0.5rem 0.75rem;
    min-height: 2.5rem;
    width: 100%;
    
    /* Visual styling */
    background-color: var(--bg-color);
    border: var(--border-width) solid var(--border-color);
    border-radius: var(--border-radius);
    
    /* Interaction */
    transition: border-color var(--transition-fast), 
                box-shadow var(--transition-fast),
                background-color var(--transition-fast);
}

.form-control:hover,
input:hover,
textarea:hover,
select:hover {
    border-color: var(--border-color-dark);
}

.form-control:focus,
input:focus,
textarea:focus,
select:focus {
    outline: none;
    border-color: var(--xgc-forest-green);
    box-shadow: 0 0 0 3px rgba(45, 80, 22, 0.1);
    background-color: var(--bg-color);
}

.form-control::placeholder,
input::placeholder,
textarea::placeholder {
    color: var(--text-light);
}

/* ===== Textarea Specific ===== */
textarea.form-control,
textarea {
    min-height: 6rem;
    resize: vertical;
}

/* ===== Select Specific ===== */
select.form-control,
select {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 16px 12px;
    padding-right: 2.5rem;
}

/* ===== Checkbox and Radio ===== */
input[type="checkbox"],
input[type="radio"] {
    width: 1.125rem;
    height: 1.125rem;
    min-height: auto;
    margin-right: var(--spacing-sm);
    cursor: pointer;
    border: var(--border-width) solid var(--border-color-dark);
    transition: all var(--transition-fast);
}

input[type="checkbox"] {
    border-radius: var(--border-radius-sm);
}

input[type="radio"] {
    border-radius: var(--border-radius-full);
}

input[type="checkbox"]:checked,
input[type="radio"]:checked {
    background-color: var(--xgc-forest-green);
    border-color: var(--xgc-forest-green);
}

/* ===== Form Labels ===== */
.form-label,
label {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--text-color);
    margin-bottom: var(--spacing-xs);
    display: block;
}

/* ===== Form Groups ===== */
.form-group,
.frappe-control {
    margin-bottom: var(--spacing-md);
}

/* ===== Input States ===== */
.form-control:disabled,
input:disabled,
textarea:disabled,
select:disabled {
    background-color: var(--surface-color);
    color: var(--text-muted);
    cursor: not-allowed;
    opacity: 0.6;
}

.form-control.is-invalid,
input.is-invalid {
    border-color: #ef4444;
}

.form-control.is-invalid:focus,
input.is-invalid:focus {
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
```

**Cards**:

```css
/* ===== Card Base Styles ===== */
.card,
.frappe-card {
    /* OneUI card foundation */
    background-color: var(--bg-color);
    border: var(--border-width) solid var(--border-color);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-sm);
    
    /* Spacing */
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-md);
    
    /* Interaction */
    transition: box-shadow var(--transition-base),
                transform var(--transition-base);
}

.card:hover,
.frappe-card:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
}

/* ===== Card Header ===== */
.card-header {
    padding: var(--spacing-md) var(--spacing-lg);
    margin: calc(-1 * var(--spacing-lg)) calc(-1 * var(--spacing-lg)) var(--spacing-md);
    background-color: var(--surface-color);
    border-bottom: var(--border-width) solid var(--border-color);
    border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
    font-weight: var(--font-weight-semibold);
    color: var(--text-color);
}

/* ===== Card Body ===== */
.card-body {
    padding: var(--spacing-lg);
}

/* ===== Card Footer ===== */
.card-footer {
    padding: var(--spacing-md) var(--spacing-lg);
    margin: var(--spacing-md) calc(-1 * var(--spacing-lg)) calc(-1 * var(--spacing-lg));
    background-color: var(--surface-color);
    border-top: var(--border-width) solid var(--border-color);
    border-radius: 0 0 var(--border-radius-lg) var(--border-radius-lg);
}
```

**Navigation**:

```css
/* ===== Navbar Base Styles ===== */
.navbar {
    /* OneUI navbar foundation */
    background-color: var(--xgc-forest-green);
    box-shadow: var(--shadow-md);
    padding: var(--spacing-md) var(--spacing-lg);
    
    /* Layout */
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-md);
}

/* ===== Nav Links ===== */
.nav-link {
    color: rgba(255, 255, 255, 0.9);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-medium);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius);
    transition: color var(--transition-fast),
                background-color var(--transition-fast);
    text-decoration: none;
}

.nav-link:hover {
    color: var(--xgc-gold);
    background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
    color: var(--xgc-gold);
    background-color: rgba(255, 255, 255, 0.15);
    font-weight: var(--font-weight-semibold);
}

/* ===== Breadcrumbs ===== */
.breadcrumb {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) 0;
    margin: 0;
    list-style: none;
}

.breadcrumb-item {
    color: var(--text-muted);
    font-size: var(--font-size-sm);
}

.breadcrumb-item a {
    color: var(--xgc-forest-green);
    text-decoration: none;
    transition: color var(--transition-fast);
}

.breadcrumb-item a:hover {
    color: var(--xgc-forest-green-dark);
}

.breadcrumb-item.active {
    color: var(--text-color);
    font-weight: var(--font-weight-medium);
}

.breadcrumb-item + .breadcrumb-item::before {
    content: "/";
    color: var(--text-light);
    margin-right: var(--spacing-sm);
}
```

**Tables**:

```css
/* ===== Table Base Styles ===== */
.table {
    width: 100%;
    border-collapse: collapse;
    background-color: var(--bg-color);
    border-radius: var(--border-radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
}

.table thead {
    background-color: var(--surface-color);
}

.table thead th {
    padding: var(--spacing-md);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    color: var(--text-color);
    text-align: left;
    border-bottom: 2px solid var(--border-color-dark);
}

.table tbody td {
    padding: var(--spacing-md);
    font-size: var(--font-size-base);
    color: var(--text-color);
    border-bottom: var(--border-width) solid var(--border-color);
}

.table tbody tr {
    transition: background-color var(--transition-fast);
}

.table tbody tr:hover {
    background-color: var(--surface-hover);
}

.table tbody tr:last-child td {
    border-bottom: none;
}
```

**Alerts and Feedback**:

```css
/* ===== Alert Base Styles ===== */
.alert {
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: var(--border-radius);
    border: var(--border-width) solid transparent;
    margin-bottom: var(--spacing-md);
    font-size: var(--font-size-base);
    line-height: var(--line-height-base);
}

.alert-success {
    background-color: #d1fae5;
    border-color: #10b981;
    color: #065f46;
}

.alert-warning {
    background-color: #fef3c7;
    border-color: var(--xgc-gold);
    color: #92400e;
}

.alert-danger {
    background-color: #fee2e2;
    border-color: #ef4444;
    color: #991b1b;
}

.alert-info {
    background-color: #dbeafe;
    border-color: #3b82f6;
    color: #1e40af;
}

/* ===== Toast Notifications ===== */
.toast {
    min-width: 300px;
    padding: var(--spacing-md);
    background-color: var(--surface-color);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-xl);
    border: var(--border-width) solid var(--border-color);
}

/* ===== Modal Dialogs ===== */
.modal-content {
    background-color: var(--bg-color);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-2xl);
    border: var(--border-width) solid var(--border-color);
}

.modal-header {
    padding: var(--spacing-lg);
    border-bottom: var(--border-width) solid var(--border-color);
}

.modal-body {
    padding: var(--spacing-lg);
}

.modal-footer {
    padding: var(--spacing-lg);
    border-top: var(--border-width) solid var(--border-color);
    display: flex;
    justify-content: flex-end;
    gap: var(--spacing-sm);
}
```

**Responsibilities**:
- Style buttons with OneUI patterns and brand colors
- Style form controls with OneUI patterns and proper states
- Style cards with OneUI elevation and spacing
- Style navigation elements with brand colors
- Style tables with proper hierarchy and hover states
- Style alerts and feedback with semantic colors
- Apply brand colors to interactive elements
- Add OneUI transitions and hover effects
- Ensure consistent spacing using theme variables
- Maintain accessibility with proper focus states

### 4. Desk Interface Styling (xgc_desk.css)

**Purpose**: Apply theme to Frappe Desk (admin interface)

**Key Areas**:

**Sidebar**:
```css
.desk-sidebar {
    background-color: var(--xgc-forest-green-dark);
    border-right: 1px solid var(--xgc-forest-green);
}

.desk-sidebar .sidebar-item {
    color: rgba(255, 255, 255, 0.8);
    border-radius: var(--border-radius);
    transition: background-color 0.15s ease-in-out;
}

.desk-sidebar .sidebar-item:hover {
    background-color: var(--xgc-forest-green);
    color: white;
}

.desk-sidebar .sidebar-item.active {
    background-color: var(--xgc-forest-green);
    color: var(--xgc-gold);
}
```

**Toolbar**:
```css
.page-head {
    background-color: white;
    border-bottom: 1px solid #e5e7eb;
    box-shadow: var(--shadow-sm);
}

.page-title {
    color: var(--xgc-forest-green);
    font-weight: 600;
}
```

**Forms and Lists**:
```css
.frappe-control {
    margin-bottom: var(--spacing-md);
}

.grid-row {
    border-radius: var(--border-radius);
    transition: background-color 0.15s ease-in-out;
}

.grid-row:hover {
    background-color: rgba(45, 80, 22, 0.05);
}
```

**Responsibilities**:
- Style Desk sidebar navigation
- Style Desk toolbar and page headers
- Style Desk forms and form controls
- Style Desk lists and grids
- Style Desk dashboards and widgets

### 5. Website Interface Styling (xgc_website.css)

**Purpose**: Apply theme to Frappe Website (public portal)

**Key Areas**:

**Header**:
```css
.web-header {
    background-color: white;
    border-bottom: 1px solid #e5e7eb;
    box-shadow: var(--shadow-sm);
}

.web-header .navbar-brand {
    color: var(--xgc-forest-green);
    font-weight: 700;
}

.web-header .nav-link {
    color: var(--xgc-forest-green);
}

.web-header .nav-link:hover {
    color: var(--xgc-gold);
}
```

**Content**:
```css
.web-content {
    padding: var(--spacing-xl) 0;
}

.web-content h1, .web-content h2, .web-content h3 {
    color: var(--xgc-forest-green);
}

.web-content a {
    color: var(--xgc-forest-green);
    text-decoration: none;
    transition: color 0.15s ease-in-out;
}

.web-content a:hover {
    color: var(--xgc-gold);
}
```

**Forms**:
```css
.web-form .form-control {
    border-radius: var(--border-radius);
}

.web-form .btn-primary {
    background-color: var(--xgc-forest-green);
}
```

**Responsibilities**:
- Style Website header and navigation
- Style Website content areas
- Style Website forms
- Style Website footers
- Apply brand colors to call-to-action elements

### 6. Dark Theme Variant (xgc_dark.css)

**Purpose**: Provide dark theme variant with adjusted colors for optimal readability and contrast

**Variable Overrides**:

```css
[data-theme="dark"], .dark-mode {
    /* ===== Background Colors ===== */
    --bg-color: #111827;           /* Very dark gray-blue */
    --surface-color: #1f2937;      /* Dark gray-blue */
    --surface-hover: #374151;      /* Medium gray-blue */
    --surface-elevated: #2d3748;   /* Slightly elevated surface */
    
    /* ===== Text Colors ===== */
    --text-color: #f9fafb;         /* Almost white */
    --text-muted: #d1d5db;         /* Light gray */
    --text-light: #9ca3af;         /* Medium gray */
    
    /* ===== Brand Colors (Adjusted for Dark Mode) ===== */
    /* Forest Green - Lighter and more vibrant for dark backgrounds */
    --xgc-forest-green: #4a7c2a;
    --xgc-forest-green-light: #5a9c3a;
    --xgc-forest-green-lighter: #6abc4a;
    --xgc-forest-green-dark: #3a6c1a;
    --xgc-forest-green-darker: #2a5c0a;
    
    /* Gold - Brighter and warmer for dark backgrounds */
    --xgc-gold: #f0c14b;
    --xgc-gold-light: #ffd666;
    --xgc-gold-lighter: #ffe699;
    --xgc-gold-dark: #d4a933;
    --xgc-gold-darker: #b8941f;
    
    /* Primary/Accent (use adjusted brand colors) */
    --primary: var(--xgc-forest-green);
    --primary-light: var(--xgc-forest-green-light);
    --primary-dark: var(--xgc-forest-green-dark);
    --accent: var(--xgc-gold);
    --accent-light: var(--xgc-gold-light);
    --accent-dark: var(--xgc-gold-dark);
    
    /* ===== Border Colors ===== */
    --border-color: #374151;       /* Subtle borders */
    --border-color-dark: #4b5563;  /* More visible borders */
    
    /* ===== Shadows (Darker and more pronounced) ===== */
    --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
    --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4);
    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4);
    --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
    
    /* ===== State Colors ===== */
    --success-bg: #065f46;
    --success-text: #6ee7b7;
    --warning-bg: #92400e;
    --warning-text: #fcd34d;
    --danger-bg: #991b1b;
    --danger-text: #fca5a5;
    --info-bg: #1e40af;
    --info-text: #93c5fd;
}
```

**Component Adjustments**:

```css
/* ===== Cards and Surfaces ===== */
[data-theme="dark"] .card,
[data-theme="dark"] .frappe-card {
    background-color: var(--surface-color);
    border-color: var(--border-color);
    color: var(--text-color);
}

[data-theme="dark"] .card:hover,
[data-theme="dark"] .frappe-card:hover {
    background-color: var(--surface-hover);
    box-shadow: var(--shadow-lg);
}

/* ===== Form Controls ===== */
[data-theme="dark"] .form-control,
[data-theme="dark"] input,
[data-theme="dark"] select,
[data-theme="dark"] textarea {
    background-color: var(--surface-color);
    border-color: var(--border-color);
    color: var(--text-color);
}

[data-theme="dark"] .form-control:focus,
[data-theme="dark"] input:focus,
[data-theme="dark"] select:focus,
[data-theme="dark"] textarea:focus {
    background-color: var(--surface-elevated);
    border-color: var(--xgc-forest-green);
    box-shadow: 0 0 0 0.2rem rgba(74, 124, 42, 0.25);
}

[data-theme="dark"] .form-control::placeholder,
[data-theme="dark"] input::placeholder,
[data-theme="dark"] textarea::placeholder {
    color: var(--text-light);
}

/* ===== Buttons ===== */
[data-theme="dark"] .btn-primary {
    background-color: var(--xgc-forest-green);
    border-color: var(--xgc-forest-green);
    color: #ffffff;
}

[data-theme="dark"] .btn-primary:hover {
    background-color: var(--xgc-forest-green-light);
    border-color: var(--xgc-forest-green-light);
}

[data-theme="dark"] .btn-secondary {
    background-color: var(--surface-color);
    border-color: var(--border-color-dark);
    color: var(--text-color);
}

[data-theme="dark"] .btn-secondary:hover {
    background-color: var(--surface-hover);
    border-color: var(--border-color-dark);
}

/* ===== Navigation ===== */
[data-theme="dark"] .navbar,
[data-theme="dark"] .desk-sidebar {
    background-color: var(--surface-color);
    border-color: var(--border-color);
}

[data-theme="dark"] .nav-link {
    color: var(--text-muted);
}

[data-theme="dark"] .nav-link:hover,
[data-theme="dark"] .nav-link.active {
    color: var(--xgc-gold);
}

/* ===== Tables and Lists ===== */
[data-theme="dark"] .table,
[data-theme="dark"] .grid-row {
    background-color: var(--surface-color);
    border-color: var(--border-color);
    color: var(--text-color);
}

[data-theme="dark"] .table thead th,
[data-theme="dark"] .grid-heading-row {
    background-color: var(--surface-elevated);
    border-color: var(--border-color-dark);
    color: var(--text-color);
}

[data-theme="dark"] .table tbody tr:hover,
[data-theme="dark"] .grid-row:hover {
    background-color: var(--surface-hover);
}

/* ===== Modals and Overlays ===== */
[data-theme="dark"] .modal-content {
    background-color: var(--surface-color);
    border-color: var(--border-color);
    color: var(--text-color);
}

[data-theme="dark"] .modal-header {
    border-bottom-color: var(--border-color);
}

[data-theme="dark"] .modal-footer {
    border-top-color: var(--border-color);
}

/* ===== Alerts and Feedback ===== */
[data-theme="dark"] .alert-success {
    background-color: var(--success-bg);
    color: var(--success-text);
    border-color: var(--success-text);
}

[data-theme="dark"] .alert-warning {
    background-color: var(--warning-bg);
    color: var(--warning-text);
    border-color: var(--warning-text);
}

[data-theme="dark"] .alert-danger {
    background-color: var(--danger-bg);
    color: var(--danger-text);
    border-color: var(--danger-text);
}

[data-theme="dark"] .alert-info {
    background-color: var(--info-bg);
    color: var(--info-text);
    border-color: var(--info-text);
}

/* ===== Code Blocks ===== */
[data-theme="dark"] code,
[data-theme="dark"] pre {
    background-color: var(--surface-elevated);
    color: var(--text-color);
    border-color: var(--border-color);
}

/* ===== Scrollbars (Webkit browsers) ===== */
[data-theme="dark"] ::-webkit-scrollbar {
    width: 12px;
    height: 12px;
}

[data-theme="dark"] ::-webkit-scrollbar-track {
    background-color: var(--surface-color);
}

[data-theme="dark"] ::-webkit-scrollbar-thumb {
    background-color: var(--surface-hover);
    border-radius: var(--border-radius);
}

[data-theme="dark"] ::-webkit-scrollbar-thumb:hover {
    background-color: var(--border-color-dark);
}
```

**Responsibilities**:
- Override background colors for dark mode with proper hierarchy (bg → surface → elevated)
- Adjust text colors for readability on dark backgrounds
- Adjust brand colors to be more vibrant and visible on dark backgrounds
- Adjust borders to be visible but not harsh
- Adjust shadows to be darker and more pronounced
- Ensure WCAG AA contrast compliance for all text and UI elements
- Style all component types for dark mode consistency
- Provide smooth visual experience with proper color relationships

### 7. JavaScript Extensions (xgc_theme.js)

**Purpose**: Extend Frappe classes for dynamic theme behavior

**Structure**:
```javascript
frappe.provide('xgc_theme');

xgc_theme = {
    init: function() {
        this.setup_theme_switcher();
        this.apply_component_enhancements();
        this.setup_responsive_handlers();
    },
    
    setup_theme_switcher: function() {
        // Enhance theme switching with smooth transitions
        $(document).on('theme-change', function(e, theme) {
            $('body').addClass('theme-transitioning');
            setTimeout(() => {
                $('body').removeClass('theme-transitioning');
            }, 300);
        });
    },
    
    apply_component_enhancements: function() {
        // Add OneUI-style ripple effects to buttons
        $(document).on('click', '.btn', function(e) {
            const ripple = $('<span class="ripple"></span>');
            $(this).append(ripple);
            
            const x = e.pageX - $(this).offset().left;
            const y = e.pageY - $(this).offset().top;
            
            ripple.css({ left: x, top: y });
            
            setTimeout(() => ripple.remove(), 600);
        });
    },
    
    setup_responsive_handlers: function() {
        // Handle responsive behavior for OneUI components
        const handleResize = frappe.utils.debounce(function() {
            const width = $(window).width();
            $('body').toggleClass('mobile-view', width < 768);
            $('body').toggleClass('tablet-view', width >= 768 && width < 1024);
            $('body').toggleClass('desktop-view', width >= 1024);
        }, 250);
        
        $(window).on('resize', handleResize);
        handleResize();
    }
};

$(document).ready(function() {
    xgc_theme.init();
});
```

**Responsibilities**:
- Initialize theme on page load
- Enhance theme switching with transitions
- Add OneUI-style interactions (ripples, animations)
- Handle responsive behavior
- Extend Frappe classes without replacing them

## Data Models

### Theme Configuration Data

The theme doesn't introduce new DocTypes but works with Frappe's existing theme system:

**Frappe's Theme Selection**:
- Stored in User document: `user.desk_theme`
- Stored in Website Settings: `website_settings.theme`

**CSS Variable Structure**:
```javascript
{
    "brand_colors": {
        "primary": "#2d5016",      // XGC Forest Green
        "primary_light": "#3d6b1f",
        "primary_dark": "#1d3a0f",
        "accent": "#d4af37",        // XGC Gold
        "accent_light": "#e6c966",
        "accent_dark": "#b8941f"
    },
    "typography": {
        "font_family": "Inter, sans-serif",
        "font_size_base": "0.9375rem",
        "line_height_base": 1.5
    },
    "spacing": {
        "xs": "0.25rem",
        "sm": "0.5rem",
        "md": "1rem",
        "lg": "1.5rem",
        "xl": "2rem"
    },
    "borders": {
        "radius": "0.375rem",
        "radius_sm": "0.25rem",
        "radius_lg": "0.5rem"
    }
}
```

### Asset Bundle Structure

```javascript
{
    "desk_assets": {
        "css": [
            "xgc_variables.css",
            "xgc_components.css",
            "xgc_desk.css"
        ],
        "js": [
            "xgc_theme.js"
        ]
    },
    "website_assets": {
        "css": [
            "xgc_variables.css",
            "xgc_components.css",
            "xgc_website.css"
        ],
        "js": [
            "xgc_theme.js"
        ]
    },
    "dark_variant": {
        "additional_css": [
            "xgc_dark.css"
        ]
    }
}
```


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: CSS Variable Override Completeness

*For any* CSS variable defined in the theme's xgc_variables.css file (including OneUI values and brand colors), that variable should be properly set and accessible via computed styles when queried in the browser.

**Validates: Requirements 3.2, 3.3**

### Property 2: Brand Color Application to UI Elements

*For any* primary UI element (headers, primary buttons, primary links, toolbar elements), the computed color values should use the defined brand colors (#2d5016 forest green or #d4af37 gold) or their defined variations (light/dark shades).

**Validates: Requirements 4.3**

### Property 3: Brand Color Contrast Compliance

*For any* combination of brand color (foreground) and background color used in the theme, the contrast ratio should meet or exceed WCAG 2.1 AA requirements (4.5:1 for normal text, 3:1 for large text and UI components).

**Validates: Requirements 4.4**

### Property 4: Color Variation Availability

*For any* brand color (forest green or gold), the theme should provide lighter and darker variations (at minimum: base, light, dark) accessible via CSS variables with the naming pattern --xgc-{color}-{variant}.

**Validates: Requirements 4.5**

### Property 5: Theme Variant Color Characteristics

*For any* theme variant (light or dark), background colors and text colors should maintain appropriate contrast characteristics: light theme has light backgrounds (luminance > 0.5) with dark text (luminance < 0.5), dark theme has dark backgrounds (luminance < 0.5) with light text (luminance > 0.5).

**Validates: Requirements 5.1, 5.2, 5.4**

### Property 6: Component Styling Consistency

*For any* component type (buttons, form controls, feedback elements, data display elements), all instances of that component type should share consistent base styling properties including border-radius (within ±1px), padding (within ±2px), and transition duration (within ±50ms).

**Validates: Requirements 11.1, 11.2, 11.3, 11.4**

### Property 7: Responsive Breakpoint Behavior

*For any* viewport width at or crossing a defined OneUI breakpoint (mobile: <768px, tablet: 768px-1023px, desktop: ≥1024px), the layout should adapt by applying breakpoint-specific media query styles and the body element should have the corresponding class (mobile-view, tablet-view, or desktop-view).

**Validates: Requirements 2.2, 8.1, 8.2**

### Property 8: Touch Target Sizing on Mobile

*For any* interactive element (buttons, links, form controls, clickable icons) at mobile viewport widths (<768px), the element should have minimum computed dimensions of 44x44 pixels (width and height) for touch-friendly interaction.

**Validates: Requirements 8.3**

### Property 9: Website Responsive Design

*For any* Website page rendered at standard viewport widths (320px, 768px, 1024px, 1920px), the page should maintain proper layout without horizontal scrolling (document width ≤ viewport width) and with readable text sizes (font-size ≥ 14px for body text).

**Validates: Requirements 7.4**

### Property 10: Typographic Hierarchy

*For any* sequence of heading elements (h1 through h6) within the same container, each subsequent heading level should have a computed font-size less than or equal to the previous level, establishing clear visual hierarchy (h1 ≥ h2 ≥ h3 ≥ h4 ≥ h5 ≥ h6).

**Validates: Requirements 12.1**

### Property 11: Font Loading Success

*For any* custom font specified in the theme's font-family declarations, the font should either load successfully (font-family matches specified font) or fall back to a web-safe font in the stack (sans-serif, serif, or monospace), ensuring text is always rendered.

**Validates: Requirements 12.2**

### Property 12: Typography Consistency

*For any* text element within a typographic sub-category (large headings: h1-h2, small headings: h3-h6, body text, code blocks), the line-height and letter-spacing values should be consistent across all elements in that sub-category (within ±0.1 for line-height, within ±0.01em for letter-spacing).

**Validates: Requirements 12.4**

### Property 13: Text Type Distinction

*For any* pair of different text types (heading vs body, body vs code, heading vs code), the computed styles should differ in at least one significant property: font-size (difference ≥ 2px), font-weight (difference ≥ 100), font-family (different family), or color (different hex value).

**Validates: Requirements 12.5**

### Property 14: Cross-Browser Style Consistency

*For any* major browser (Chrome, Firefox, Safari, Edge) and key component (buttons, form controls, cards), the computed styles should match within acceptable tolerances: dimensions within ±2px, colors exact match (same hex value), border-radius within ±1px.

**Validates: Requirements 14.1**

### Property 15: OneUI Component Styling Preservation

*For any* Frappe component that maps to a OneUI component (buttons, form controls, cards, navigation elements), the component should have OneUI's characteristic styling properties: border-radius matching OneUI values (0.25rem-0.5rem), box-shadow present on interactive elements, and transition duration of 0.15s-0.3s.

**Validates: Requirements 2.3, 2.4, 2.5**

### Property 16: Desk Component Styling

*For any* Desk-specific component (sidebar items, page headers, form controls, grid rows, dashboard widgets), the component should have the theme's styling applied: brand colors used for primary elements, OneUI border-radius values, and proper spacing using theme spacing variables (--spacing-xs through --spacing-xl).

**Validates: Requirements 6.1, 6.2, 6.3, 6.5**

### Property 17: Website Component Styling

*For any* Website-specific component (navigation links, content headings, form controls, call-to-action buttons), the component should have the theme's styling applied: brand colors used for primary elements, OneUI border-radius values, and proper spacing using theme spacing variables (--spacing-xs through --spacing-xl).

**Validates: Requirements 7.1, 7.2, 7.3**

## Error Handling

### CSS Loading Failures

**Scenario**: CSS files fail to load due to network issues or incorrect paths

**Handling**:
- Frappe will fall back to default styles
- Users will see unstyled but functional interface
- Browser console will log 404 errors for missing assets
- Theme selection will remain in user preferences for retry on next page load

**Prevention**:
- Verify all asset paths in hooks.py match actual file locations
- Test asset loading in development before deployment
- Use relative paths that work across different Frappe installations

### JavaScript Initialization Errors

**Scenario**: xgc_theme.js fails to initialize due to JavaScript errors

**Handling**:
- Wrap initialization in try-catch blocks
- Log errors to console for debugging
- Frappe core functionality continues to work
- Theme enhancements (ripples, transitions) gracefully degrade

**Prevention**:
- Test JavaScript in multiple browsers
- Use feature detection before accessing browser APIs
- Extend Frappe classes safely with existence checks

### CSS Variable Undefined

**Scenario**: CSS variable is referenced but not defined

**Handling**:
- CSS will use fallback values where specified: `var(--primary, #2d5016)`
- Browser will ignore invalid property values
- Component will render with browser defaults

**Prevention**:
- Define all CSS variables in xgc_variables.css
- Provide fallback values in variable references
- Test in browsers with CSS variable support

### Theme Switching Failures

**Scenario**: User attempts to switch themes but selection doesn't persist

**Handling**:
- Frappe handles theme persistence in User document
- If save fails, user sees error message
- Current theme remains active until successful save
- User can retry theme selection

**Prevention**:
- Ensure proper Frappe permissions for User document updates
- Test theme switching with different user roles
- Verify database connectivity

### Responsive Breakpoint Issues

**Scenario**: Layout doesn't adapt properly at breakpoints

**Handling**:
- CSS media queries are declarative and fail-safe
- If JavaScript resize handler fails, CSS media queries still work
- Users may not get body classes but CSS still applies

**Prevention**:
- Use CSS media queries as primary responsive mechanism
- JavaScript enhancements are progressive additions
- Test at actual breakpoint widths

### Dark Theme Contrast Issues

**Scenario**: Dark theme has insufficient contrast in some areas

**Handling**:
- Users can switch back to light theme
- Browser accessibility tools can highlight contrast issues
- Specific components can be overridden with user stylesheets

**Prevention**:
- Test all brand color combinations with contrast checkers
- Verify WCAG AA compliance before deployment
- Provide sufficient color variations for different backgrounds

### Font Loading Failures

**Scenario**: Custom fonts fail to load

**Handling**:
- CSS font-family stack includes fallbacks
- Browser uses next available font in stack
- Text remains readable with system fonts

**Prevention**:
- Define complete font-family stacks with web-safe fallbacks
- Test font loading across different network conditions
- Consider using system fonts for critical text

### Build Process Failures

**Scenario**: `bench build` fails to compile assets

**Handling**:
- Build process shows error messages
- Previous asset bundles remain in place
- Site continues using last successful build

**Prevention**:
- Validate CSS syntax before committing
- Test JavaScript for syntax errors
- Run `bench build` in development before deployment

## Testing Strategy

### Dual Testing Approach

The theme will be validated using both unit tests and property-based tests:

**Unit Tests**: Verify specific examples, edge cases, and integration points
- Specific color values match brand guidelines
- Specific components render with expected HTML structure
- Theme registration in hooks.py is correct
- Asset paths resolve correctly

**Property-Based Tests**: Verify universal properties across all inputs
- All CSS variables are defined and accessible
- All brand color combinations meet contrast requirements
- All components maintain consistent styling patterns
- Responsive behavior works at all viewport widths

Both testing approaches are complementary and necessary for comprehensive coverage. Unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across the entire input space.

### Testing Framework Selection

**For CSS/Visual Testing**:
- **Playwright** or **Cypress** for browser automation
- **jest-axe** for accessibility testing (contrast ratios)
- **BackstopJS** or **Percy** for visual regression testing

**For Property-Based Testing**:
- **fast-check** (JavaScript/TypeScript) for property-based tests
- Minimum 100 iterations per property test
- Each test tagged with: `Feature: oneui-frappe-theme-integration, Property {N}: {property_text}`

### Test Organization

```
xgc_theme/
├── tests/
│   ├── unit/
│   │   ├── test_theme_registration.js
│   │   ├── test_css_variables.js
│   │   ├── test_component_styles.js
│   │   └── test_responsive_behavior.js
│   ├── property/
│   │   ├── test_css_variable_completeness.js
│   │   ├── test_brand_color_contrast.js
│   │   ├── test_component_consistency.js
│   │   ├── test_responsive_breakpoints.js
│   │   └── test_typography_hierarchy.js
│   └── visual/
│       ├── backstop.config.js
│       └── scenarios/
│           ├── desk_interface.js
│           ├── website_interface.js
│           └── theme_variants.js
```

### Property Test Configuration

Each property-based test must:
1. Run minimum 100 iterations with randomized inputs
2. Reference its design document property number
3. Use the tag format: `Feature: oneui-frappe-theme-integration, Property {N}: {property_text}`
4. Test the universal property across all valid inputs

Example property test structure:
```javascript
// Feature: oneui-frappe-theme-integration, Property 3: Brand Color Contrast Compliance
test('all brand color combinations meet WCAG AA contrast requirements', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...brandColors),
      fc.constantFrom(...backgroundColors),
      (foreground, background) => {
        const ratio = calculateContrastRatio(foreground, background);
        const isLargeText = false; // Test for normal text
        const minimumRatio = isLargeText ? 3.0 : 4.5;
        return ratio >= minimumRatio;
      }
    ),
    { numRuns: 100 }
  );
});
```

### Test Execution

**Development**:
```bash
# Run unit tests
cd xgc_theme
npm test

# Run property tests
npm run test:property

# Run visual regression tests
npm run test:visual
```

**CI/CD Integration**:
- Run all tests on pull requests
- Run visual regression tests on main branch
- Block merges if tests fail
- Generate coverage reports

### Manual Testing Checklist

Beyond automated tests, manual verification should include:

1. **Theme Installation**:
   - [ ] Install xgc_theme app in fresh Frappe instance
   - [ ] Verify theme appears in theme switcher
   - [ ] Select theme and verify assets load

2. **Visual Verification**:
   - [ ] Check brand colors appear correctly
   - [ ] Verify light theme has light backgrounds
   - [ ] Verify dark theme has dark backgrounds
   - [ ] Test responsive behavior at breakpoints

3. **Cross-Browser Testing**:
   - [ ] Test in Chrome (latest)
   - [ ] Test in Firefox (latest)
   - [ ] Test in Safari (latest)
   - [ ] Test in Edge (latest)

4. **Accessibility Testing**:
   - [ ] Run axe DevTools on Desk interface
   - [ ] Run axe DevTools on Website interface
   - [ ] Verify keyboard navigation works
   - [ ] Test with screen reader

5. **Performance Testing**:
   - [ ] Measure page load time with theme
   - [ ] Compare to default Frappe theme
   - [ ] Verify no significant degradation

### Acceptance Criteria

The theme implementation is complete when:
- All property-based tests pass (100 iterations each)
- All unit tests pass
- Visual regression tests show no unexpected changes
- Manual testing checklist is complete
- All 14 correctness properties are validated
- Theme works in all supported browsers
- Accessibility tests pass (WCAG AA compliance)
- Performance is within acceptable range (no >10% degradation)
