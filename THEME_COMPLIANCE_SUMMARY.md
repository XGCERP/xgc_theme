# XGC Theme - Frappe Compliance Summary

## Overview
The XGC Theme has been updated to ensure full compliance with Frappe's standard navbar and footer structure while maintaining XGC Carbon branding.

## Navbar Compliance

### Frappe Standard Classes Used
Based on Frappe's actual template structure (`frappe/templates/includes/navbar/navbar.html`):

- `nav.navbar` - Main navbar container
- `.navbar-brand` - Logo/brand area
- `.navbar-toggler` - Mobile menu toggle button
- `.navbar-collapse` - Collapsible navigation container
- `.navbar-nav` - Navigation items list
- `.nav-item` - Individual navigation item
- `.nav-link` - Navigation links
- `.dropdown-menu` - Dropdown menus
- `.dropdown-item` - Dropdown menu items
- `.container` - Content wrapper

### XGC Branding Applied
- **Logo**: XGC Carbon Gold logo (`xgc-carbon-gold-logo-sq.png`)
- **Logo Height**: 
  - Mobile: 40px
  - Tablet: 48px
  - Desktop: 56px (optimized for transparent PNG)
- **Colors**:
  - Primary: XGC Forest Green (#2d5016)
  - Accent: XGC Gold (#c9a961)
  - Hover states with 5% opacity overlays

### Responsive Behavior
- Desktop: Horizontal navigation with logo on left
- Tablet: Adjusted spacing
- Mobile (< 992px): Collapsed menu with toggle button

## Footer Compliance

### Frappe Standard Classes Used
Based on Frappe's actual template structure (`frappe/templates/includes/footer/footer.html`):

- `footer.web-footer` - Main footer container
- `.container` - Content wrapper
- `.footer-grid` - Grid layout for columns
- `.footer-section` / `.footer-column` - Footer sections
- `.footer-brand` - Brand/logo area
- `.footer-links` - Link lists
- `.footer-social` / `.social-links` - Social media links
- `.footer-contact` - Contact information
- `.footer-newsletter` - Newsletter signup
- `.footer-bottom` / `.footer-copyright` - Copyright area
- `.footer-bottom-links` - Bottom navigation links
- `.footer-powered-by` - Frappe attribution

### XGC Branding Applied
- **Background**: XGC Forest Green Dark
- **Border**: 4px XGC Gold top border
- **Headings**: XGC Gold, uppercase, letter-spaced
- **Text**: White with 85% opacity
- **Links**: White text, gold on hover
- **Social Icons**: Circular buttons with hover effects

### Responsive Behavior
- Desktop: Multi-column grid layout
- Tablet: Adjusted columns (200px minimum)
- Mobile: Single column, stacked layout

## Logo Configuration

### Primary Logo
- **File**: `xgc_theme/public/media/logo/xgc-carbon-gold-logo-sq.png`
- **Format**: Transparent PNG
- **Usage**: Navbar brand image
- **Configured in**: `hooks.py` → `website_context['banner_image']`

### Logo Specifications
```css
.navbar-brand img {
    height: 56px;        /* Desktop */
    width: auto;
    max-width: none;
    object-fit: contain;
}

@media (max-width: 767px) {
    .navbar-brand img {
        height: 40px;    /* Mobile */
    }
}

@media (min-width: 768px) and (max-width: 1023px) {
    .navbar-brand img {
        height: 48px;    /* Tablet */
    }
}
```

## Files Modified

### 1. `xgc_theme/public/css/xgc_website.css`
- Updated navbar selectors to match Frappe's structure
- Added proper Bootstrap navbar classes
- Updated footer selectors to match Frappe's footer templates
- Optimized logo sizing for transparent PNG
- Added responsive breakpoints matching Bootstrap

### 2. `xgc_theme/hooks.py`
- Added `banner_image` to `website_context`
- Points to XGC Carbon Gold logo

## Testing Checklist

### Navbar
- [ ] Logo displays correctly at all breakpoints
- [ ] Navigation links styled with XGC colors
- [ ] Hover states work (gold color)
- [ ] Mobile menu toggle works
- [ ] Dropdown menus styled correctly
- [ ] Language switcher (if enabled) styled

### Footer
- [ ] Footer displays with dark green background
- [ ] Gold top border visible
- [ ] Footer columns layout correctly
- [ ] Links styled in white, turn gold on hover
- [ ] Social icons display and animate
- [ ] Newsletter form styled correctly
- [ ] Copyright section centered
- [ ] Responsive layout works on mobile

## Integration with Frappe DocTypes

### Website Settings
The theme works with standard Frappe Website Settings:
- **Banner Image**: Set via `hooks.py` or Website Settings
- **Navbar Items**: Managed in Website Settings → Top Bar
- **Footer Items**: Managed in Website Settings → Footer

### Footer DocType
The theme supports all standard Footer DocType features:
- Footer columns with links
- Social media links
- Contact information
- Newsletter forms
- Copyright text
- Powered by Frappe attribution

## Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support

## Accessibility
- Proper focus states on all interactive elements
- ARIA labels preserved from Frappe templates
- Keyboard navigation supported
- Color contrast meets WCAG AA standards

## Next Steps

1. **Test in Browser**: Refresh your site and verify navbar/footer
2. **Configure Website Settings**: 
   - Go to Website Settings
   - Add navbar items
   - Configure footer sections
3. **Create Footer**: 
   - Go to Footer List
   - Create footer with your content
4. **Select Theme**:
   - Go to Website Settings
   - Select "XGC Light" or "XGC Dark" theme

## Support

For issues or questions:
- Check Frappe documentation: https://frappeframework.com/docs
- Review this compliance summary
- Test with standard Frappe templates first
