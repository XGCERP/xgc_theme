/**
 * Property-Based Test: Color Variation Availability
 * 
 * Feature: oneui-frappe-theme-integration
 * Property 4: Color Variation Availability
 * 
 * Tests that each brand color has lighter, light, base, dark, darker variations
 * with the naming pattern --xgc-{color}-{variant}.
 * 
 * **Validates: Requirements 4.5**
 */

const fc = require('fast-check');
const fs = require('fs');
const path = require('path');

describe('Property 4: Color Variation Availability', () => {
  let cssVariableDefinitions;

  beforeAll(() => {
    // Read xgc_variables.css
    const cssFilePath = path.join(__dirname, '../../public/css/xgc_variables.css');
    const cssContent = fs.readFileSync(cssFilePath, 'utf-8');
    
    // Extract all CSS variable definitions
    const variableDefRegex = /(--[\w-]+)\s*:\s*([^;]+);/g;
    cssVariableDefinitions = new Map();
    
    let match;
    while ((match = variableDefRegex.exec(cssContent)) !== null) {
      const [, varName, varValue] = match;
      cssVariableDefinitions.set(varName.trim(), varValue.trim());
    }
  });

  test('each brand color has all required variations (lighter, light, base, dark, darker)', () => {
    // Property: For any brand color (forest-green or gold),
    // all five variations should exist with the naming pattern --xgc-{color}-{variant}
    
    const brandColors = ['forest-green', 'gold'];
    const requiredVariations = ['lighter', 'light', '', 'dark', 'darker'];
    
    fc.assert(
      fc.property(
        fc.constantFrom(...brandColors),
        (colorName) => {
          // Check that all variations exist for this color
          const allVariationsExist = requiredVariations.every(variation => {
            const varName = variation === '' 
              ? `--xgc-${colorName}` 
              : `--xgc-${colorName}-${variation}`;
            return cssVariableDefinitions.has(varName);
          });
          
          return allVariationsExist;
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('forest-green color family has all five variations', () => {
    // Specific test for forest-green color family
    const forestGreenVariations = [
      '--xgc-forest-green',
      '--xgc-forest-green-light',
      '--xgc-forest-green-lighter',
      '--xgc-forest-green-dark',
      '--xgc-forest-green-darker'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...forestGreenVariations),
        (variableName) => {
          const value = cssVariableDefinitions.get(variableName);
          
          // Variable should exist and be a valid hex color
          return value !== undefined && 
                 value.startsWith('#') && 
                 value.length === 7;
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('gold color family has all five variations', () => {
    // Specific test for gold color family
    const goldVariations = [
      '--xgc-gold',
      '--xgc-gold-light',
      '--xgc-gold-lighter',
      '--xgc-gold-dark',
      '--xgc-gold-darker'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...goldVariations),
        (variableName) => {
          const value = cssVariableDefinitions.get(variableName);
          
          // Variable should exist and be a valid hex color
          return value !== undefined && 
                 value.startsWith('#') && 
                 value.length === 7;
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('color variations follow naming pattern --xgc-{color}-{variant}', () => {
    // Test that all brand color variations follow the expected naming pattern
    const brandColorPattern = /^--xgc-(forest-green|gold)(-lighter|-light|-dark|-darker)?$/;
    
    // Get all variables that match the brand color pattern
    const brandColorVars = Array.from(cssVariableDefinitions.keys())
      .filter(varName => brandColorPattern.test(varName));
    
    fc.assert(
      fc.property(
        fc.constantFrom(...brandColorVars),
        (variableName) => {
          // Variable should match the pattern and have a value
          const matchesPattern = brandColorPattern.test(variableName);
          const hasValue = cssVariableDefinitions.get(variableName) !== undefined;
          
          return matchesPattern && hasValue;
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('lighter variations are lighter than base color', () => {
    // Test that lighter and light variations have higher luminance than base
    const colorFamilies = [
      {
        base: '--xgc-forest-green',
        light: '--xgc-forest-green-light',
        lighter: '--xgc-forest-green-lighter'
      },
      {
        base: '--xgc-gold',
        light: '--xgc-gold-light',
        lighter: '--xgc-gold-lighter'
      }
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...colorFamilies),
        (family) => {
          const baseColor = cssVariableDefinitions.get(family.base);
          const lightColor = cssVariableDefinitions.get(family.light);
          const lighterColor = cssVariableDefinitions.get(family.lighter);
          
          // All colors should exist
          if (!baseColor || !lightColor || !lighterColor) {
            return false;
          }
          
          // Convert hex to RGB and calculate luminance
          const getLuminance = (hex) => {
            const r = parseInt(hex.slice(1, 3), 16) / 255;
            const g = parseInt(hex.slice(3, 5), 16) / 255;
            const b = parseInt(hex.slice(5, 7), 16) / 255;
            
            // Simplified luminance calculation
            return 0.299 * r + 0.587 * g + 0.114 * b;
          };
          
          const baseLum = getLuminance(baseColor);
          const lightLum = getLuminance(lightColor);
          const lighterLum = getLuminance(lighterColor);
          
          // Lighter variations should have higher luminance
          return lightLum > baseLum && lighterLum > lightLum;
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('darker variations are darker than base color', () => {
    // Test that dark and darker variations have lower luminance than base
    const colorFamilies = [
      {
        base: '--xgc-forest-green',
        dark: '--xgc-forest-green-dark',
        darker: '--xgc-forest-green-darker'
      },
      {
        base: '--xgc-gold',
        dark: '--xgc-gold-dark',
        darker: '--xgc-gold-darker'
      }
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...colorFamilies),
        (family) => {
          const baseColor = cssVariableDefinitions.get(family.base);
          const darkColor = cssVariableDefinitions.get(family.dark);
          const darkerColor = cssVariableDefinitions.get(family.darker);
          
          // All colors should exist
          if (!baseColor || !darkColor || !darkerColor) {
            return false;
          }
          
          // Convert hex to RGB and calculate luminance
          const getLuminance = (hex) => {
            const r = parseInt(hex.slice(1, 3), 16) / 255;
            const g = parseInt(hex.slice(3, 5), 16) / 255;
            const b = parseInt(hex.slice(5, 7), 16) / 255;
            
            // Simplified luminance calculation
            return 0.299 * r + 0.587 * g + 0.114 * b;
          };
          
          const baseLum = getLuminance(baseColor);
          const darkLum = getLuminance(darkColor);
          const darkerLum = getLuminance(darkerColor);
          
          // Darker variations should have lower luminance
          return darkLum < baseLum && darkerLum < darkLum;
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('all color variations are valid hex colors', () => {
    // Test that all brand color variations are valid 7-character hex colors
    const brandColorPattern = /^--xgc-(forest-green|gold)(-lighter|-light|-dark|-darker)?$/;
    const brandColorVars = Array.from(cssVariableDefinitions.keys())
      .filter(varName => brandColorPattern.test(varName));
    
    fc.assert(
      fc.property(
        fc.constantFrom(...brandColorVars),
        (variableName) => {
          const value = cssVariableDefinitions.get(variableName);
          
          // Should be a valid hex color (#RRGGBB)
          const hexColorPattern = /^#[0-9a-fA-F]{6}$/;
          return hexColorPattern.test(value);
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('color variations maintain hue consistency within family', () => {
    // Test that variations maintain similar hue (color family)
    const colorFamilies = [
      {
        name: 'forest-green',
        variations: [
          '--xgc-forest-green',
          '--xgc-forest-green-light',
          '--xgc-forest-green-lighter',
          '--xgc-forest-green-dark',
          '--xgc-forest-green-darker'
        ]
      },
      {
        name: 'gold',
        variations: [
          '--xgc-gold',
          '--xgc-gold-light',
          '--xgc-gold-lighter',
          '--xgc-gold-dark',
          '--xgc-gold-darker'
        ]
      }
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...colorFamilies),
        (family) => {
          // Get all color values
          const colors = family.variations.map(varName => 
            cssVariableDefinitions.get(varName)
          );
          
          // All colors should exist
          if (colors.some(c => !c)) {
            return false;
          }
          
          // Convert hex to HSL to check hue consistency
          const hexToHSL = (hex) => {
            const r = parseInt(hex.slice(1, 3), 16) / 255;
            const g = parseInt(hex.slice(3, 5), 16) / 255;
            const b = parseInt(hex.slice(5, 7), 16) / 255;
            
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const delta = max - min;
            
            let h = 0;
            if (delta !== 0) {
              if (max === r) {
                h = ((g - b) / delta) % 6;
              } else if (max === g) {
                h = (b - r) / delta + 2;
              } else {
                h = (r - g) / delta + 4;
              }
              h = Math.round(h * 60);
              if (h < 0) h += 360;
            }
            
            return h;
          };
          
          const hues = colors.map(hexToHSL);
          const baseHue = hues[0];
          
          // All hues should be within 30 degrees of the base hue
          // (allowing for some variation due to lightness/darkness adjustments)
          return hues.every(hue => Math.abs(hue - baseHue) <= 30);
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });
});
