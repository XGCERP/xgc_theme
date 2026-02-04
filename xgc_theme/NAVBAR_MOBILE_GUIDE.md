# XGC Theme - Mobile Hamburger Menu Guide

## Overview

The XGC Theme navbar features a fully responsive hamburger menu that provides an excellent mobile experience while maintaining the OneUI design aesthetic.

## How It Works

### Desktop View (≥992px)
```
┌─────────────────────────────────────────────────────────┐
│ [Logo]  About  Products  Services  Contact  [Search] 🔍 │
└─────────────────────────────────────────────────────────┘
```
- Full horizontal navigation
- Hover to open dropdowns
- All items visible

### Mobile View (<992px)
```
┌──────────────────────────┐
│ [Logo]              [☰]  │  ← Hamburger icon
└──────────────────────────┘

When hamburger is clicked:

┌──────────────────────────┐
│ [Logo]              [☰]  │  ← Active state
├──────────────────────────┤
│ 🔍 Search...             │  ← Search bar
│ About                    │
│ Products            ▼    │  ← Dropdown indicator
│   - Product A            │  ← Nested items
│   - Product B            │
│ Services                 │
│ Contact                  │
│ [Login]                  │
└──────────────────────────┘
```

## User Interactions

### Opening the Menu
1. **Tap** the hamburger icon (☰)
2. Menu **slides down** with smooth animation
3. Hamburger icon shows **active state** (highlighted)

### Closing the Menu
The menu closes automatically when:
- **Tapping** the hamburger icon again
- **Tapping** anywhere outside the menu
- **Selecting** a navigation link
- **Pressing** the Escape key (if search is focused)

### Dropdown Menus on Mobile
1. **Tap** a menu item with dropdown indicator (▼)
2. Submenu **expands** below the parent item
3. **Tap** again to collapse
4. Other dropdowns automatically close

### Search on Mobile
1. Search bar appears at top of mobile menu
2. **Tap** to focus and type
3. **Keyboard shortcut**: Ctrl+K or Cmd+K to focus
4. **Press Escape** to clear and close

## Animation Details

### Opening Animation
- **Duration**: 300ms
- **Effect**: Slide down + fade in
- **Easing**: ease-out
- Properties animated:
  - `max-height`: 0 → 1000px
  - `opacity`: 0 → 1
  - `padding`: 0 → 16px

### Closing Animation
- **Duration**: 300ms
- **Effect**: Slide up + fade out
- **Easing**: ease-in
- Properties animated:
  - `max-height`: 1000px → 0
  - `opacity`: 1 → 0
  - `padding`: 16px → 0

## Accessibility Features

### Keyboard Navigation
- **Tab**: Navigate through menu items
- **Enter/Space**: Activate links and toggle dropdowns
- **Escape**: Close search or menu
- **Ctrl+K / Cmd+K**: Focus search

### Screen Reader Support
- Proper ARIA labels on hamburger button
- `aria-expanded` state changes (true/false)
- `aria-controls` links button to menu
- `aria-label` for toggle button: "Toggle navigation"

### Touch Targets
- Minimum touch target size: **44x44px**
- Adequate spacing between items
- Full-width clickable areas on mobile

## Responsive Breakpoints

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Mobile | < 768px | Hamburger menu, full-width items, stacked layout |
| Tablet | 768px - 991px | Hamburger menu, optimized spacing |
| Desktop | ≥ 992px | Full horizontal navbar, hover dropdowns |

## Styling Details

### Hamburger Icon
- **Size**: 24x24px
- **Color**: Forest Green (#2D5016)
- **Style**: Three horizontal lines (SVG)
- **Hover**: Light green background
- **Active**: Darker green background

### Mobile Menu Container
- **Background**: White (#FFFFFF)
- **Border**: 1px solid border color
- **Border-radius**: 8px
- **Shadow**: Subtle drop shadow
- **Padding**: 16px

### Menu Items
- **Height**: Auto (min 44px for touch)
- **Padding**: 12px 16px
- **Font-size**: 16px (base)
- **Color**: Forest Green
- **Hover**: Light green background
- **Active**: Gold accent

## JavaScript API

### Manual Control

```javascript
// Open mobile menu
$('.navbar-collapse').addClass('show');
$('.navbar-toggler').attr('aria-expanded', 'true');

// Close mobile menu
$('.navbar-collapse').removeClass('show');
$('.navbar-toggler').attr('aria-expanded', 'false');

// Toggle mobile menu
$('.navbar-toggler').click();
```

### Events

```javascript
// Listen for menu open
$('.navbar-collapse').on('show.bs.collapse', function() {
    console.log('Menu opening');
});

// Listen for menu close
$('.navbar-collapse').on('hide.bs.collapse', function() {
    console.log('Menu closing');
});
```

## Best Practices

### Content Organization
1. **Limit items**: 5-7 top-level items maximum
2. **Group related items**: Use dropdowns for related pages
3. **Prioritize**: Most important items first
4. **Clear labels**: Short, descriptive text

### Performance
1. **Smooth animations**: Use CSS transitions, not JavaScript
2. **Debounce events**: Resize and scroll handlers
3. **Lazy load**: Heavy content in dropdowns
4. **Optimize images**: Logo should be optimized for mobile

### Testing Checklist
- [ ] Hamburger icon visible on mobile
- [ ] Menu opens/closes smoothly
- [ ] All links are clickable
- [ ] Dropdowns work correctly
- [ ] Search is accessible
- [ ] Keyboard navigation works
- [ ] Screen reader announces states
- [ ] Touch targets are adequate
- [ ] No horizontal scrolling
- [ ] Works on iOS Safari
- [ ] Works on Android Chrome

## Troubleshooting

### Hamburger icon not showing
**Solution**: Check that viewport width is < 992px and CSS is loaded

### Menu not opening
**Solution**: 
1. Check JavaScript console for errors
2. Verify jQuery and Bootstrap JS are loaded
3. Clear browser cache

### Menu stays open
**Solution**: 
1. Check for JavaScript errors
2. Verify click-outside handler is working
3. Manually close: `$('.navbar-collapse').removeClass('show')`

### Animations not smooth
**Solution**:
1. Check CSS transitions are applied
2. Verify no conflicting styles
3. Test on different devices

### Dropdowns not working
**Solution**:
1. Verify Parent Label matches exactly
2. Check dropdown toggle has correct data attributes
3. Test click handler in console

## Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| iOS Safari | 14+ | ✅ Full |
| Android Chrome | 90+ | ✅ Full |

## Related Documentation

- [Navbar Configuration Guide](./NAVBAR_CONFIGURATION.md)
- [OneUI Documentation](./OneUI/README.md)
- [Bootstrap Navbar Docs](https://getbootstrap.com/docs/5.0/components/navbar/)
- [Frappe Website Settings](https://docs.frappe.io/framework/user/en/guides/portal-development/website-settings)
