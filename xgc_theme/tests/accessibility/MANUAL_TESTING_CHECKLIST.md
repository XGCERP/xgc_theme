# Manual Accessibility Testing Checklist

Quick reference checklist for manual accessibility verification of the XGC Theme.

**Validates: Requirements 4.4**

## Screen Reader Testing

### VoiceOver (macOS) or NVDA (Windows)

- [ ] **Navigation Menu**
  - [ ] Sidebar items are announced with name and role
  - [ ] Active/selected items are identified
  - [ ] Navigation is logical and sequential

- [ ] **Form Fields**
  - [ ] All fields have associated labels
  - [ ] Required fields are identified
  - [ ] Field types are announced correctly
  - [ ] Help text is announced when present

- [ ] **Buttons and Actions**
  - [ ] All buttons have clear labels
  - [ ] Disabled buttons are identified
  - [ ] Icon-only buttons have aria-labels

- [ ] **Lists and Tables**
  - [ ] Table structure is announced
  - [ ] Headers are associated with data
  - [ ] List items are navigable

- [ ] **Alerts and Notifications**
  - [ ] Alerts are announced automatically
  - [ ] Alert type is identified
  - [ ] Content is clear and understandable

- [ ] **Headings and Structure**
  - [ ] Headings are properly structured (h1-h6)
  - [ ] Heading levels are logical
  - [ ] Page structure is clear

## Keyboard Navigation Testing

### Basic Navigation

- [ ] **Tab Order**
  - [ ] Tab order is logical (top to bottom, left to right)
  - [ ] All interactive elements are reachable
  - [ ] No keyboard traps exist
  - [ ] Shift+Tab works for reverse navigation

- [ ] **Form Navigation**
  - [ ] All form fields are keyboard accessible
  - [ ] Enter key submits forms
  - [ ] Escape key closes dialogs/modals
  - [ ] Form validation errors are keyboard accessible

- [ ] **Dropdown and Select Menus**
  - [ ] Dropdowns open with Space or Enter
  - [ ] Arrow keys navigate options
  - [ ] Enter selects option
  - [ ] Escape closes dropdown

- [ ] **Modal Dialogs**
  - [ ] Focus moves to modal on open
  - [ ] Focus is trapped within modal
  - [ ] Escape closes modal
  - [ ] Focus returns to trigger element

- [ ] **Sidebar Navigation**
  - [ ] Sidebar items are keyboard accessible
  - [ ] Enter activates sidebar items
  - [ ] Focus is managed on page change

- [ ] **List and Grid Navigation**
  - [ ] List items are keyboard accessible
  - [ ] Enter opens list items
  - [ ] Focus is managed correctly

- [ ] **Toolbar and Action Buttons**
  - [ ] All toolbar buttons are keyboard accessible
  - [ ] Enter and Space activate buttons
  - [ ] Actions execute correctly

## Focus Indicator Verification

### Visual Focus Indicators

- [ ] **Buttons**
  - [ ] All buttons have visible focus indicators
  - [ ] Focus indicators have sufficient contrast (3:1 minimum)
  - [ ] Focus indicators use multiple visual cues

- [ ] **Form Controls**
  - [ ] All form controls have visible focus indicators
  - [ ] Focus indicators are distinct from hover states
  - [ ] Focus indicators remain visible during interaction

- [ ] **Links**
  - [ ] All links have visible focus indicators
  - [ ] Focus indicators are distinct from hover states
  - [ ] Navigation links have clear focus indicators

- [ ] **Custom Components**
  - [ ] Interactive components have focus indicators
  - [ ] Focus indicators are consistent with theme

### Focus Indicator Contrast

- [ ] **Contrast Verification**
  - [ ] Focus indicators meet 3:1 contrast ratio minimum
  - [ ] Focus indicators are visible on all backgrounds
  - [ ] Focus indicators work in both light and dark themes

## Browser Testing

Test in multiple browsers to ensure consistency:

- [ ] **Chrome/Chromium**
  - [ ] All keyboard navigation works
  - [ ] Focus indicators are visible
  - [ ] Screen reader compatibility

- [ ] **Firefox**
  - [ ] All keyboard navigation works
  - [ ] Focus indicators are visible
  - [ ] Screen reader compatibility

- [ ] **Safari** (macOS)
  - [ ] All keyboard navigation works
  - [ ] Focus indicators are visible
  - [ ] VoiceOver compatibility

- [ ] **Edge**
  - [ ] All keyboard navigation works
  - [ ] Focus indicators are visible
  - [ ] Screen reader compatibility

## Theme Variant Testing

Test both light and dark theme variants:

- [ ] **Light Theme**
  - [ ] Focus indicators are visible
  - [ ] Contrast ratios meet WCAG AA
  - [ ] All interactive elements are accessible

- [ ] **Dark Theme**
  - [ ] Focus indicators are visible
  - [ ] Contrast ratios meet WCAG AA
  - [ ] All interactive elements are accessible

## Interface Testing

Test both Desk and Website interfaces:

- [ ] **Desk Interface**
  - [ ] Sidebar navigation is accessible
  - [ ] Forms are accessible
  - [ ] Lists are accessible
  - [ ] Toolbar is accessible
  - [ ] Dashboard widgets are accessible

- [ ] **Website Interface**
  - [ ] Navigation menu is accessible
  - [ ] Content is accessible
  - [ ] Forms are accessible
  - [ ] Footer is accessible

## Common Issues to Check

- [ ] **Missing Labels**
  - [ ] No form fields without labels
  - [ ] No icon-only buttons without aria-labels
  - [ ] No images without alt text

- [ ] **Keyboard Traps**
  - [ ] No elements that trap keyboard focus
  - [ ] All modals can be closed with Escape
  - [ ] All dropdowns can be closed with Escape

- [ ] **Focus Management**
  - [ ] Focus moves logically on page changes
  - [ ] Focus returns to trigger after modal close
  - [ ] Focus is visible at all times

- [ ] **Color Contrast**
  - [ ] Text meets 4.5:1 contrast ratio (normal text)
  - [ ] Large text meets 3:1 contrast ratio
  - [ ] UI components meet 3:1 contrast ratio
  - [ ] Focus indicators meet 3:1 contrast ratio

## Testing Notes

**Date:** _______________

**Tester:** _______________

**Screen Reader Used:** _______________

**Browser Used:** _______________

**Theme Variant:** ☐ Light  ☐ Dark

**Issues Found:** _______________

**Overall Assessment:** ☐ Pass  ☐ Fail  ☐ Needs Improvement

**Additional Comments:**

_______________________________________________

_______________________________________________

_______________________________________________

_______________________________________________

## Sign-off

**Tested By:** _______________

**Date:** _______________

**Signature:** _______________
