/**
 * Property-Based Test: Website Component Styling
 * 
 * Feature: oneui-frappe-theme-integration
 * Property 17: Website Component Styling
 * 
 * Tests that Website-specific components have theme styling applied:
 * - Brand colors used for primary elements
 * - OneUI border-radius values
 * - Proper spacing variables
 * 
 * **Validates: Requirements 7.1, 7.2, 7.3**
 */

const fc = require('fast-check');
const fs = require('fs');
const path = require('path');

describe('Property 17: Website Component Styling', () => {
  let cssContent;
  let cssVariables;

  beforeAll(() => {
    // Read CSS files
    const variablesPath = path.join(__dirname, '../../public/css/xgc_variables.css');
    const websitePath = path.join(__dirname, '../../public/css/xgc_website.css');
    
    const variablesContent = fs.readFileSync(variablesPath, 'utf-8');
    cssContent = fs.readFileSync(websitePath, 'utf-8');
    
    // Extract CSS variables
    cssVariables = new Map();
    const variableDefRegex = /(--[\w-]+)\s*:\s*([^;]+);/g;
    let match;
    while ((match = variableDefRegex.exec(variablesContent)) !== null) {
      const [, varName, varValue] = match;
      cssVariables.set(varName.trim(), varValue.trim());
    }
  });

  /**
   * Helper function to check if a color matches brand colors
   */
  function isBrandColor(color) {
    const brandColorValues = [
      '#2d5016', // forest green
      '#3d6b1f', // forest green light
      '#4d7c2a', // forest green lighter
      '#1d3a0f', // forest green dark
      '#0d2005', // forest green darker
      '#d4af37', // gold
      '#e6c966', // gold light
      '#f0d68a', // gold lighter
      '#b8941f', // gold dark
      '#9c7a10'  // gold darker
    ];
    
    // Normalize color to hex
    const normalizedColor = color.toLowerCase().replace(/\s/g, '');
    
    return brandColorValues.some(brandColor => 
      normalizedColor.includes(brandColor.toLowerCase())
    );
  }

  /**
   * Helper function to parse border-radius value
   */
  function parseBorderRadius(value) {
    if (!value) return 0;
    const match = value.match(/(\d+(?:\.\d+)?)(px|rem|em)/);
    if (!match) return 0;
    
    const num = parseFloat(match[1]);
    const unit = match[2];
    
    // Convert to pixels (assuming 16px = 1rem)
    if (unit === 'rem' || unit === 'em') {
      return num * 16;
    }
    return num;
  }

  /**
   * Helper function to check if border-radius is in OneUI range
   */
  function isOneUIBorderRadius(value) {
    const px = parseBorderRadius(value);
    // OneUI border-radius range: 4px (0.25rem) to 16px (1rem)
    return px >= 4 && px <= 16;
  }

  /**
   * Helper function to extract spacing value
   */
  function parseSpacing(value) {
    if (!value) return 0;
    const match = value.match(/(\d+(?:\.\d+)?)(px|rem|em)/);
    if (!match) return 0;
    
    const num = parseFloat(match[1]);
    const unit = match[2];
    
    if (unit === 'rem' || unit === 'em') {
      return num * 16;
    }
    return num;
  }

  /**
   * Helper function to check if spacing uses theme variables
   */
  function usesThemeSpacing(value) {
    if (!value) return false;
    
    // Check if value is a CSS variable reference
    if (value.includes('var(--spacing-')) {
      return true;
    }
    
    // Check if value matches theme spacing scale (4px, 8px, 16px, 24px, 32px, 40px, 48px)
    const px = parseSpacing(value);
    const themeSpacingValues = [4, 8, 16, 24, 32, 40, 48];
    
    return themeSpacingValues.some(spacing => Math.abs(px - spacing) < 1);
  }

  test('navigation links use brand colors', () => {
    // Property: For any navigation link in Website interface,
    // the color should use brand colors (forest green or gold)
    
    fc.assert(
      fc.property(
        fc.constant('.web-header .nav-link'),
        (selector) => {
          // Check if CSS rule exists for .nav-link
          const hasNavLinkRule = cssContent.includes(selector);
          
          if (!hasNavLinkRule) {
            return false;
          }
          
          // Check if forest green is used in nav-link styling
          const navLinkSection = cssContent.match(/\.web-header \.nav-link\s*\{[^}]+\}/s);
          if (!navLinkSection) {
            return false;
          }
          
          const sectionText = navLinkSection[0];
          const usesBrandColor = sectionText.includes('--xgc-forest-green') || 
                                 sectionText.includes('--xgc-gold') ||
                                 sectionText.includes('var(--xgc-');
          
          return usesBrandColor;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('content headings use brand colors', () => {
    // Property: For any heading (h1, h2, h3) in Website content,
    // the color should use forest green brand color
    
    const headingTags = ['h1', 'h2', 'h3'];
    
    fc.assert(
      fc.property(
        fc.constantFrom(...headingTags),
        (tagName) => {
          // Check if CSS rule exists for this heading
          const headingRule = `.web-content ${tagName}`;
          const hasHeadingRule = cssContent.includes(headingRule);
          
          if (!hasHeadingRule) {
            return false;
          }
          
          // Check if forest green is used
          const headingSection = cssContent.match(new RegExp(`\\.web-content ${tagName}[^}]+\\}`, 's'));
          if (!headingSection) {
            return false;
          }
          
          const sectionText = headingSection[0];
          const usesBrandColor = sectionText.includes('--xgc-forest-green') ||
                                 sectionText.includes('var(--xgc-forest-green');
          
          return usesBrandColor;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('form controls have OneUI border-radius values', () => {
    // Property: For any form control in Website forms,
    // the border-radius should be in OneUI range (4px to 16px)
    
    const formControlSelectors = [
      '.web-form .form-control',
      '.web-form input[type="text"]'
    ];
    
    fc.assert(
      fc.property(
        fc.constantFrom(...formControlSelectors),
        (selector) => {
          // Check if CSS rule exists for form controls
          const hasFormControlRule = cssContent.includes(selector);
          
          if (!hasFormControlRule) {
            return false;
          }
          
          // Check if border-radius is defined
          const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const formControlSection = cssContent.match(new RegExp(`${escapedSelector}[^}]+\\}`, 's'));
          
          if (!formControlSection) {
            return false;
          }
          
          const sectionText = formControlSection[0];
          const borderRadiusMatch = sectionText.match(/border-radius:\s*([^;]+);/);
          
          if (!borderRadiusMatch) {
            return false;
          }
          
          const borderRadiusValue = borderRadiusMatch[1];
          
          // Check if it uses CSS variable or is in OneUI range
          const usesVariable = borderRadiusValue.includes('var(--border-radius');
          const isInRange = isOneUIBorderRadius(borderRadiusValue);
          
          return usesVariable || isInRange;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('call-to-action buttons use forest green background', () => {
    // Property: For any primary button (call-to-action) in Website forms,
    // the background color should use forest green brand color
    
    const primaryButtonSelectors = [
      '.web-form .btn-primary',
      '.web-form button[type="submit"]'
    ];
    
    fc.assert(
      fc.property(
        fc.constantFrom(...primaryButtonSelectors),
        (selector) => {
          // Check if CSS rule exists for primary buttons
          const hasPrimaryButtonRule = cssContent.includes(selector);
          
          if (!hasPrimaryButtonRule) {
            return false;
          }
          
          // Check if forest green is used for background
          const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const buttonSection = cssContent.match(new RegExp(`${escapedSelector}[^}]+\\}`, 's'));
          
          if (!buttonSection) {
            return false;
          }
          
          const sectionText = buttonSection[0];
          const usesBrandColor = sectionText.includes('background-color: var(--xgc-forest-green)') ||
                                sectionText.includes('background-color:var(--xgc-forest-green)');
          
          return usesBrandColor;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('website components use proper spacing variables', () => {
    // Property: For any Website component with padding or margin,
    // the spacing should use theme spacing variables or values
    
    const components = [
      { selector: '.web-header', property: 'padding' },
      { selector: '.web-content', property: 'padding' },
      { selector: '.web-form', property: 'padding' },
      { selector: '.web-form .form-group', property: 'margin-bottom' }
    ];
    
    fc.assert(
      fc.property(
        fc.constantFrom(...components),
        ({ selector, property }) => {
          // Check if CSS rule exists
          const hasRule = cssContent.includes(selector);
          
          if (!hasRule) {
            return false;
          }
          
          // Extract the CSS rule
          const ruleMatch = cssContent.match(new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{[^}]+\\}`, 's'));
          
          if (!ruleMatch) {
            return false;
          }
          
          const ruleText = ruleMatch[0];
          
          // Check if spacing property is defined
          const spacingMatch = ruleText.match(new RegExp(`${property}:\\s*([^;]+);`));
          
          if (!spacingMatch) {
            return true; // No spacing defined is okay
          }
          
          const spacingValue = spacingMatch[1];
          
          // Check if it uses CSS variable or theme spacing values
          const usesVariable = spacingValue.includes('var(--spacing-');
          const usesThemeValue = usesThemeSpacing(spacingValue);
          
          return usesVariable || usesThemeValue;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('website links have hover state with gold color', () => {
    // Property: For any link in Website content,
    // the hover state should use gold brand color
    
    fc.assert(
      fc.property(
        fc.constant('.web-content a'),
        (selector) => {
          // Check if hover rule exists
          const hasHoverRule = cssContent.includes('.web-content a:hover');
          
          if (!hasHoverRule) {
            return false;
          }
          
          // Check if gold color is used in hover state
          const hoverSection = cssContent.match(/\.web-content a:hover\s*\{[^}]+\}/s);
          
          if (!hoverSection) {
            return false;
          }
          
          const sectionText = hoverSection[0];
          const usesGold = sectionText.includes('--xgc-gold') ||
                          sectionText.includes('var(--xgc-gold');
          
          return usesGold;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('website header has proper elevation (shadow)', () => {
    // Property: Website header should have box-shadow for elevation
    
    fc.assert(
      fc.property(
        fc.constant('.web-header'),
        (selector) => {
          // Check if CSS rule exists
          const hasRule = cssContent.includes(selector);
          
          if (!hasRule) {
            return false;
          }
          
          // Check if box-shadow is defined
          const headerSection = cssContent.match(/\.web-header\s*\{[^}]+\}/s);
          
          if (!headerSection) {
            return false;
          }
          
          const sectionText = headerSection[0];
          const hasShadow = sectionText.includes('box-shadow:') &&
                           (sectionText.includes('var(--shadow-') || sectionText.includes('0 '));
          
          return hasShadow;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('form buttons have consistent border-radius', () => {
    // Property: All buttons in Website forms should have consistent border-radius
    
    const buttonSelectors = [
      '.web-form .btn-primary',
      '.web-form button[type="submit"]',
      '.web-form .btn-secondary'
    ];
    
    fc.assert(
      fc.property(
        fc.constantFrom(...buttonSelectors),
        (selector) => {
          // Check if CSS rule exists
          const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const ruleMatch = cssContent.match(new RegExp(`${escapedSelector}[^}]+\\}`, 's'));
          
          if (!ruleMatch) {
            return true; // If rule doesn't exist, skip
          }
          
          const ruleText = ruleMatch[0];
          const borderRadiusMatch = ruleText.match(/border-radius:\s*([^;]+);/);
          
          if (!borderRadiusMatch) {
            return true; // No border-radius defined
          }
          
          const borderRadiusValue = borderRadiusMatch[1];
          
          // Check if it uses CSS variable or is in OneUI range
          const usesVariable = borderRadiusValue.includes('var(--border-radius');
          const isInRange = isOneUIBorderRadius(borderRadiusValue);
          
          return usesVariable || isInRange;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('website components have transition properties for smooth interactions', () => {
    // Property: Interactive Website components should have transition properties
    
    const interactiveComponents = [
      '.web-header .nav-link',
      '.web-content a',
      '.web-form .form-control',
      '.web-form .btn-primary'
    ];
    
    fc.assert(
      fc.property(
        fc.constantFrom(...interactiveComponents),
        (selector) => {
          // Check if CSS rule exists
          const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const ruleMatch = cssContent.match(new RegExp(`${escapedSelector}[^}]+\\}`, 's'));
          
          if (!ruleMatch) {
            return false;
          }
          
          const ruleText = ruleMatch[0];
          const hasTransition = ruleText.includes('transition:') ||
                               ruleText.includes('transition-');
          
          return hasTransition;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('website form has proper visual hierarchy with borders and shadows', () => {
    // Property: Website form container should have border and shadow for visual hierarchy
    
    fc.assert(
      fc.property(
        fc.constant('.web-form'),
        (selector) => {
          // Check if CSS rule exists
          const hasRule = cssContent.includes(selector);
          
          if (!hasRule) {
            return false;
          }
          
          // Check if border and box-shadow are defined
          const formSection = cssContent.match(/\.web-form\s*\{[^}]+\}/s);
          
          if (!formSection) {
            return false;
          }
          
          const sectionText = formSection[0];
          const hasBorder = sectionText.includes('border:');
          const hasShadow = sectionText.includes('box-shadow:');
          
          return hasBorder && hasShadow;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('all website component selectors are properly scoped', () => {
    // Property: All Website-specific styles should be scoped to .web-* classes
    
    const websiteSelectors = [
      '.web-header',
      '.web-content',
      '.web-form'
    ];
    
    fc.assert(
      fc.property(
        fc.constantFrom(...websiteSelectors),
        (selector) => {
          // Check if selector exists in CSS
          const hasSelector = cssContent.includes(selector);
          
          return hasSelector;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('website components use semantic HTML with proper styling', () => {
    // Property: Website components should style semantic HTML elements appropriately
    
    const semanticElements = [
      { parent: '.web-header', element: 'nav' },
      { parent: '.web-content', element: 'h1' },
      { parent: '.web-content', element: 'h2' },
      { parent: '.web-content', element: 'h3' },
      { parent: '.web-content', element: 'p' },
      { parent: '.web-content', element: 'a' }
    ];
    
    fc.assert(
      fc.property(
        fc.constantFrom(...semanticElements),
        ({ parent, element }) => {
          // Check if CSS rule exists for semantic element within parent
          const selector = `${parent} ${element}`;
          const hasRule = cssContent.includes(selector) || 
                         cssContent.includes(`${parent} .${element}`) ||
                         cssContent.includes(`${parent}${element}`);
          
          return hasRule;
        }
      ),
      { numRuns: 100 }
    );
  });
});
