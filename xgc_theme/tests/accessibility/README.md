# Accessibility Testing

This directory contains automated and manual accessibility tests for the XGC Theme.

**Validates: Requirements 4.4**

## Overview

Accessibility testing ensures that the XGC Theme meets WCAG 2.1 AA standards and is usable by people with disabilities, including those who use assistive technologies like screen readers.

## Test Structure

```
accessibility/
├── README.md                           # This file
├── MANUAL_TESTING_GUIDE.md            # Comprehensive manual testing guide
├── MANUAL_TESTING_CHECKLIST.md        # Quick reference checklist
├── test_contrast_ratios.test.js       # Automated contrast ratio tests
├── test_keyboard_navigation.test.js   # Automated keyboard navigation tests
└── test_aria_attributes.test.js       # Automated ARIA attribute tests
```

## Automated Tests

### Running Automated Tests

```bash
# Run all accessibility tests
npm test -- tests/accessibility

# Run specific test file
npm test -- tests/accessibility/test_contrast_ratios.test.js

# Run with verbose output
npm test -- tests/accessibility --verbose
```

### Test Coverage

**test_contrast_ratios.test.js**
- Verifies brand colors meet WCAG AA contrast requirements
- Tests text color contrast on various backgrounds
- Validates alert and feedback component contrast
- Checks border visibility
- Tests surface color contrast

**test_keyboard_navigation.test.js**
- Verifies focus indicators are defined in CSS
- Tests button focus styles
- Tests form control focus styles
- Tests link focus styles
- Validates focus indicator visibility
- Checks that outline removal has alternatives

**test_aria_attributes.test.js**
- Verifies proper styling for accessible components
- Tests alert component visibility
- Tests modal component styling
- Validates form validation state styling
- Checks disabled state styling
- Tests navigation element styling

## Manual Testing

Manual testing is essential for comprehensive accessibility verification. Automated tests can only catch a subset of accessibility issues.

### Quick Start

1. Review the [Manual Testing Guide](./MANUAL_TESTING_GUIDE.md)
2. Use the [Manual Testing Checklist](./MANUAL_TESTING_CHECKLIST.md)
3. Test with at least one screen reader (NVDA, JAWS, or VoiceOver)
4. Test keyboard navigation without a mouse
5. Verify focus indicators are visible

### Screen Readers

- **Windows**: NVDA (free) or JAWS (commercial)
- **macOS**: VoiceOver (built-in)
- **Linux**: Orca (usually pre-installed)

### Key Areas to Test

1. **Screen Reader Compatibility**
   - Navigation menu accessibility
   - Form field labels and descriptions
   - Button and action announcements
   - List and table navigation
   - Alert and notification announcements

2. **Keyboard Navigation**
   - Tab order and focus management
   - Form navigation and submission
   - Dropdown and select menu operation
   - Modal dialog focus trapping
   - Sidebar and list navigation

3. **Focus Indicators**
   - Visibility on all interactive elements
   - Sufficient contrast (3:1 minimum)
   - Distinction from hover states
   - Consistency across components

## WCAG 2.1 AA Requirements

The XGC Theme aims to meet WCAG 2.1 Level AA standards:

### Perceivable
- **1.4.3 Contrast (Minimum)**: Text has 4.5:1 contrast ratio (3:1 for large text)
- **1.4.11 Non-text Contrast**: UI components have 3:1 contrast ratio

### Operable
- **2.1.1 Keyboard**: All functionality available via keyboard
- **2.1.2 No Keyboard Trap**: Keyboard focus can move away from any component
- **2.4.7 Focus Visible**: Keyboard focus indicator is visible

### Understandable
- **3.2.1 On Focus**: Components don't change context on focus
- **3.2.2 On Input**: Components don't change context on input
- **3.3.2 Labels or Instructions**: Form fields have labels or instructions

### Robust
- **4.1.2 Name, Role, Value**: UI components have accessible names and roles
- **4.1.3 Status Messages**: Status messages can be determined programmatically

## Testing Tools

### Automated Testing Tools
- **jest-axe**: Accessibility testing library for Jest
- **axe-core**: Accessibility testing engine
- **Playwright**: Browser automation for accessibility testing

### Manual Testing Tools
- **NVDA**: Free screen reader for Windows
- **VoiceOver**: Built-in screen reader for macOS
- **WAVE**: Browser extension for accessibility evaluation
- **axe DevTools**: Browser extension for accessibility testing
- **Contrast Checker**: Tool for verifying color contrast ratios

## Continuous Testing

Accessibility testing should be performed:

1. **During Development**: Run automated tests frequently
2. **Before Commits**: Ensure all tests pass
3. **During Code Review**: Review accessibility implications
4. **Before Releases**: Perform comprehensive manual testing
5. **After Updates**: Re-test affected components

## Common Issues and Solutions

### Issue: Low Contrast
**Solution**: Adjust color values in `xgc_variables.css` to meet WCAG requirements

### Issue: Missing Focus Indicators
**Solution**: Add `:focus` styles to interactive elements in CSS files

### Issue: Missing Labels
**Solution**: Add `aria-label` or associate `<label>` elements with form controls

### Issue: Keyboard Trap
**Solution**: Ensure all modals and dropdowns can be closed with Escape key

### Issue: Inaccessible Custom Components
**Solution**: Add appropriate ARIA attributes and keyboard event handlers

## Resources

### WCAG Guidelines
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [Understanding WCAG 2.1](https://www.w3.org/WAI/WCAG21/Understanding/)

### Testing Guides
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)
- [Keyboard Accessibility](https://webaim.org/techniques/keyboard/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

### Tools
- [NVDA Download](https://www.nvaccess.org/download/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [axe DevTools](https://www.deque.com/axe/devtools/)

## Contributing

When contributing to the XGC Theme:

1. Run automated accessibility tests before committing
2. Add accessibility tests for new components
3. Follow WCAG 2.1 AA guidelines
4. Document any accessibility considerations
5. Test with keyboard and screen reader when possible

## Support

For accessibility-related questions or issues:

1. Check the [Manual Testing Guide](./MANUAL_TESTING_GUIDE.md)
2. Review WCAG 2.1 guidelines
3. File an issue with "accessibility" label
4. Include steps to reproduce and expected behavior

## License

This testing documentation is part of the XGC Theme project and follows the same license.
