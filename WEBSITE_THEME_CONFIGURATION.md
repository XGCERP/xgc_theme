# Frappe Website Theme Configuration Guide

Complete guide for configuring Website Theme DocType in Frappe/ERPNext.

## Website Theme DocType Structure

### Access
- **URL**: http://localhost:8000/app/website-theme
- **Required Role**: Website Manager or Administrator
- **Module**: Website

---

## Field Reference

### Tab 1: Theme Configuration

#### Basic Information

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| **Theme** | Data | Yes | Unique theme name | `XGC Light`, `XGC Dark` |
| **Module** | Link | Yes | Module assignment | `Website` (default) |
| **Custom?** | Check | No | Mark as custom theme | `1` (checked) |

#### Typography

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| **Google Font** | Data | No | Google Font family name | `Inter`, `Roboto`, `Poppins` |
| **Font Properties** | Data | No | Font weight variations | `wght@300;400;500;600;700;800` |
| **Font Size** | Data | No | Base font size | `14px`, `16px`, `1rem` |

**Google Font Examples:**
- `Inter` - Modern, clean sans-serif
- `Roboto` - Material Design standard
- `Poppins` - Geometric sans-serif
- `Open Sans` - Humanist sans-serif
- `Lato` - Professional sans-serif
- `Montserrat` - Urban, modern

#### Button Styling

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| **Button Rounded Corners** | Check | 1 | Enable rounded button corners |
| **Button Shadows** | Check | 0 | Add shadow effects to buttons |
| **Button Gradients** | Check | 0 | Use gradient backgrounds |

#### Color Scheme

All color fields link to the **Color** DocType. You must create Color records first.

| Field | Type | Required | Description | XGC Light Example | XGC Dark Example |
|-------|------|----------|-------------|-------------------|------------------|
| **Primary Color** | Link (Color) | No | Brand/accent color | `#2E7D32` (Green) | `#66BB6A` (Light Green) |
| **Text Color** | Link (Color) | No | Main text color | `#212121` (Dark Gray) | `#E0E0E0` (Light Gray) |
| **Light Color** | Link (Color) | No | Light backgrounds | `#F5F5F5` (Off White) | `#424242` (Dark Gray) |
| **Dark Color** | Link (Color) | No | Dark elements | `#212121` (Almost Black) | `#121212` (True Black) |
| **Background Color** | Link (Color) | No | Page background | `#FFFFFF` (White) | `#1E1E1E` (Dark) |

---

### Tab 2: Stylesheet

#### Custom SCSS

| Field | Type | Description | Use Case |
|-------|------|-------------|----------|
| **Custom SCSS** | Code (SCSS) | Custom SCSS variables and mixins | Define theme-specific variables |
| **Custom Overrides** | Code (SCSS) | Override existing styles | Modify specific components |

**Example Custom SCSS:**
```scss
// Brand Colors
$xgc-primary: #2E7D32;
$xgc-secondary: #1B5E20;
$xgc-accent: #4CAF50;

// Typography
$xgc-font-family: 'Inter', sans-serif;
$xgc-heading-weight: 600;

// Spacing
$xgc-spacing-unit: 8px;
$xgc-border-radius: 4px;

// Shadows
$xgc-shadow-sm: 0 1px 3px rgba(0,0,0,0.12);
$xgc-shadow-md: 0 4px 6px rgba(0,0,0,0.16);
```

**Example Custom Overrides:**
```scss
// Override navbar
.navbar {
  background: linear-gradient(135deg, $xgc-primary, $xgc-secondary);
  box-shadow: $xgc-shadow-md;
}

// Override buttons
.btn-primary {
  background-color: $xgc-primary;
  border-color: $xgc-primary;
  
  &:hover {
    background-color: $xgc-secondary;
    border-color: $xgc-secondary;
  }
}

// Override cards
.card {
  border-radius: $xgc-border-radius;
  box-shadow: $xgc-shadow-sm;
}
```

#### Ignored Apps

| Field | Type | Description |
|-------|------|-------------|
| **Ignored Apps** | Table | Apps to exclude from theme compilation |

Use this to prevent conflicts with other app styles.

#### Read-Only Fields

| Field | Description |
|-------|-------------|
| **Theme** (SCSS) | Auto-generated compiled theme |
| **Theme URL** | URL to compiled CSS file |

---

### Tab 3: Script

#### Custom JavaScript

| Field | Type | Description | Use Case |
|-------|------|-------------|----------|
| **JavaScript** | Code (JS) | Custom JS for theme | Add interactive features |

**Example JavaScript:**
```javascript
// Theme initialization
frappe.ready(function() {
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Add theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', 
                document.body.classList.contains('dark-mode') ? 'dark' : 'light'
            );
        });
    }
    
    // Restore theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
});
```

---

## Creating Color Records

Before creating a Website Theme, create Color records for your color scheme.

### Access Colors
- **URL**: http://localhost:8000/app/color
- **Required Role**: Website Manager or Administrator

### Color Fields

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| **Color** | Data | Yes | Color name | `XGC Green`, `XGC Dark Gray` |
| **Color Code** | Color | Yes | Hex color value | `#2E7D32` |

### XGC Theme Color Palette

#### XGC Light Theme Colors

```
Primary Colors:
- XGC Green Primary: #2E7D32
- XGC Green Secondary: #1B5E20
- XGC Green Accent: #4CAF50
- XGC Green Light: #81C784

Neutral Colors:
- XGC White: #FFFFFF
- XGC Off White: #F5F5F5
- XGC Light Gray: #E0E0E0
- XGC Gray: #9E9E9E
- XGC Dark Gray: #424242
- XGC Almost Black: #212121

Text Colors:
- XGC Text Primary: #212121
- XGC Text Secondary: #757575
- XGC Text Disabled: #BDBDBD

Status Colors:
- XGC Success: #4CAF50
- XGC Warning: #FF9800
- XGC Error: #F44336
- XGC Info: #2196F3
```

#### XGC Dark Theme Colors

```
Primary Colors:
- XGC Green Light: #66BB6A
- XGC Green Bright: #81C784
- XGC Green Accent: #4CAF50

Background Colors:
- XGC True Black: #121212
- XGC Dark: #1E1E1E
- XGC Dark Gray: #2C2C2C
- XGC Medium Gray: #424242

Text Colors:
- XGC Text Light: #E0E0E0
- XGC Text Medium: #B0B0B0
- XGC Text Disabled: #757575
```

---

## Complete XGC Light Theme Configuration

### Step-by-Step Setup

#### 1. Create Color Records

Create these colors first (Website > Color):

```
Name: XGC Green Primary
Color Code: #2E7D32

Name: XGC Text Primary
Color Code: #212121

Name: XGC Off White
Color Code: #F5F5F5

Name: XGC Dark Gray
Color Code: #424242

Name: XGC White
Color Code: #FFFFFF
```

#### 2. Create Website Theme

**Basic Configuration:**
- Theme: `XGC Light`
- Module: `Website`
- Custom?: ✓ (checked)

**Typography:**
- Google Font: `Inter`
- Font Properties: `wght@300;400;500;600;700;800`
- Font Size: `14px`

**Button Styling:**
- Button Rounded Corners: ✓
- Button Shadows: ✓
- Button Gradients: ☐

**Colors:**
- Primary Color: `XGC Green Primary`
- Text Color: `XGC Text Primary`
- Light Color: `XGC Off White`
- Dark Color: `XGC Dark Gray`
- Background Color: `XGC White`

**Custom SCSS:**
```scss
// XGC Brand Variables
$xgc-primary: #2E7D32;
$xgc-secondary: #1B5E20;
$xgc-accent: #4CAF50;
$xgc-success: #4CAF50;
$xgc-warning: #FF9800;
$xgc-error: #F44336;
$xgc-info: #2196F3;

// Typography
$xgc-font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
$xgc-font-size-base: 14px;
$xgc-line-height-base: 1.5;

// Spacing
$xgc-spacing-xs: 4px;
$xgc-spacing-sm: 8px;
$xgc-spacing-md: 16px;
$xgc-spacing-lg: 24px;
$xgc-spacing-xl: 32px;

// Border Radius
$xgc-radius-sm: 4px;
$xgc-radius-md: 8px;
$xgc-radius-lg: 12px;

// Shadows
$xgc-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
$xgc-shadow-md: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
$xgc-shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);

// Transitions
$xgc-transition-fast: 150ms ease-in-out;
$xgc-transition-base: 250ms ease-in-out;
$xgc-transition-slow: 350ms ease-in-out;
```

**Custom Overrides:**
```scss
// Navbar Styling
.navbar {
  background: linear-gradient(135deg, $xgc-primary 0%, $xgc-secondary 100%);
  box-shadow: $xgc-shadow-md;
  border-bottom: none;
  
  .navbar-brand {
    font-weight: 600;
    color: white !important;
  }
  
  .nav-link {
    color: rgba(255, 255, 255, 0.9) !important;
    transition: color $xgc-transition-fast;
    
    &:hover {
      color: white !important;
    }
  }
}

// Button Styling
.btn {
  border-radius: $xgc-radius-sm;
  font-weight: 500;
  transition: all $xgc-transition-base;
  
  &.btn-primary {
    background-color: $xgc-primary;
    border-color: $xgc-primary;
    box-shadow: $xgc-shadow-sm;
    
    &:hover {
      background-color: $xgc-secondary;
      border-color: $xgc-secondary;
      box-shadow: $xgc-shadow-md;
      transform: translateY(-1px);
    }
  }
}

// Card Styling
.card {
  border-radius: $xgc-radius-md;
  box-shadow: $xgc-shadow-sm;
  border: none;
  transition: box-shadow $xgc-transition-base;
  
  &:hover {
    box-shadow: $xgc-shadow-md;
  }
  
  .card-header {
    background-color: $xgc-primary;
    color: white;
    border-radius: $xgc-radius-md $xgc-radius-md 0 0;
    font-weight: 600;
  }
}

// Form Styling
.form-control {
  border-radius: $xgc-radius-sm;
  border-color: #E0E0E0;
  transition: border-color $xgc-transition-fast;
  
  &:focus {
    border-color: $xgc-primary;
    box-shadow: 0 0 0 0.2rem rgba(46, 125, 50, 0.25);
  }
}

// Link Styling
a {
  color: $xgc-primary;
  transition: color $xgc-transition-fast;
  
  &:hover {
    color: $xgc-secondary;
    text-decoration: none;
  }
}

// Page Container
.page-container {
  font-family: $xgc-font-family;
}

// Sidebar
.sidebar {
  background-color: #FAFAFA;
  border-right: 1px solid #E0E0E0;
  
  .sidebar-item {
    transition: background-color $xgc-transition-fast;
    
    &:hover {
      background-color: rgba(46, 125, 50, 0.08);
    }
    
    &.active {
      background-color: rgba(46, 125, 50, 0.12);
      border-left: 3px solid $xgc-primary;
    }
  }
}
```

**JavaScript:**
```javascript
frappe.ready(function() {
    console.log('XGC Light Theme Loaded');
    
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
    
    // Enhanced form validation feedback
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const invalidFields = form.querySelectorAll(':invalid');
            if (invalidFields.length > 0) {
                invalidFields[0].focus();
                invalidFields[0].scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        });
    });
});
```

---

## Complete XGC Dark Theme Configuration

### Color Records for Dark Theme

```
Name: XGC Green Light
Color Code: #66BB6A

Name: XGC Text Light
Color Code: #E0E0E0

Name: XGC Dark Background
Color Code: #2C2C2C

Name: XGC Medium Gray
Color Code: #424242

Name: XGC True Black
Color Code: #121212
```

### Dark Theme Settings

**Basic Configuration:**
- Theme: `XGC Dark`
- Module: `Website`
- Custom?: ✓

**Typography:**
- Google Font: `Inter`
- Font Properties: `wght@300;400;500;600;700;800`
- Font Size: `14px`

**Colors:**
- Primary Color: `XGC Green Light`
- Text Color: `XGC Text Light`
- Light Color: `XGC Medium Gray`
- Dark Color: `XGC True Black`
- Background Color: `XGC Dark Background`

**Custom SCSS for Dark Theme:**
```scss
// Dark Theme Variables
$xgc-dark-bg-primary: #121212;
$xgc-dark-bg-secondary: #1E1E1E;
$xgc-dark-bg-tertiary: #2C2C2C;
$xgc-dark-surface: #424242;

$xgc-dark-text-primary: #E0E0E0;
$xgc-dark-text-secondary: #B0B0B0;
$xgc-dark-text-disabled: #757575;

$xgc-dark-primary: #66BB6A;
$xgc-dark-accent: #81C784;

// Override light theme shadows for dark
$xgc-shadow-dark-sm: 0 1px 3px rgba(0, 0, 0, 0.5);
$xgc-shadow-dark-md: 0 3px 6px rgba(0, 0, 0, 0.6);
$xgc-shadow-dark-lg: 0 10px 20px rgba(0, 0, 0, 0.7);
```

**Custom Overrides for Dark Theme:**
```scss
// Dark theme base
body {
  background-color: $xgc-dark-bg-primary;
  color: $xgc-dark-text-primary;
}

// Navbar for dark theme
.navbar {
  background: linear-gradient(135deg, #1B5E20 0%, #0D3818 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

// Cards in dark theme
.card {
  background-color: $xgc-dark-bg-secondary;
  color: $xgc-dark-text-primary;
  box-shadow: $xgc-shadow-dark-sm;
  
  .card-header {
    background-color: $xgc-dark-surface;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
}

// Forms in dark theme
.form-control {
  background-color: $xgc-dark-bg-tertiary;
  color: $xgc-dark-text-primary;
  border-color: $xgc-dark-surface;
  
  &:focus {
    background-color: $xgc-dark-bg-secondary;
    border-color: $xgc-dark-primary;
  }
  
  &::placeholder {
    color: $xgc-dark-text-disabled;
  }
}

// Buttons in dark theme
.btn-primary {
  background-color: $xgc-dark-primary;
  border-color: $xgc-dark-primary;
  
  &:hover {
    background-color: $xgc-dark-accent;
    border-color: $xgc-dark-accent;
  }
}

// Links in dark theme
a {
  color: $xgc-dark-primary;
  
  &:hover {
    color: $xgc-dark-accent;
  }
}

// Sidebar in dark theme
.sidebar {
  background-color: $xgc-dark-bg-secondary;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}
```

---

## Applying the Theme

### Method 1: Via Website Settings

1. Go to **Setup > Website > Website Settings**
2. Find **Website Theme** field
3. Select `XGC Light` or `XGC Dark`
4. Save
5. Clear cache: `bench --site dev.localhost clear-cache`

### Method 2: Via Bench Command

```bash
# Set theme
docker exec devcontainer-frappe-1 bash -c "
    cd /workspace/development/frappe-bench
    bench --site dev.localhost set-config theme 'XGC Light'
    bench --site dev.localhost clear-cache
    bench --site dev.localhost clear-website-cache
"
```

### Method 3: Programmatically

```python
import frappe

# Set theme
frappe.db.set_value('Website Settings', None, 'website_theme', 'XGC Light')
frappe.db.commit()

# Clear cache
frappe.clear_cache()
```

---

## Testing Your Theme

### Checklist

- [ ] Theme appears in Website Theme list
- [ ] Colors are correctly applied
- [ ] Custom SCSS compiles without errors
- [ ] JavaScript executes properly
- [ ] Responsive design works on mobile
- [ ] All pages render correctly
- [ ] Forms are styled properly
- [ ] Buttons have correct styling
- [ ] Navigation works as expected
- [ ] Dark mode (if applicable) works

### Debug Commands

```bash
# Check theme compilation
docker exec devcontainer-frappe-1 bash -c "
    cd /workspace/development/frappe-bench
    bench --site dev.localhost execute frappe.website.doctype.website_theme.website_theme.generate_theme_files_if_not_exist
"

# View compiled CSS
docker exec devcontainer-frappe-1 bash -c "
    cd /workspace/development/frappe-bench
    find sites -name '*xgc*.css' -type f
"

# Check for SCSS errors
docker exec devcontainer-frappe-1 bash -c "
    cd /workspace/development/frappe-bench
    bench build --app xgc_theme --verbose
"
```

---

## Best Practices

### 1. Color Naming
- Use descriptive names: `XGC Green Primary` not `Color 1`
- Include brand name in color names
- Group related colors

### 2. SCSS Organization
- Define variables first
- Group related styles
- Use comments to separate sections
- Follow BEM or similar naming convention

### 3. Performance
- Minimize custom overrides
- Use CSS variables when possible
- Avoid !important unless necessary
- Optimize selectors

### 4. Maintenance
- Document custom changes
- Version control your themes
- Test on multiple browsers
- Keep backups of working configurations

### 5. Accessibility
- Ensure sufficient color contrast (WCAG AA minimum)
- Test with screen readers
- Provide focus indicators
- Use semantic HTML

---

## Troubleshooting

### Theme Not Applying

```bash
# Rebuild theme
bench build --app xgc_theme

# Clear all caches
bench --site dev.localhost clear-cache
bench --site dev.localhost clear-website-cache

# Restart bench
bench restart
```

### SCSS Compilation Errors

- Check for syntax errors in Custom SCSS
- Ensure all variables are defined
- Verify color names exist in Color DocType
- Check for missing semicolons or braces

### Colors Not Showing

- Verify Color records exist
- Check color hex codes are valid
- Ensure colors are linked correctly in theme
- Clear browser cache

### JavaScript Not Working

- Check browser console for errors
- Verify JavaScript syntax
- Ensure frappe.ready() is used
- Check for conflicts with other scripts

---

## Additional Resources

- **Frappe Documentation**: https://frappeframework.com/docs/user/en/website-theme
- **Bootstrap Documentation**: https://getbootstrap.com/docs/
- **SCSS Guide**: https://sass-lang.com/guide
- **Google Fonts**: https://fonts.google.com/
- **Color Contrast Checker**: https://webaim.org/resources/contrastchecker/

---

**Document Version**: 1.0  
**Last Updated**: February 4, 2026  
**For**: XGC Theme Configuration
