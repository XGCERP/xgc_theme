/**
 * Property-Based Test: CSS Variable Override Completeness
 * 
 * Feature: oneui-frappe-theme-integration
 * Property 1: CSS Variable Override Completeness
 * 
 * Tests that all CSS variables defined in xgc_variables.css are properly
 * defined with non-empty values and follow the expected naming patterns.
 * 
 * **Validates: Requirements 3.2, 3.3**
 */

const fc = require('fast-check');
const fs = require('fs');
const path = require('path');

describe('Property 1: CSS Variable Override Completeness', () => {
  let cssContent;
  let cssVariableDefinitions;

  beforeAll(() => {
    // Read xgc_variables.css
    const cssFilePath = path.join(__dirname, '../../public/css/xgc_variables.css');
    cssContent = fs.readFileSync(cssFilePath, 'utf-8');
    
    // Extract all CSS variable definitions (--variable-name: value;)
    // This regex captures variable name and its value
    const variableDefRegex = /(--[\w-]+)\s*:\s*([^;]+);/g;
    cssVariableDefinitions = new Map();
    
    let match;
    while ((match = variableDefRegex.exec(cssContent)) !== null) {
      const [, varName, varValue] = match;
      cssVariableDefinitions.set(varName.trim(), varValue.trim());
    }
  });

  test('all CSS variables defined in xgc_variables.css have non-empty values', () => {
    // Property: For any CSS variable defined in xgc_variables.css,
    // that variable should have a non-empty value
    
    const allVariables = Array.from(cssVariableDefinitions.keys());
    
    fc.assert(
      fc.property(
        fc.constantFrom(...allVariables),
        (variableName) => {
          const value = cssVariableDefinitions.get(variableName);
          
          // The variable should have a non-empty value
          return value !== undefined && value.trim() !== '';
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('all brand color variables are defined with valid color values', () => {
    // Specific test for brand colors to ensure they're all present
    const brandColorVariables = [
      '--xgc-forest-green',
      '--xgc-forest-green-light',
      '--xgc-forest-green-lighter',
      '--xgc-forest-green-dark',
      '--xgc-forest-green-darker',
      '--xgc-gold',
      '--xgc-gold-light',
      '--xgc-gold-lighter',
      '--xgc-gold-dark',
      '--xgc-gold-darker'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...brandColorVariables),
        (variableName) => {
          const value = cssVariableDefinitions.get(variableName);
          
          // Brand colors should be defined as hex colors
          return value !== undefined && value.startsWith('#') && value.length === 7;
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('all Frappe core variable overrides are defined', () => {
    // Test that Frappe core variables are overridden
    const frappeVariables = [
      '--primary',
      '--primary-light',
      '--primary-dark',
      '--accent',
      '--accent-light',
      '--accent-dark',
      '--text-color',
      '--text-muted',
      '--text-light',
      '--bg-color',
      '--surface-color',
      '--surface-hover',
      '--border-color',
      '--border-color-dark'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...frappeVariables),
        (variableName) => {
          const value = cssVariableDefinitions.get(variableName);
          
          return value !== undefined && value.trim() !== '';
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('all OneUI typography variables are defined', () => {
    const typographyVariables = [
      '--font-family-sans-serif',
      '--font-family-monospace',
      '--font-size-xs',
      '--font-size-sm',
      '--font-size-base',
      '--font-size-md',
      '--font-size-lg',
      '--font-size-xl',
      '--font-size-2xl',
      '--font-size-3xl',
      '--font-size-4xl',
      '--line-height-tight',
      '--line-height-base',
      '--line-height-relaxed',
      '--font-weight-normal',
      '--font-weight-medium',
      '--font-weight-semibold',
      '--font-weight-bold',
      '--letter-spacing-tight',
      '--letter-spacing-normal',
      '--letter-spacing-wide'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...typographyVariables),
        (variableName) => {
          const value = cssVariableDefinitions.get(variableName);
          
          return value !== undefined && value.trim() !== '';
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('all OneUI spacing variables are defined', () => {
    const spacingVariables = [
      '--spacing-xs',
      '--spacing-sm',
      '--spacing-md',
      '--spacing-lg',
      '--spacing-xl',
      '--spacing-2xl',
      '--spacing-3xl'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...spacingVariables),
        (variableName) => {
          const value = cssVariableDefinitions.get(variableName);
          
          return value !== undefined && value.trim() !== '';
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('all OneUI border variables are defined', () => {
    const borderVariables = [
      '--border-width',
      '--border-width-thick',
      '--border-radius-sm',
      '--border-radius',
      '--border-radius-md',
      '--border-radius-lg',
      '--border-radius-xl',
      '--border-radius-full'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...borderVariables),
        (variableName) => {
          const value = cssVariableDefinitions.get(variableName);
          
          return value !== undefined && value.trim() !== '';
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('all OneUI shadow variables are defined', () => {
    const shadowVariables = [
      '--shadow-xs',
      '--shadow-sm',
      '--shadow-md',
      '--shadow-lg',
      '--shadow-xl',
      '--shadow-2xl'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...shadowVariables),
        (variableName) => {
          const value = cssVariableDefinitions.get(variableName);
          
          return value !== undefined && value.trim() !== '';
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('all OneUI transition variables are defined', () => {
    const transitionVariables = [
      '--transition-fast',
      '--transition-base',
      '--transition-slow'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...transitionVariables),
        (variableName) => {
          const value = cssVariableDefinitions.get(variableName);
          
          return value !== undefined && value.trim() !== '';
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('all OneUI z-index variables are defined', () => {
    const zIndexVariables = [
      '--z-dropdown',
      '--z-sticky',
      '--z-fixed',
      '--z-modal-backdrop',
      '--z-modal',
      '--z-popover',
      '--z-tooltip'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...zIndexVariables),
        (variableName) => {
          const value = cssVariableDefinitions.get(variableName);
          
          return value !== undefined && value.trim() !== '';
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('CSS variables that reference other variables are properly defined', () => {
    // Test that variables using var() reference existing variables
    const allVariables = Array.from(cssVariableDefinitions.entries());
    const variablesWithReferences = allVariables.filter(([, value]) => value.includes('var('));
    
    fc.assert(
      fc.property(
        fc.constantFrom(...variablesWithReferences),
        ([varName, varValue]) => {
          // Extract referenced variable names from var() calls
          const varRefRegex = /var\((--[\w-]+)\)/g;
          let match;
          let allReferencesExist = true;
          
          while ((match = varRefRegex.exec(varValue)) !== null) {
            const referencedVar = match[1];
            if (!cssVariableDefinitions.has(referencedVar)) {
              allReferencesExist = false;
              break;
            }
          }
          
          return allReferencesExist;
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });
});
