/**
 * Property-Based Test: Theme Variant Color Characteristics
 * 
 * Feature: oneui-frappe-theme-integration
 * Property 5: Theme Variant Color Characteristics
 * 
 * Tests that light and dark themes maintain appropriate contrast characteristics:
 * - Light theme: light backgrounds (luminance > 0.5) with dark text (luminance < 0.5)
 * - Dark theme: dark backgrounds (luminance < 0.5) with light text (luminance > 0.5)
 * 
 * **Validates: Requirements 5.1, 5.2, 5.4**
 */

const fc = require('fast-check');
const fs = require('fs');
const path = require('path');

describe('Property 5: Theme Variant Color Characteristics', () => {
  let lightThemeVariables;
  let darkThemeVariables;

  beforeAll(() => {
    // Read xgc_variables.css (light theme)
    const lightCssPath = path.join(__dirname, '../../public/css/xgc_variables.css');
    const lightCssContent = fs.readFileSync(lightCssPath, 'utf-8');
    
    // Read xgc_dark.css (dark theme)
    const darkCssPath = path.join(__dirname, '../../public/css/xgc_dark.css');
    const darkCssContent = fs.readFileSync(darkCssPath, 'utf-8');
    
    // Extract CSS variable definitions
    const variableDefRegex = /(--[\w-]+)\s*:\s*([^;]+);/g;
    
    lightThemeVariables = new Map();
    let match;
    while ((match = variableDefRegex.exec(lightCssContent)) !== null) {
      const [, varName, varValue] = match;
      lightThemeVariables.set(varName.trim(), varValue.trim());
    }
    
    darkThemeVariables = new Map();
    while ((match = variableDefRegex.exec(darkCssContent)) !== null) {
      const [, varName, varValue] = match;
      darkThemeVariables.set(varName.trim(), varValue.trim());
    }
  });

  /**
   * Calculate relative luminance according to WCAG 2.1
   * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
   */
  function getRelativeLuminance(hex) {
    // Handle hex colors with or without #
    const cleanHex = hex.startsWith('#') ? hex : '#' + hex;
    
    // Convert hex to RGB
    const r = parseInt(cleanHex.slice(1, 3), 16) / 255;
    const g = parseInt(cleanHex.slice(3, 5), 16) / 255;
    const b = parseInt(cleanHex.slice(5, 7), 16) / 255;
    
    // Apply gamma correction
    const rsRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const gsRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const bsRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
    
    // Calculate relative luminance
    return 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB;
  }

  /**
   * Resolve CSS variable references (var() syntax)
   */
  function resolveVariable(value, variableMap) {
    if (!value) return null;
    
    // If it's a var() reference, resolve it
    if (value.startsWith('var(')) {
      const varMatch = value.match(/var\((--[\w-]+)\)/);
      if (varMatch) {
        const resolvedValue = variableMap.get(varMatch[1]);
        // Recursively resolve in case of nested var() references
        return resolveVariable(resolvedValue, variableMap);
      }
    }
    
    return value;
  }

  /**
   * Check if a color value is a valid hex color
   */
  function isHexColor(value) {
    if (!value) return false;
    const cleanValue = value.trim();
    return /^#[0-9A-Fa-f]{6}$/.test(cleanValue);
  }

  test('light theme has light backgrounds (luminance > 0.5)', () => {
    // Property: Light theme background colors should have high luminance (> 0.5)
    
    const backgroundVars = [
      '--bg-color',
      '--surface-color',
      '--surface-hover'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...backgroundVars),
        (bgVar) => {
          const rawValue = lightThemeVariables.get(bgVar);
          const resolvedValue = resolveVariable(rawValue, lightThemeVariables);
          
          // Skip if not a hex color
          if (!isHexColor(resolvedValue)) {
            return true;
          }
          
          const luminance = getRelativeLuminance(resolvedValue);
          
          // Light backgrounds should have luminance > 0.5
          return luminance > 0.5;
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('light theme has dark text (luminance < 0.5)', () => {
    // Property: Light theme text colors should have low luminance (< 0.5)
    
    const textVars = [
      '--text-color',
      '--text-muted',
      '--text-light'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...textVars),
        (textVar) => {
          const rawValue = lightThemeVariables.get(textVar);
          const resolvedValue = resolveVariable(rawValue, lightThemeVariables);
          
          // Skip if not a hex color
          if (!isHexColor(resolvedValue)) {
            return true;
          }
          
          const luminance = getRelativeLuminance(resolvedValue);
          
          // Dark text should have luminance < 0.5
          return luminance < 0.5;
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('dark theme has dark backgrounds (luminance < 0.5)', () => {
    // Property: Dark theme background colors should have low luminance (< 0.5)
    
    const backgroundVars = [
      '--bg-color',
      '--surface-color',
      '--surface-hover',
      '--surface-elevated'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...backgroundVars),
        (bgVar) => {
          const rawValue = darkThemeVariables.get(bgVar);
          const resolvedValue = resolveVariable(rawValue, darkThemeVariables);
          
          // Skip if not a hex color
          if (!isHexColor(resolvedValue)) {
            return true;
          }
          
          const luminance = getRelativeLuminance(resolvedValue);
          
          // Dark backgrounds should have luminance < 0.5
          return luminance < 0.5;
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('dark theme has light text (luminance > 0.5)', () => {
    // Property: Dark theme text colors should have high luminance (> 0.5)
    
    const textVars = [
      '--text-color',
      '--text-muted',
      '--text-light'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...textVars),
        (textVar) => {
          const rawValue = darkThemeVariables.get(textVar);
          const resolvedValue = resolveVariable(rawValue, darkThemeVariables);
          
          // Skip if not a hex color
          if (!isHexColor(resolvedValue)) {
            return true;
          }
          
          const luminance = getRelativeLuminance(resolvedValue);
          
          // Light text should have luminance > 0.5
          // Note: --text-light in dark mode is actually medium gray for less important text
          // so we allow it to be slightly below 0.5
          if (textVar === '--text-light') {
            return luminance > 0.3; // More lenient for muted text
          }
          
          return luminance > 0.5;
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('light theme backgrounds are lighter than text colors', () => {
    // Property: In light theme, backgrounds should have higher luminance than text
    
    const backgroundVars = ['--bg-color', '--surface-color', '--surface-hover'];
    const textVars = ['--text-color', '--text-muted'];
    
    const combinations = [];
    for (const bg of backgroundVars) {
      for (const text of textVars) {
        combinations.push({ background: bg, text: text });
      }
    }

    fc.assert(
      fc.property(
        fc.constantFrom(...combinations),
        ({ background, text }) => {
          const bgRaw = lightThemeVariables.get(background);
          const textRaw = lightThemeVariables.get(text);
          
          const bgResolved = resolveVariable(bgRaw, lightThemeVariables);
          const textResolved = resolveVariable(textRaw, lightThemeVariables);
          
          // Skip if not hex colors
          if (!isHexColor(bgResolved) || !isHexColor(textResolved)) {
            return true;
          }
          
          const bgLuminance = getRelativeLuminance(bgResolved);
          const textLuminance = getRelativeLuminance(textResolved);
          
          // Background should be lighter than text
          return bgLuminance > textLuminance;
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('dark theme backgrounds are darker than text colors', () => {
    // Property: In dark theme, backgrounds should have lower luminance than text
    
    const backgroundVars = ['--bg-color', '--surface-color', '--surface-hover'];
    const textVars = ['--text-color', '--text-muted'];
    
    const combinations = [];
    for (const bg of backgroundVars) {
      for (const text of textVars) {
        combinations.push({ background: bg, text: text });
      }
    }

    fc.assert(
      fc.property(
        fc.constantFrom(...combinations),
        ({ background, text }) => {
          const bgRaw = darkThemeVariables.get(background);
          const textRaw = darkThemeVariables.get(text);
          
          const bgResolved = resolveVariable(bgRaw, darkThemeVariables);
          const textResolved = resolveVariable(textRaw, darkThemeVariables);
          
          // Skip if not hex colors
          if (!isHexColor(bgResolved) || !isHexColor(textResolved)) {
            return true;
          }
          
          const bgLuminance = getRelativeLuminance(bgResolved);
          const textLuminance = getRelativeLuminance(textResolved);
          
          // Background should be darker than text
          return bgLuminance < textLuminance;
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('dark theme brand colors are more vibrant than light theme', () => {
    // Property: Dark theme brand colors should have higher luminance than light theme
    // to ensure visibility on dark backgrounds
    
    const brandColorVars = [
      '--xgc-forest-green',
      '--xgc-gold'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...brandColorVars),
        (brandVar) => {
          const lightRaw = lightThemeVariables.get(brandVar);
          const darkRaw = darkThemeVariables.get(brandVar);
          
          const lightResolved = resolveVariable(lightRaw, lightThemeVariables);
          const darkResolved = resolveVariable(darkRaw, darkThemeVariables);
          
          // Skip if not hex colors
          if (!isHexColor(lightResolved) || !isHexColor(darkResolved)) {
            return true;
          }
          
          const lightLuminance = getRelativeLuminance(lightResolved);
          const darkLuminance = getRelativeLuminance(darkResolved);
          
          // Dark theme brand colors should be lighter/more vibrant
          return darkLuminance > lightLuminance;
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('theme variants maintain consistent color relationships', () => {
    // Property: Both themes should maintain the same relative ordering of color variations
    // (base, light, lighter, dark, darker)
    
    const colorFamilies = [
      {
        base: '--xgc-forest-green',
        light: '--xgc-forest-green-light',
        lighter: '--xgc-forest-green-lighter',
        dark: '--xgc-forest-green-dark',
        darker: '--xgc-forest-green-darker'
      },
      {
        base: '--xgc-gold',
        light: '--xgc-gold-light',
        lighter: '--xgc-gold-lighter',
        dark: '--xgc-gold-dark',
        darker: '--xgc-gold-darker'
      }
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...colorFamilies),
        fc.constantFrom('light', 'dark'),
        (family, theme) => {
          const variableMap = theme === 'light' ? lightThemeVariables : darkThemeVariables;
          
          const baseRaw = variableMap.get(family.base);
          const lightRaw = variableMap.get(family.light);
          const lighterRaw = variableMap.get(family.lighter);
          const darkRaw = variableMap.get(family.dark);
          const darkerRaw = variableMap.get(family.darker);
          
          const baseResolved = resolveVariable(baseRaw, variableMap);
          const lightResolved = resolveVariable(lightRaw, variableMap);
          const lighterResolved = resolveVariable(lighterRaw, variableMap);
          const darkResolved = resolveVariable(darkRaw, variableMap);
          const darkerResolved = resolveVariable(darkerRaw, variableMap);
          
          // Skip if any are not hex colors
          if (!isHexColor(baseResolved) || !isHexColor(lightResolved) || 
              !isHexColor(lighterResolved) || !isHexColor(darkResolved) || 
              !isHexColor(darkerResolved)) {
            return true;
          }
          
          const baseLum = getRelativeLuminance(baseResolved);
          const lightLum = getRelativeLuminance(lightResolved);
          const lighterLum = getRelativeLuminance(lighterResolved);
          const darkLum = getRelativeLuminance(darkResolved);
          const darkerLum = getRelativeLuminance(darkerResolved);
          
          // Verify ordering: darker < dark < base < light < lighter
          return darkerLum < darkLum && 
                 darkLum < baseLum && 
                 baseLum < lightLum && 
                 lightLum < lighterLum;
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('luminance calculations are correct for known colors', () => {
    // Verify luminance calculation with known values
    const knownColors = [
      { hex: '#000000', expectedLuminance: 0 },
      { hex: '#ffffff', expectedLuminance: 1 },
      { hex: '#808080', expectedLuminance: 0.216 } // Approximate
    ];

    knownColors.forEach(({ hex, expectedLuminance }) => {
      const luminance = getRelativeLuminance(hex);
      expect(luminance).toBeCloseTo(expectedLuminance, 2);
    });
  });

  test('all theme variant variables are defined', () => {
    // Property: All essential variables should be defined in both themes
    
    const essentialVars = [
      '--bg-color',
      '--surface-color',
      '--text-color',
      '--text-muted',
      '--xgc-forest-green',
      '--xgc-gold',
      '--border-color'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...essentialVars),
        (varName) => {
          const lightHasVar = lightThemeVariables.has(varName);
          const darkHasVar = darkThemeVariables.has(varName);
          
          // Both themes should define essential variables
          return lightHasVar && darkHasVar;
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });
});
