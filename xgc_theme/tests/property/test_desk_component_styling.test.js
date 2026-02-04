/**
 * Property-Based Test: Desk Component Styling
 * 
 * Feature: oneui-frappe-theme-integration
 * Property 16: Desk Component Styling
 * 
 * Tests that Desk-specific components have theme styling applied:
 * - Brand colors used for primary elements
 * - OneUI border-radius values
 * - Proper spacing using theme spacing variables
 * 
 * **Validates: Requirements 6.1, 6.2, 6.3, 6.5**
 */

const fc = require('fast-check');
const fs = require('fs');
const path = require('path');

describe('Property 16: Desk Component Styling', () => {
  let cssContent;
  let cssVariables;

  beforeAll(() => {
    // Read CSS files
    const variablesPath = path.join(__dirname, '../../public/css/xgc_variables.css');
    const deskPath = path.join(__dirname, '../../public/css/xgc_desk.css');
    
    const variablesContent = fs.readFileSync(variablesPath, 'utf-8');
    cssContent = fs.readFileSync(deskPath, 'utf-8');
    
    // Extract CSS variable definitions
    const variableDefRegex = /(--[\w-]+)\s*:\s*([^;]+);/g;
    cssVariables = new Map();
    
    let match;
    while ((match = variableDefRegex.exec(variablesContent)) !== null) {
      const [, varName, varValue] = match;
      cssVariables.set(varName.trim(), varValue.trim());
    }
  });

  /**
   * Check if a CSS property value uses a brand color variable
   */
  function usesBrandColor(value) {
    if (!value) return false;
    
    const brandColorPatterns = [
      'var(--xgc-forest-green',
      'var(--xgc-gold',
      'var(--primary',
      'var(--accent',
      '#2d5016', // forest green
      '#3d6b1f', // forest green light
      '#1d3a0f', // forest green dark
      '#9c7a10', // gold
      '#b8941f', // gold light
      '#7a5e0d'  // gold dark
    ];
    
    return brandColorPatterns.some(pattern => value.includes(pattern));
  }

  /**
   * Check if a value uses OneUI border-radius
   */
  function usesOneUIBorderRadius(value) {
    if (!value) return false;
    
    const oneUIRadiusPatterns = [
      'var(--border-radius)', // Base border-radius variable
      'var(--border-radius-sm)',
      'var(--border-radius-md)',
      'var(--border-radius-lg)',
      'var(--border-radius-xl)',
      'var(--border-radius-full)',
      '0.25rem', // 4px
      '0.375rem', // 6px
      '0.5rem',  // 8px
      '0.75rem', // 12px
      '1rem',    // 16px
      '0'        // No border-radius (valid for nested elements)
    ];
    
    return oneUIRadiusPatterns.some(pattern => value.includes(pattern));
  }

  /**
   * Check if a value uses theme spacing variables
   */
  function usesThemeSpacing(value) {
    if (!value) return false;
    
    const spacingPatterns = [
      'var(--spacing-xs)',
      'var(--spacing-sm)',
      'var(--spacing-md)',
      'var(--spacing-lg)',
      'var(--spacing-xl)',
      'var(--spacing-2xl)',
      'var(--spacing-3xl)',
      '0' // Zero spacing is valid
    ];
    
    return spacingPatterns.some(pattern => value.includes(pattern));
  }

  /**
   * Parse CSS content to extract property values for a selector
   */
  function extractCSSProperties(selector) {
    const properties = {};
    const regex = new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*{([^}]+)}`, 'g');
    
    let match;
    while ((match = regex.exec(cssContent)) !== null) {
      const propertiesBlock = match[1];
      const propRegex = /([\w-]+)\s*:\s*([^;]+);/g;
      
      let propMatch;
      while ((propMatch = propRegex.exec(propertiesBlock)) !== null) {
        const [, propName, propValue] = propMatch;
        properties[propName.trim()] = propValue.trim();
      }
    }
    
    return properties;
  }

  test('sidebar items use brand colors for background or text', () => {
    // Property: Sidebar items should use brand colors in hover/active states
    // Note: Base state may not use brand colors, which is acceptable
    
    const sidebarSelectors = [
      '.desk-sidebar .sidebar-item:hover',
      '.desk-sidebar .standard-sidebar-item:hover',
      '.desk-sidebar .sidebar-item.active',
      '.desk-sidebar .standard-sidebar-item.selected'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...sidebarSelectors),
        (selector) => {
          const properties = extractCSSProperties(selector);
          
          // Check if background-color or color uses brand colors
          const hasBrandColor = 
            usesBrandColor(properties['background-color']) ||
            usesBrandColor(properties['color']);
          
          // At least one color property should use brand colors
          return hasBrandColor || Object.keys(properties).length === 0;
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('sidebar items use OneUI border-radius', () => {
    // Property: Sidebar items should use OneUI border-radius values
    
    const sidebarSelectors = [
      '.desk-sidebar .sidebar-item',
      '.desk-sidebar .standard-sidebar-item'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...sidebarSelectors),
        (selector) => {
          const properties = extractCSSProperties(selector);
          
          if (!properties['border-radius']) {
            return true; // No border-radius defined is acceptable
          }
          
          return usesOneUIBorderRadius(properties['border-radius']);
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('sidebar items use theme spacing variables', () => {
    // Property: Sidebar items should use theme spacing variables for padding/margin
    
    const sidebarSelectors = [
      '.desk-sidebar .sidebar-item',
      '.desk-sidebar .standard-sidebar-item'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...sidebarSelectors),
        (selector) => {
          const properties = extractCSSProperties(selector);
          
          // Check padding and margin properties
          const spacingProps = ['padding', 'margin', 'padding-top', 'padding-right', 
                                'padding-bottom', 'padding-left', 'margin-top', 
                                'margin-right', 'margin-bottom', 'margin-left'];
          
          const hasSpacing = spacingProps.some(prop => properties[prop]);
          
          if (!hasSpacing) {
            return true; // No spacing defined is acceptable
          }
          
          // At least one spacing property should use theme variables
          return spacingProps.some(prop => usesThemeSpacing(properties[prop]));
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('page headers use brand colors for title', () => {
    // Property: Page titles should use brand colors
    
    const headerSelectors = [
      '.page-title',
      '.page-title .icon'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...headerSelectors),
        (selector) => {
          const properties = extractCSSProperties(selector);
          
          if (!properties['color']) {
            return true; // No color defined is acceptable (inherits)
          }
          
          return usesBrandColor(properties['color']);
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('page head uses proper spacing', () => {
    // Property: Page head should use theme spacing variables
    
    const properties = extractCSSProperties('.page-head');
    
    if (Object.keys(properties).length === 0) {
      // No properties found, skip test
      return;
    }
    
    const spacingProps = ['padding', 'margin', 'padding-top', 'padding-right', 
                          'padding-bottom', 'padding-left', 'margin-top', 
                          'margin-right', 'margin-bottom', 'margin-left'];
    
    const hasSpacing = spacingProps.some(prop => properties[prop]);
    
    if (hasSpacing) {
      const usesSpacing = spacingProps.some(prop => usesThemeSpacing(properties[prop]));
      expect(usesSpacing).toBe(true);
    }
  });

  test('form controls use theme spacing', () => {
    // Property: Form controls should use theme spacing variables
    
    const formSelectors = [
      '.frappe-control',
      '.form-section',
      '.form-layout'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...formSelectors),
        (selector) => {
          const properties = extractCSSProperties(selector);
          
          const spacingProps = ['padding', 'margin', 'margin-bottom'];
          const hasSpacing = spacingProps.some(prop => properties[prop]);
          
          if (!hasSpacing) {
            return true;
          }
          
          return spacingProps.some(prop => usesThemeSpacing(properties[prop]));
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('grid rows use OneUI border-radius', () => {
    // Property: Grid rows should use OneUI border-radius values
    
    const gridSelectors = [
      '.grid-row',
      '.list-row',
      '.grid-heading-row'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...gridSelectors),
        (selector) => {
          const properties = extractCSSProperties(selector);
          
          if (!properties['border-radius']) {
            return true;
          }
          
          return usesOneUIBorderRadius(properties['border-radius']);
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('grid rows use brand colors on hover', () => {
    // Property: Grid rows should use brand colors for hover states
    
    const gridHoverSelectors = [
      '.grid-row:hover',
      '.list-row:hover',
      '.grid-row.selected',
      '.list-row.selected'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...gridHoverSelectors),
        (selector) => {
          const properties = extractCSSProperties(selector);
          
          // Check if background-color or border-color uses brand colors
          const hasBrandColor = 
            usesBrandColor(properties['background-color']) ||
            usesBrandColor(properties['border-color']);
          
          return hasBrandColor || Object.keys(properties).length === 0;
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('grid rows use theme spacing for padding', () => {
    // Property: Grid rows should use theme spacing variables for padding
    
    const gridSelectors = [
      '.grid-row',
      '.list-row',
      '.grid-heading-row'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...gridSelectors),
        (selector) => {
          const properties = extractCSSProperties(selector);
          
          if (!properties['padding']) {
            return true;
          }
          
          return usesThemeSpacing(properties['padding']);
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('form section headers use brand colors', () => {
    // Property: Form section headers should use brand colors
    
    const properties = extractCSSProperties('.form-section .section-head');
    
    if (Object.keys(properties).length === 0) {
      return;
    }
    
    if (properties['color']) {
      expect(usesBrandColor(properties['color'])).toBe(true);
    }
  });

  test('form tabs use brand colors for active state', () => {
    // Property: Form tabs should use brand colors for active state
    
    const tabSelectors = [
      '.form-tabs .nav-link:hover',
      '.form-tabs .nav-link.active'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...tabSelectors),
        (selector) => {
          const properties = extractCSSProperties(selector);
          
          const hasBrandColor = 
            usesBrandColor(properties['color']) ||
            usesBrandColor(properties['border-bottom']) ||
            usesBrandColor(properties['border-bottom-color']);
          
          return hasBrandColor || Object.keys(properties).length === 0;
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('all Desk components have consistent border-radius usage', () => {
    // Property: All Desk components should use consistent OneUI border-radius values
    
    const deskComponents = [
      '.desk-sidebar .sidebar-item',
      '.page-head',
      '.grid-row',
      '.list-row',
      '.form-layout',
      '.list-view',
      '.list-filters',
      '.form-grid'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...deskComponents),
        (selector) => {
          const properties = extractCSSProperties(selector);
          
          if (!properties['border-radius']) {
            return true; // No border-radius is acceptable
          }
          
          // Should use OneUI border-radius values
          return usesOneUIBorderRadius(properties['border-radius']);
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('all Desk components with spacing use theme variables', () => {
    // Property: All Desk components should use theme spacing variables
    
    const deskComponents = [
      '.desk-sidebar .sidebar-item',
      '.page-head',
      '.frappe-control',
      '.form-section',
      '.grid-row',
      '.list-row',
      '.form-layout',
      '.list-view'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...deskComponents),
        (selector) => {
          const properties = extractCSSProperties(selector);
          
          const spacingProps = ['padding', 'margin', 'padding-top', 'padding-right', 
                                'padding-bottom', 'padding-left', 'margin-top', 
                                'margin-right', 'margin-bottom', 'margin-left'];
          
          const hasSpacing = spacingProps.some(prop => properties[prop]);
          
          if (!hasSpacing) {
            return true;
          }
          
          // At least one spacing property should use theme variables
          return spacingProps.some(prop => usesThemeSpacing(properties[prop]));
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('primary Desk elements use brand colors', () => {
    // Property: Primary Desk elements should use brand colors
    
    const primaryElements = [
      '.desk-sidebar',
      '.page-title',
      '.desk-sidebar .sidebar-item.active',
      '.form-section .section-head',
      '.form-tabs .nav-link.active'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...primaryElements),
        (selector) => {
          const properties = extractCSSProperties(selector);
          
          if (Object.keys(properties).length === 0) {
            return true;
          }
          
          // Check if any color property uses brand colors
          const colorProps = ['color', 'background-color', 'border-color', 
                             'border-bottom-color', 'border-top-color'];
          
          const hasBrandColor = colorProps.some(prop => 
            properties[prop] && usesBrandColor(properties[prop])
          );
          
          return hasBrandColor;
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('Desk components have proper visual hierarchy with spacing', () => {
    // Property: Desk components should have proper spacing hierarchy
    // Larger components should have larger spacing values
    
    const componentSpacing = [
      { selector: '.frappe-control', expectedMin: 'xs' },
      { selector: '.form-section', expectedMin: 'md' },
      { selector: '.page-head', expectedMin: 'md' }
    ];

    const spacingOrder = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
    
    componentSpacing.forEach(({ selector, expectedMin }) => {
      const properties = extractCSSProperties(selector);
      const spacingProps = ['padding', 'margin', 'margin-bottom'];
      
      spacingProps.forEach(prop => {
        if (properties[prop]) {
          const value = properties[prop];
          
          // Extract spacing variable name if present
          const match = value.match(/var\(--spacing-([\w-]+)\)/);
          if (match) {
            const spacingLevel = match[1];
            const expectedIndex = spacingOrder.indexOf(expectedMin);
            const actualIndex = spacingOrder.indexOf(spacingLevel);
            
            // Actual spacing should be >= expected minimum
            expect(actualIndex).toBeGreaterThanOrEqual(expectedIndex);
          }
        }
      });
    });
  });
});

