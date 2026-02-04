# XGC Theme - Navbar Configuration Guide

## Overview

The XGC Theme navbar is fully integrated with Frappe's Website Settings, allowing you to manage navigation items dynamically through the admin interface without editing code.

## How to Add/Edit Navigation Items

### Step 1: Access Website Settings

1. Log in to your Frappe/ERPNext desk
2. Navigate to: **Website > Settings > Website Settings**
3. Or go directly to: `http://localhost:8000/desk/website-settings/Website%20Settings`

### Step 2: Configure Top Bar Items

1. Scroll to the **Top Bar** section
2. Click the **Navbar** tab
3. In the **Top Bar Items** table, click **Add Row**

### Step 3: Add Navigation Items

For each navigation item, fill in:

- **Label**: The text displayed in the navbar (e.g., "About", "Products", "Contact")
- **URL**: External URL (e.g., "https://example.com")
- **Route**: Internal route (e.g., "/about", "/products") - use this for internal pages
- **Parent Label**: Leave empty for top-level items, or enter a parent label name to create dropdown menus

### Examples

#### Simple Navigation Item
```
Label: About Us
Route: /about
URL: (leave empty)
Parent Label: (leave empty)
```

#### Dropdown Menu
First, create the parent:
```
Label: Products
Route: /products
URL: (leave empty)
Parent Label: (leave empty)
```

Then create child items:
```
Label: Product A
Route: /products/product-a
URL: (leave empty)
Parent Label: Products
```

```
Label: Product B
Route: /products/product-b
URL: (leave empty)
Parent Label: Products
```

#### External Link
```
Label: Privacy Policy
URL: https://xgccorp.com/privacy-policy.html
Route: (leave empty)
Parent Label: (leave empty)
```

## Features

### ✅ Dynamic Configuration
- All navigation items are managed through Website Settings
- No code changes required
- Changes take effect immediately after saving

### ✅ Mobile Responsive with Hamburger Menu
- **Hamburger menu icon** appears on screens < 992px (tablets and mobile)
- Touch-friendly navigation with smooth animations
- Click hamburger to expand/collapse menu
- Menu automatically closes when clicking outside or selecting a link
- Smooth slide-down/slide-up animations

### ✅ Dropdown Support
- Create multi-level navigation using Parent Label
- Hover to open on desktop (≥992px)
- Click to toggle on mobile (<992px)
- Nested dropdowns with proper indentation on mobile

### ✅ User Authentication
- Shows different items for logged-in vs guest users
- Automatic user menu with avatar
- Login/Signup buttons for guests

### ✅ Search Integration
- Built-in search form (controlled by `show_search` setting)
- Accessible from navbar
- Keyboard shortcut: Ctrl+K (or Cmd+K on Mac) to focus search
- Press Escape to clear and close search

### ✅ Scroll Behavior
- Navbar adds shadow when scrolling down
- Smooth transitions and animations
- Sticky positioning (optional)

## Customization Options

### Brand Logo

The navbar uses the logo from Website Settings. To change it:

1. Go to **Website Settings**
2. Scroll to **Brand** section
3. Upload your logo in **Brand HTML** or **Banner Image**

Or use the default XGC logo at:
```
/assets/xgc_theme/media/logo/xgc-carbon-gold-logo-sq.png
```

### Search Bar

To show/hide the search bar:

1. Go to **Website Settings**
2. Find **Show Search** checkbox
3. Check to show, uncheck to hide

### Signup Button

To show/hide the signup button:

1. Go to **Website Settings**
2. Find **Disable Signup** checkbox
3. Check to hide signup, uncheck to show

## Technical Details

### Hamburger Menu Implementation

The mobile hamburger menu is implemented using:

**HTML Structure:**
- Bootstrap's `.navbar-toggler` button with custom SVG hamburger icon
- `.navbar-collapse` container that expands/collapses
- Proper ARIA attributes for accessibility

**JavaScript Behavior:**
- Custom click handler for toggle button
- Auto-close when clicking outside navbar
- Auto-close when selecting a navigation link
- Smooth animations using CSS transitions

**CSS Animations:**
- Slide-down animation when opening (max-height transition)
- Fade-in effect (opacity transition)
- Smooth collapse animation
- Active state styling for toggle button

**Breakpoints:**
- Desktop (≥992px): Full horizontal navbar, hover dropdowns
- Tablet (768px-991px): Hamburger menu, click dropdowns
- Mobile (<768px): Hamburger menu, full-width items

### Template Files

- **Main Navbar**: `xgc_theme/templates/includes/navbar/navbar.html`
- **Navigation Items**: `xgc_theme/templates/includes/navbar/navbar_items.html`

### CSS Styling

- **Website Styles**: `xgc_theme/public/css/xgc_website.css`
- Mobile breakpoints: 767px, 991px, 1023px

### JavaScript Enhancements

- **Main JS**: `xgc_theme/public/js/xgc_theme.js`
- Navbar module: `xgc_theme.navbar`
- Features: Mobile menu, dropdowns, scroll behavior, search shortcuts

### Context Variables

The navbar template uses these Frappe context variables:

- `top_bar_items`: List of navigation items from Website Settings
- `brand_html`: Custom brand HTML
- `show_search`: Boolean to show/hide search
- `disable_signup`: Boolean to hide signup button
- `frappe.session.user`: Current user (Guest or logged-in)
- `show_sidebar`: Boolean to show "Switch to Desk" link

## Troubleshooting

### Navigation items not showing?

1. Check that items are added in **Website Settings > Top Bar Items**
2. Ensure **Label** field is filled
3. Either **URL** or **Route** must be filled
4. Clear cache: `bench clear-cache`
5. Restart: `bench restart`

### Dropdown not working?

1. Verify **Parent Label** exactly matches the parent item's **Label**
2. Check that parent item exists
3. Clear browser cache

### Mobile menu not collapsing?

1. Ensure Bootstrap JavaScript is loaded
2. Check browser console for errors
3. Verify jQuery is loaded before Bootstrap

## Best Practices

1. **Keep it simple**: 5-7 top-level items maximum
2. **Use clear labels**: Short, descriptive text
3. **Organize with dropdowns**: Group related pages
4. **Test on mobile**: Always check mobile responsiveness
5. **Use internal routes**: Prefer `/about` over full URLs for internal pages

## Support

For issues or questions:
- Check Frappe documentation: https://docs.frappe.io
- XGC Theme repository: [Your repo URL]
- Frappe forum: https://discuss.frappe.io
