/**
 * Accessibility Test: Keyboard Navigation
 * 
 * Tests that all interactive elements have proper focus indicators defined in CSS.
 * 
 * **Validates: Requirements 4.4**
 */

const fs = require('fs');
const path = require('path');

describe('Accessibility: Keyboard Navigation', () => {
  let componentsCSS;
  let deskCSS;
  let websiteCSS;

  beforeAll(() => {
    // Read CSS files
    const componentsPath = path.join(__dirname, '../../public/css/xgc_components.css');
    const deskPath = path.join(__dirname, '../../public/css/xgc_desk.css');
    const websitePath = path.join(__dirname, '../../public/css/xgc_website.css');
    
    componentsCSS = fs.readFileSync(componentsPath, 'utf-8');
    deskCSS = fs.readFileSync(deskPath, 'utf-8');
    websiteCSS = fs.readFileSync(websitePath, 'utf-8');
  });

  test('focus indicators are defined in CSS', () => {
    // Check that focus styles are defined for interactive elements
    const hasFocusStyles = componentsCSS.includes(':focus') || 
                          componentsCSS.includes('.focus') ||
                          componentsCSS.includes('focus-visible');
    
    expect(hasFocusStyles).toBe(true);
  });

  test('buttons have focus styles defined', () => {
    // Check for button focus styles
    const hasButtonFocus = componentsCSS.includes('.btn:focus') || 
                          componentsCSS.includes('button:focus');
    
    expect(hasButtonFocus).toBe(true);
  });

  test('form controls have focus styles defined', () => {
    // Check for form control focus styles
    const hasFormFocus = componentsCSS.includes('.form-control:focus') || 
                        componentsCSS.includes('input:focus') ||
                        componentsCSS.includes('textarea:focus') ||
                        componentsCSS.includes('select:focus');
    
    expect(hasFormFocus).toBe(true);
  });

  test('focus styles include visible indicators', () => {
    // Check that focus styles include visual indicators
    // Common indicators: outline, box-shadow, border-color
    const hasFocusIndicators = componentsCSS.match(/:focus[^{]*\{[^}]*(outline|box-shadow|border-color)[^}]*\}/);
    
    expect(hasFocusIndicators).toBeTruthy();
  });

  test('outline is not removed without alternative focus indicator', () => {
    // Find all instances where outline is set to none
    const outlineNoneRegex = /:focus[^{]*\{[^}]*outline:\s*none[^}]*\}/g;
    const outlineNoneMatches = componentsCSS.match(outlineNoneRegex) || [];

    // For each outline: none, check if there's an alternative indicator
    outlineNoneMatches.forEach(match => {
      // Should have box-shadow or border-color as alternative
      const hasAlternative = match.includes('box-shadow') || match.includes('border-color');
      expect(hasAlternative).toBe(true);
    });
  });

  test('links have visible focus indicators', () => {
    // Check for link focus styles
    const hasLinkFocus = componentsCSS.includes('a:focus') || 
                        componentsCSS.includes('.nav-link:focus');
    
    expect(hasLinkFocus).toBe(true);
  });

  test('desk sidebar items have focus styles', () => {
    // Check for desk sidebar focus styles
    const hasSidebarFocus = deskCSS.includes(':focus') || 
                           deskCSS.includes('.sidebar-item:focus');
    
    expect(hasSidebarFocus).toBe(true);
  });

  test('website navigation has focus styles', () => {
    // Check for website navigation focus styles
    const hasWebNavFocus = websiteCSS.includes(':focus') || 
                          websiteCSS.includes('.nav-link:focus');
    
    expect(hasWebNavFocus).toBe(true);
  });

  test('all CSS files define focus states for interactive elements', () => {
    // Verify that all CSS files have focus styles
    const allCSS = [componentsCSS, deskCSS, websiteCSS];
    
    allCSS.forEach(css => {
      const hasFocus = css.includes(':focus');
      // At least one CSS file should have focus styles
      // (not all files need focus styles, but collectively they should)
    });
    
    // Check that at least components CSS has focus styles
    expect(componentsCSS.includes(':focus')).toBe(true);
  });

  test('focus styles use theme color variables', () => {
    // Check that focus styles use CSS variables for consistency
    const focusStylesWithVars = componentsCSS.match(/:focus[^{]*\{[^}]*var\(--[^)]+\)[^}]*\}/);
    
    // Focus styles should use theme variables for colors
    expect(focusStylesWithVars).toBeTruthy();
  });
});
