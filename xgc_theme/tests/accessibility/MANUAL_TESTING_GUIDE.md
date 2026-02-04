# Manual Accessibility Testing Guide

This guide provides instructions for manually testing the accessibility of the XGC Theme for Frappe/ERPNext.

**Validates: Requirements 4.4**

## Overview

Manual accessibility testing is essential to ensure the theme works well with assistive technologies and keyboard navigation. This guide covers:

1. Screen reader testing
2. Keyboard navigation testing
3. Focus indicator verification

## Prerequisites

### Screen Readers

Install at least one of the following screen readers:

- **Windows**: NVDA (free) - https://www.nvaccess.org/download/
- **Windows**: JAWS (commercial) - https://www.freedomscientific.com/products/software/jaws/
- **macOS**: VoiceOver (built-in) - Enable in System Preferences > Accessibility
- **Linux**: Orca (free) - Usually pre-installed or available via package manager

### Test Environment

1. Install Frappe/ERPNext v16
2. Install the xgc_theme app
3. Select the XGC Theme from the theme switcher
4. Have test data available (users, documents, forms, lists)

## 1. Screen Reader Testing

### 1.1 VoiceOver Testing (macOS)

#### Enable VoiceOver
1. Press `Cmd + F5` to toggle VoiceOver on/off
2. Or go to System Preferences > Accessibility > VoiceOver > Enable VoiceOver

#### Basic VoiceOver Commands
- `VO` = `Control + Option` (VoiceOver modifier keys)
- `VO + Right Arrow` = Move to next item
- `VO + Left Arrow` = Move to previous item
- `VO + Space` = Activate item
- `VO + A` = Read all
- `VO + H` = Move to next heading
- `VO + L` = Move to next link

#### Test Scenarios

**Test 1: Navigation Menu**
1. Navigate to the Desk interface
2. Use `VO + Right Arrow` to navigate through sidebar items
3. Verify each item is announced with its name and role
4. Verify active/selected items are announced as "selected"
5. Verify icons are either announced or hidden from screen reader

**Expected Results:**
- ✓ Each sidebar item is announced clearly
- ✓ Active item state is announced
- ✓ Navigation is logical and sequential

**Test 2: Form Fields**
1. Open any form (e.g., User form)
2. Use `Tab` to navigate through form fields
3. Verify each field is announced with its label
4. Verify required fields are announced as "required"
5. Verify field types are announced (text, select, checkbox, etc.)

**Expected Results:**
- ✓ All form fields have associated labels
- ✓ Required fields are identified
- ✓ Field types are announced correctly
- ✓ Help text is announced when present

**Test 3: Buttons and Actions**
1. Navigate to page with action buttons
2. Use `VO + Right Arrow` to navigate to buttons
3. Verify button text is announced
4. Verify button state (enabled/disabled) is announced
5. Verify icon-only buttons have accessible labels

**Expected Results:**
- ✓ All buttons are announced with clear labels
- ✓ Disabled buttons are identified as "dimmed" or "disabled"
- ✓ Icon-only buttons have aria-labels

**Test 4: Lists and Tables**
1. Navigate to a list view (e.g., User list)
2. Use `VO + Right Arrow` to navigate through list items
3. Verify table headers are announced
4. Verify row data is announced in logical order
5. Verify pagination controls are accessible

**Expected Results:**
- ✓ Table structure is announced (rows, columns)
- ✓ Headers are associated with data cells
- ✓ List items are navigable and announced clearly

**Test 5: Alerts and Notifications**
1. Trigger a success message (e.g., save a document)
2. Verify the alert is announced automatically
3. Trigger an error message
4. Verify the error is announced with appropriate urgency

**Expected Results:**
- ✓ Alerts are announced automatically
- ✓ Alert type (success, error, warning) is identified
- ✓ Alert content is clear and understandable

### 1.2 NVDA Testing (Windows)

#### Enable NVDA
1. Download and install NVDA from https://www.nvaccess.org/download/
2. Launch NVDA (it will start reading immediately)
3. Press `Insert + Q` to quit NVDA

#### Basic NVDA Commands
- `Insert` or `Caps Lock` = NVDA modifier key
- `NVDA + Down Arrow` = Read next item
- `NVDA + Up Arrow` = Read previous item
- `NVDA + Space` = Activate item
- `NVDA + Down Arrow (hold)` = Read all
- `H` = Move to next heading
- `K` = Move to next link
- `F` = Move to next form field
- `B` = Move to next button

#### Test Scenarios

Follow the same test scenarios as VoiceOver testing above, using NVDA commands.

**Additional NVDA-Specific Tests:**

**Test 6: Browse Mode Navigation**
1. Open a page in browse mode
2. Use `H` to jump between headings
3. Use `K` to jump between links
4. Use `F` to jump between form fields
5. Use `B` to jump between buttons

**Expected Results:**
- ✓ Headings are properly structured (h1, h2, h3, etc.)
- ✓ Links are identifiable and navigable
- ✓ Form fields are accessible via quick navigation
- ✓ Buttons are accessible via quick navigation

## 2. Keyboard Navigation Testing

### 2.1 Basic Keyboard Navigation

Test keyboard navigation without a screen reader to verify focus indicators and tab order.

#### Test Scenarios

**Test 1: Tab Order**
1. Open the Desk interface
2. Press `Tab` repeatedly to navigate through all interactive elements
3. Verify tab order is logical (top to bottom, left to right)
4. Verify no elements are skipped
5. Verify no keyboard traps (can always tab out)

**Expected Results:**
- ✓ Tab order follows visual layout
- ✓ All interactive elements are reachable
- ✓ No keyboard traps exist
- ✓ Skip links are available (if applicable)

**Test 2: Shift+Tab (Reverse Navigation)**
1. Navigate to the end of a page using `Tab`
2. Press `Shift + Tab` to navigate backwards
3. Verify reverse tab order matches forward tab order

**Expected Results:**
- ✓ Reverse navigation works correctly
- ✓ Focus moves to previous element

**Test 3: Form Navigation**
1. Open a form with multiple fields
2. Use `Tab` to navigate through fields
3. Use `Shift + Tab` to navigate backwards
4. Use `Enter` to submit the form
5. Use `Escape` to cancel/close dialogs

**Expected Results:**
- ✓ All form fields are keyboard accessible
- ✓ Enter key submits forms
- ✓ Escape key closes dialogs/modals
- ✓ Form validation errors are keyboard accessible

**Test 4: Dropdown and Select Menus**
1. Navigate to a select/dropdown field
2. Press `Space` or `Enter` to open the dropdown
3. Use `Arrow Keys` to navigate options
4. Press `Enter` to select an option
5. Press `Escape` to close without selecting

**Expected Results:**
- ✓ Dropdowns open with Space or Enter
- ✓ Arrow keys navigate options
- ✓ Enter selects option
- ✓ Escape closes dropdown

**Test 5: Modal Dialogs**
1. Open a modal dialog
2. Verify focus moves into the modal
3. Use `Tab` to navigate within the modal
4. Verify focus is trapped within the modal
5. Press `Escape` to close the modal
6. Verify focus returns to trigger element

**Expected Results:**
- ✓ Focus moves to modal on open
- ✓ Focus is trapped within modal
- ✓ Escape closes modal
- ✓ Focus returns to trigger element

**Test 6: Sidebar Navigation**
1. Navigate to the sidebar using `Tab`
2. Use `Arrow Keys` to navigate sidebar items
3. Press `Enter` to activate a sidebar item
4. Verify the page changes and focus is managed

**Expected Results:**
- ✓ Sidebar items are keyboard accessible
- ✓ Arrow keys navigate sidebar (if implemented)
- ✓ Enter activates sidebar items
- ✓ Focus is managed on page change

**Test 7: List and Grid Navigation**
1. Navigate to a list view
2. Use `Tab` to navigate to list items
3. Use `Arrow Keys` to navigate between items (if implemented)
4. Press `Enter` to open a list item
5. Verify focus is managed

**Expected Results:**
- ✓ List items are keyboard accessible
- ✓ Navigation is intuitive
- ✓ Enter opens list items
- ✓ Focus is managed correctly

**Test 8: Toolbar and Action Buttons**
1. Navigate to the page toolbar
2. Use `Tab` to navigate through action buttons
3. Press `Enter` or `Space` to activate buttons
4. Verify actions are executed

**Expected Results:**
- ✓ All toolbar buttons are keyboard accessible
- ✓ Enter and Space activate buttons
- ✓ Actions execute correctly

## 3. Focus Indicator Verification

### 3.1 Visual Focus Indicators

Test that focus indicators are visible and meet WCAG requirements.

#### Test Scenarios

**Test 1: Button Focus Indicators**
1. Navigate to buttons using `Tab`
2. Verify each button has a visible focus indicator
3. Verify focus indicator has sufficient contrast (3:1 minimum)
4. Verify focus indicator is not just a color change

**Expected Results:**
- ✓ All buttons have visible focus indicators
- ✓ Focus indicators have sufficient contrast
- ✓ Focus indicators use multiple visual cues (outline, shadow, border)

**Test 2: Form Control Focus Indicators**
1. Navigate to form fields using `Tab`
2. Verify each field has a visible focus indicator
3. Verify focus indicator is distinct from hover state
4. Verify focus indicator persists while typing

**Expected Results:**
- ✓ All form controls have visible focus indicators
- ✓ Focus indicators are distinct from hover states
- ✓ Focus indicators remain visible during interaction

**Test 3: Link Focus Indicators**
1. Navigate to links using `Tab`
2. Verify each link has a visible focus indicator
3. Verify focus indicator is distinct from hover state
4. Verify focus indicator works in navigation menus

**Expected Results:**
- ✓ All links have visible focus indicators
- ✓ Focus indicators are distinct from hover states
- ✓ Navigation links have clear focus indicators

**Test 4: Custom Component Focus Indicators**
1. Navigate to custom components (cards, tiles, etc.)
2. Verify interactive components have focus indicators
3. Verify focus indicators match theme styling

**Expected Results:**
- ✓ Custom interactive components have focus indicators
- ✓ Focus indicators are consistent with theme

### 3.2 Focus Indicator Contrast

Use browser developer tools to verify focus indicator contrast:

1. Open browser DevTools (F12)
2. Navigate to an element with focus
3. Inspect the focus indicator styles
4. Use a contrast checker to verify 3:1 minimum contrast ratio

**Tools:**
- Chrome DevTools: Inspect element > Styles panel
- Contrast Checker: https://webaim.org/resources/contrastchecker/

## 4. Testing Checklist

Use this checklist to track manual testing progress:

### Screen Reader Testing
- [ ] Navigation menu is accessible
- [ ] Form fields have proper labels
- [ ] Buttons are announced correctly
- [ ] Lists and tables are navigable
- [ ] Alerts are announced automatically
- [ ] Headings are properly structured
- [ ] Links are identifiable
- [ ] Images have alt text (if applicable)

### Keyboard Navigation Testing
- [ ] Tab order is logical
- [ ] Reverse tab order works
- [ ] All interactive elements are reachable
- [ ] No keyboard traps exist
- [ ] Forms are fully keyboard accessible
- [ ] Dropdowns work with keyboard
- [ ] Modals trap focus correctly
- [ ] Sidebar is keyboard accessible
- [ ] Lists are keyboard accessible
- [ ] Toolbar buttons are keyboard accessible

### Focus Indicator Testing
- [ ] Buttons have visible focus indicators
- [ ] Form controls have visible focus indicators
- [ ] Links have visible focus indicators
- [ ] Custom components have focus indicators
- [ ] Focus indicators have sufficient contrast (3:1)
- [ ] Focus indicators are distinct from hover states

## 5. Reporting Issues

If you find accessibility issues during manual testing:

1. **Document the issue:**
   - What element/component has the issue?
   - What is the expected behavior?
   - What is the actual behavior?
   - Which screen reader/browser was used?

2. **Severity classification:**
   - **Critical**: Prevents access to core functionality
   - **High**: Significantly impacts usability
   - **Medium**: Causes inconvenience but has workarounds
   - **Low**: Minor issue with minimal impact

3. **Create an issue:**
   - File an issue in the project repository
   - Include steps to reproduce
   - Include screenshots/recordings if possible
   - Tag with "accessibility" label

## 6. Resources

### WCAG Guidelines
- WCAG 2.1 AA: https://www.w3.org/WAI/WCAG21/quickref/
- Understanding WCAG: https://www.w3.org/WAI/WCAG21/Understanding/

### Screen Reader Resources
- NVDA User Guide: https://www.nvaccess.org/files/nvda/documentation/userGuide.html
- VoiceOver User Guide: https://support.apple.com/guide/voiceover/welcome/mac
- JAWS Documentation: https://www.freedomscientific.com/training/jaws/

### Testing Tools
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- WAVE Browser Extension: https://wave.webaim.org/extension/
- axe DevTools: https://www.deque.com/axe/devtools/

## 7. Conclusion

Manual accessibility testing is an ongoing process. Regular testing with real users who rely on assistive technologies provides the most valuable feedback. This guide provides a foundation for manual testing, but should be supplemented with user testing and feedback.

**Remember:** Automated tests catch many issues, but manual testing is essential for ensuring a truly accessible experience.
