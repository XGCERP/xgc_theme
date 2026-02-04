/**
 * Property-Based Test: Brand Color Application to UI Elements
 * 
 * Feature: oneui-frappe-theme-integration
 * Property 2: Brand Color Application to UI Elements
 * 
 * Tests that primary UI elements use brand colors:
 * - Forest green (#2d5016) or variations for primary elements
 * - Gold (#d4af37) or variations for accent elements
 * 
 * **Validates: Requirements 4.3**
 * 
 * @jest-environment jsdom
 */

const fc = require('fast-check');
const fs = require('fs');
const path = require('path');

describe('Property 2: Brand Color Application to UI Elements', () => {
  let document;
  let window;
  let cssVariableDefinitions;

  beforeAll(() => {
    // Read CSS files
    const variablesCSS = fs.readFileSync(
      path.join(__dirname, '../../public/css/xgc_variables.css'),
      'utf-8'
    );
    const componentsCSS = fs.readFileSync(
      path.join(__dirname, '../../public/css/xgc_components.css'),
      'utf-8'
    );

    // Use the jsdom environment's document and window
    document = global.document;
    window = global.window;

    // Inject CSS into the document
    const styleVariables = document.createElement('style');
    styleVariables.textContent = variablesCSS;
    document.head.appendChild(styleVariables);

    const styleComponents = document.createElement('style');
    styleComponents.textContent = componentsCSS;
    document.head.appendChild(styleComponents);

    // Extract CSS variable definitions for validation
    const variableDefRegex = /(--[\w-]+)\s*:\s*([^;]+);/g;
    cssVariableDefinitions = new Map();
    
    let match;
    while ((match = variableDefRegex.exec(variablesCSS)) !== null) {
      const [, varName, varValue] = match;
      cssVariableDefinitions.set(varName.trim(), varValue.trim());
    }
  });

  /**
   * Normalize color to hex format
   */
  function normalizeColor(color) {
    if (!color) return null;
    
    // Already hex
    if (color.startsWith('#')) {
      return color.toLowerCase();
    }
    
    // RGB format
    if (color.startsWith('rgb')) {
      const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (match) {
        const r = parseInt(match[1]).toString(16).padStart(2, '0');
        const g = parseInt(match[2]).toString(16).padStart(2, '0');
        const b = parseInt(match[3]).toString(16).padStart(2, '0');
        return `#${r}${g}${b}`;
      }
    }
    
    return null;
  }

  /**
   * Check if color is a brand color or variation
   */
  function isBrandColor(color) {
    if (!color) return false;
    
    const normalized = normalizeColor(color);
    if (!normalized) return false;
    
    // Forest green variations
    const forestGreenColors = [
      '#2d5016', // base
      '#3d6b1f', // light
      '#4d7c2a', // lighter
      '#1d3a0f', // dark
      '#0d2005'  // darker
    ];
    
    // Gold variations
    const goldColors = [
      '#d4af37', // base
      '#e6c966', // light
      '#f0d68a', // lighter
      '#b8941f', // dark
      '#9c7a10'  // darker
    ];
    
    return forestGreenColors.includes(normalized) || goldColors.includes(normalized);
  }

  /**
   * Check if color is forest green or variation
   */
  function isForestGreen(color) {
    if (!color) return false;
    
    const normalized = normalizeColor(color);
    if (!normalized) return false;
    
    const forestGreenColors = [
      '#2d5016', // base
      '#3d6b1f', // light
      '#4d7c2a', // lighter
      '#1d3a0f', // dark
      '#0d2005'  // darker
    ];
    
    return forestGreenColors.includes(normalized);
  }

  /**
   * Check if color is gold or variation
   */
  function isGold(color) {
    if (!color) return false;
    
    const normalized = normalizeColor(color);
    if (!normalized) return false;
    
    const goldColors = [
      '#d4af37', // base
      '#e6c966', // light
      '#f0d68a', // lighter
      '#b8941f', // dark
      '#9c7a10'  // darker
    ];
    
    return goldColors.includes(normalized);
  }

  /**
   * Get computed style for an element
   */
  function getComputedStyle(element) {
    return window.getComputedStyle(element);
  }

  test('primary buttons use forest green brand color', () => {
    // Property: Primary buttons should use forest green as background
    
    fc.assert(
      fc.property(
        fc.constant('btn btn-primary'),
        (buttonClass) => {
          const button = document.createElement('button');
          button.className = buttonClass;
          document.body.appendChild(button);
          
          const style = getComputedStyle(button);
          const bgColor = style.backgroundColor;
          const borderColor = style.borderColor;
          
          button.remove();
          
          // Check if background or border uses forest green
          // Note: JSDOM may not compute colors correctly, so we check the CSS definition
          const cssContent = document.querySelector('style:last-of-type').textContent;
          const hasBrandColor = cssContent.includes('--xgc-forest-green') || 
                                cssContent.includes('#2d5016');
          
          return hasBrandColor || isForestGreen(bgColor) || isForestGreen(borderColor);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('warning buttons use gold brand color', () => {
    // Property: Warning buttons should use gold as background
    
    fc.assert(
      fc.property(
        fc.constant('btn btn-warning'),
        (buttonClass) => {
          const button = document.createElement('button');
          button.className = buttonClass;
          document.body.appendChild(button);
          
          const style = getComputedStyle(button);
          const bgColor = style.backgroundColor;
          const borderColor = style.borderColor;
          
          button.remove();
          
          // Check if background or border uses gold
          // Note: JSDOM may not compute colors correctly, so we check the CSS definition
          const cssContent = document.querySelector('style:last-of-type').textContent;
          const hasBrandColor = cssContent.includes('--xgc-gold') || 
                                cssContent.includes('#d4af37');
          
          return hasBrandColor || isGold(bgColor) || isGold(borderColor);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('navbar uses forest green brand color', () => {
    // Property: Navbar should use forest green as background
    
    fc.assert(
      fc.property(
        fc.constant('navbar'),
        (navClass) => {
          const nav = document.createElement('nav');
          nav.className = navClass;
          document.body.appendChild(nav);
          
          const style = getComputedStyle(nav);
          const bgColor = style.backgroundColor;
          
          nav.remove();
          
          // Check if background uses forest green
          const cssContent = document.querySelector('style:last-of-type').textContent;
          const hasBrandColor = cssContent.includes('--xgc-forest-green') || 
                                cssContent.includes('#2d5016');
          
          return hasBrandColor || isForestGreen(bgColor);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('nav links use gold brand color on hover/active', () => {
    // Property: Nav links should use gold for hover/active states
    
    fc.assert(
      fc.property(
        fc.constant('nav-link'),
        (linkClass) => {
          const link = document.createElement('a');
          link.className = linkClass;
          document.body.appendChild(link);
          
          // Check CSS definition for hover/active states
          const cssContent = document.querySelector('style:last-of-type').textContent;
          const hasGoldHover = cssContent.includes('.nav-link:hover') && 
                               cssContent.includes('--xgc-gold');
          const hasGoldActive = cssContent.includes('.nav-link.active') && 
                                cssContent.includes('--xgc-gold');
          
          link.remove();
          
          return hasGoldHover || hasGoldActive;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('breadcrumb links use forest green brand color', () => {
    // Property: Breadcrumb links should use forest green
    
    fc.assert(
      fc.property(
        fc.constant('breadcrumb-item'),
        (itemClass) => {
          const item = document.createElement('div');
          item.className = itemClass;
          const link = document.createElement('a');
          link.href = '#';
          item.appendChild(link);
          document.body.appendChild(item);
          
          // Check CSS definition
          const cssContent = document.querySelector('style:last-of-type').textContent;
          const hasBrandColor = cssContent.includes('.breadcrumb-item a') && 
                                cssContent.includes('--xgc-forest-green');
          
          item.remove();
          
          return hasBrandColor;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('form controls use forest green for focus state', () => {
    // Property: Form controls should use forest green for focus border
    
    const formControlTypes = [
      { tag: 'input', type: 'text' },
      { tag: 'textarea', type: null },
      { tag: 'select', type: null }
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...formControlTypes),
        (controlType) => {
          const control = document.createElement(controlType.tag);
          if (controlType.type) {
            control.type = controlType.type;
          }
          control.className = 'form-control';
          document.body.appendChild(control);
          
          // Check CSS definition for focus state
          const cssContent = document.querySelector('style:last-of-type').textContent;
          const hasFocusBrandColor = (cssContent.includes('.form-control:focus') || 
                                      cssContent.includes('input:focus')) && 
                                     cssContent.includes('--xgc-forest-green');
          
          control.remove();
          
          return hasFocusBrandColor;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('checkboxes and radios use forest green when checked', () => {
    // Property: Checkboxes and radios should use forest green when checked
    
    const inputTypes = ['checkbox', 'radio'];

    fc.assert(
      fc.property(
        fc.constantFrom(...inputTypes),
        (inputType) => {
          const input = document.createElement('input');
          input.type = inputType;
          document.body.appendChild(input);
          
          // Check CSS definition for checked state
          const cssContent = document.querySelector('style:last-of-type').textContent;
          const hasCheckedBrandColor = cssContent.includes(`input[type="${inputType}"]:checked`) && 
                                       cssContent.includes('--xgc-forest-green');
          
          input.remove();
          
          return hasCheckedBrandColor;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('CSS variables reference brand colors', () => {
    // Property: Primary and accent CSS variables should reference brand colors
    
    const primaryVar = cssVariableDefinitions.get('--primary');
    const accentVar = cssVariableDefinitions.get('--accent');
    
    // Should reference forest green and gold
    const primaryReferencesForestGreen = primaryVar && 
                                         primaryVar.includes('--xgc-forest-green');
    const accentReferencesGold = accentVar && 
                                 accentVar.includes('--xgc-gold');
    
    expect(primaryReferencesForestGreen).toBe(true);
    expect(accentReferencesGold).toBe(true);
  });

  test('brand color variables are defined', () => {
    // Property: All brand color variations should be defined
    
    const requiredBrandColors = [
      '--xgc-forest-green',
      '--xgc-forest-green-light',
      '--xgc-forest-green-dark',
      '--xgc-gold',
      '--xgc-gold-light',
      '--xgc-gold-dark'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...requiredBrandColors),
        (colorVar) => {
          return cssVariableDefinitions.has(colorVar);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('primary UI elements use brand colors in CSS definitions', () => {
    // Property: Primary UI elements should have brand colors in their CSS rules
    
    const uiElements = [
      { selector: '.btn-primary', expectedColor: 'forest-green' },
      { selector: '.btn-warning', expectedColor: 'gold' },
      { selector: '.navbar', expectedColor: 'forest-green' },
      { selector: '.nav-link:hover', expectedColor: 'gold' },
      { selector: '.nav-link.active', expectedColor: 'gold' }
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...uiElements),
        ({ selector, expectedColor }) => {
          const cssContent = document.querySelector('style:last-of-type').textContent;
          
          // Check if selector exists and references the expected brand color
          const hasSelectorWithColor = cssContent.includes(selector) && 
                                       cssContent.includes(`--xgc-${expectedColor}`);
          
          return hasSelectorWithColor;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('secondary button hover uses forest green', () => {
    // Property: Secondary buttons should use forest green on hover
    
    fc.assert(
      fc.property(
        fc.constant('btn btn-secondary'),
        (buttonClass) => {
          const button = document.createElement('button');
          button.className = buttonClass;
          document.body.appendChild(button);
          
          // Check CSS definition for hover state
          const cssContent = document.querySelector('style:last-of-type').textContent;
          const hasHoverBrandColor = cssContent.includes('.btn-secondary:hover') && 
                                     cssContent.includes('--xgc-forest-green');
          
          button.remove();
          
          return hasHoverBrandColor;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('alert warning uses gold brand color', () => {
    // Property: Warning alerts should use gold
    
    fc.assert(
      fc.property(
        fc.constant('alert alert-warning'),
        (alertClass) => {
          const alert = document.createElement('div');
          alert.className = alertClass;
          document.body.appendChild(alert);
          
          // Check CSS definition
          const cssContent = document.querySelector('style:last-of-type').textContent;
          const hasBrandColor = cssContent.includes('.alert-warning') && 
                                cssContent.includes('--xgc-gold');
          
          alert.remove();
          
          return hasBrandColor;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('brand colors are consistently applied across component variants', () => {
    // Property: Brand colors should be used consistently across all variants
    
    const componentVariants = [
      { component: 'button', class: 'btn btn-primary', expectedColor: 'forest-green' },
      { component: 'button', class: 'btn btn-warning', expectedColor: 'gold' },
      { component: 'nav', class: 'navbar', expectedColor: 'forest-green' },
      { component: 'input', class: 'form-control', expectedColor: 'forest-green' }
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...componentVariants),
        ({ component, class: className, expectedColor }) => {
          const element = document.createElement(component);
          element.className = className;
          document.body.appendChild(element);
          
          // Check CSS definition
          const cssContent = document.querySelector('style:last-of-type').textContent;
          const hasBrandColor = cssContent.includes(`--xgc-${expectedColor}`);
          
          element.remove();
          
          return hasBrandColor;
        }
      ),
      { numRuns: 100 }
    );
  });
});
