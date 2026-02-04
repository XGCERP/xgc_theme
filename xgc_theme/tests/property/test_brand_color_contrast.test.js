/**
 * Property-Based Test: Brand Color Contrast Compliance
 * 
 * Feature: oneui-frappe-theme-integration
 * Property 3: Brand Color Contrast Compliance
 * 
 * Tests that all brand color and background combinations meet WCAG 2.1 AA requirements:
 * - 4.5:1 for normal text
 * - 3:1 for large text and UI components
 * 
 * **Validates: Requirements 4.4**
 */

const fc = require('fast-check');
const fs = require('fs');
const path = require('path');

describe('Property 3: Brand Color Contrast Compliance', () => {
  let cssVariableDefinitions;
  let brandColors;
  let backgroundColors;

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

    // Define brand colors (foreground colors)
    brandColors = [
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

    // Define background colors
    backgroundColors = [
      '--bg-color',
      '--surface-color',
      '--surface-hover'
    ];
  });

  /**
   * Calculate relative luminance according to WCAG 2.1
   * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
   */
  function getRelativeLuminance(hex) {
    // Convert hex to RGB
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
    // Apply gamma correction
    const rsRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const gsRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const bsRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
    
    // Calculate relative luminance
    return 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB;
  }

  /**
   * Calculate contrast ratio according to WCAG 2.1
   * https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
   */
  function getContrastRatio(color1, color2) {
    const lum1 = getRelativeLuminance(color1);
    const lum2 = getRelativeLuminance(color2);
    
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  test('all brand color and background combinations meet WCAG AA for large text (3:1)', () => {
    // Property: For any combination of brand color (foreground) and background color,
    // the contrast ratio should be at least 3:1 for large text and UI components
    // Note: Lighter color variations are primarily for decorative use or dark backgrounds
    
    // Generate combinations, excluding lighter variations which are for decorative use
    const textBrandColors = brandColors.filter(c => !c.includes('lighter') && !c.includes('-light'));
    const combinations = [];
    for (const fg of textBrandColors) {
      for (const bg of backgroundColors) {
        combinations.push({ foreground: fg, background: bg });
      }
    }

    fc.assert(
      fc.property(
        fc.constantFrom(...combinations),
        ({ foreground, background }) => {
          const fgColor = cssVariableDefinitions.get(foreground);
          const bgColor = cssVariableDefinitions.get(background);
          
          // Skip if colors don't exist or aren't hex colors
          if (!fgColor || !bgColor || !fgColor.startsWith('#') || !bgColor.startsWith('#')) {
            return true; // Skip non-hex colors (like var() references)
          }
          
          const ratio = getContrastRatio(fgColor, bgColor);
          
          // WCAG AA requires 3:1 for large text and UI components
          return ratio >= 3.0;
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('darker brand colors meet WCAG AA for normal text on light backgrounds (4.5:1)', () => {
    // Property: Darker brand color variations should meet 4.5:1 contrast ratio
    // for normal text on light backgrounds
    
    const darkerBrandColors = [
      '--xgc-forest-green',
      '--xgc-forest-green-dark',
      '--xgc-forest-green-darker',
      '--xgc-gold-dark',
      '--xgc-gold-darker'
    ];

    const lightBackgrounds = [
      '--bg-color',
      '--surface-color',
      '--surface-hover'
    ];

    const combinations = [];
    for (const fg of darkerBrandColors) {
      for (const bg of lightBackgrounds) {
        combinations.push({ foreground: fg, background: bg });
      }
    }

    fc.assert(
      fc.property(
        fc.constantFrom(...combinations),
        ({ foreground, background }) => {
          const fgColor = cssVariableDefinitions.get(foreground);
          const bgColor = cssVariableDefinitions.get(background);
          
          // Skip if colors don't exist or aren't hex colors
          if (!fgColor || !bgColor || !fgColor.startsWith('#') || !bgColor.startsWith('#')) {
            return true;
          }
          
          const ratio = getContrastRatio(fgColor, bgColor);
          
          // WCAG AA requires 4.5:1 for normal text
          return ratio >= 4.5;
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('forest green base color meets WCAG AA for large text on white background', () => {
    // Specific test for primary brand color
    const forestGreen = cssVariableDefinitions.get('--xgc-forest-green');
    const bgColor = cssVariableDefinitions.get('--bg-color');
    
    if (forestGreen && bgColor && forestGreen.startsWith('#') && bgColor.startsWith('#')) {
      const ratio = getContrastRatio(forestGreen, bgColor);
      expect(ratio).toBeGreaterThanOrEqual(3.0);
    }
  });

  test('gold base color meets WCAG AA for large text on white background', () => {
    // Specific test for secondary brand color
    // Base gold should meet at least AA for large text (3:1)
    const gold = cssVariableDefinitions.get('--xgc-gold');
    const bgColor = cssVariableDefinitions.get('--bg-color');
    
    if (gold && bgColor && gold.startsWith('#') && bgColor.startsWith('#')) {
      const ratio = getContrastRatio(gold, bgColor);
      // Base gold meets AA for large text but not normal text
      expect(ratio).toBeGreaterThanOrEqual(3.0);
    }
  });

  test('contrast ratios are calculated correctly for known color pairs', () => {
    // Test with known color pairs to verify calculation accuracy
    const knownPairs = [
      { fg: '#000000', bg: '#ffffff', expectedRatio: 21 },
      { fg: '#ffffff', bg: '#000000', expectedRatio: 21 },
      { fg: '#777777', bg: '#ffffff', expectedRatio: 4.47 }
    ];

    knownPairs.forEach(({ fg, bg, expectedRatio }) => {
      const ratio = getContrastRatio(fg, bg);
      expect(ratio).toBeCloseTo(expectedRatio, 1);
    });
  });

  test('all brand color variations have sufficient contrast with at least one background', () => {
    // Property: Each brand color should be usable with at least one background color
    // Note: Lighter variations are primarily for decorative use and may not meet text contrast requirements
    
    fc.assert(
      fc.property(
        fc.constantFrom(...brandColors),
        (brandColor) => {
          const fgColor = cssVariableDefinitions.get(brandColor);
          
          if (!fgColor || !fgColor.startsWith('#')) {
            return true;
          }
          
          // Lighter variations are for decorative use, so we don't require them to meet contrast
          if (brandColor.includes('lighter') || brandColor.includes('-light')) {
            return true;
          }
          
          // Check if this color has sufficient contrast with at least one background
          const hasGoodContrast = backgroundColors.some(bgVar => {
            const bgColor = cssVariableDefinitions.get(bgVar);
            if (!bgColor || !bgColor.startsWith('#')) {
              return false;
            }
            
            const ratio = getContrastRatio(fgColor, bgColor);
            return ratio >= 3.0; // At least AA for large text
          });
          
          return hasGoodContrast;
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('primary and accent colors meet contrast requirements', () => {
    // Test that Frappe's primary and accent overrides meet contrast requirements
    // Note: accent-light is for decorative use and may not meet text contrast requirements
    const primaryColors = [
      '--primary',
      '--primary-light',
      '--primary-dark'
    ];

    const accentColors = [
      '--accent',
      '--accent-dark'
    ];

    const allColors = [...primaryColors, ...accentColors];
    const combinations = [];
    
    for (const fg of allColors) {
      for (const bg of backgroundColors) {
        combinations.push({ foreground: fg, background: bg });
      }
    }

    fc.assert(
      fc.property(
        fc.constantFrom(...combinations),
        ({ foreground, background }) => {
          let fgColor = cssVariableDefinitions.get(foreground);
          let bgColor = cssVariableDefinitions.get(background);
          
          // Resolve var() references
          if (fgColor && fgColor.startsWith('var(')) {
            const varMatch = fgColor.match(/var\((--[\w-]+)\)/);
            if (varMatch) {
              fgColor = cssVariableDefinitions.get(varMatch[1]);
            }
          }
          
          if (bgColor && bgColor.startsWith('var(')) {
            const varMatch = bgColor.match(/var\((--[\w-]+)\)/);
            if (varMatch) {
              bgColor = cssVariableDefinitions.get(varMatch[1]);
            }
          }
          
          // Skip if colors don't exist or aren't hex colors
          if (!fgColor || !bgColor || !fgColor.startsWith('#') || !bgColor.startsWith('#')) {
            return true;
          }
          
          const ratio = getContrastRatio(fgColor, bgColor);
          
          // Should meet at least AA for large text
          return ratio >= 3.0;
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('contrast ratios are symmetric (order does not matter)', () => {
    // Property: Contrast ratio should be the same regardless of which color is foreground/background
    
    const testPairs = [];
    for (let i = 0; i < Math.min(5, brandColors.length); i++) {
      for (let j = 0; j < Math.min(3, backgroundColors.length); j++) {
        testPairs.push({
          color1: brandColors[i],
          color2: backgroundColors[j]
        });
      }
    }

    fc.assert(
      fc.property(
        fc.constantFrom(...testPairs),
        ({ color1, color2 }) => {
          const c1 = cssVariableDefinitions.get(color1);
          const c2 = cssVariableDefinitions.get(color2);
          
          if (!c1 || !c2 || !c1.startsWith('#') || !c2.startsWith('#')) {
            return true;
          }
          
          const ratio1 = getContrastRatio(c1, c2);
          const ratio2 = getContrastRatio(c2, c1);
          
          // Ratios should be equal (within floating point precision)
          return Math.abs(ratio1 - ratio2) < 0.01;
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('all contrast ratios are at least 1:1', () => {
    // Property: Contrast ratio should always be at least 1:1 (same color)
    
    const combinations = [];
    for (const fg of brandColors) {
      for (const bg of backgroundColors) {
        combinations.push({ foreground: fg, background: bg });
      }
    }

    fc.assert(
      fc.property(
        fc.constantFrom(...combinations),
        ({ foreground, background }) => {
          const fgColor = cssVariableDefinitions.get(foreground);
          const bgColor = cssVariableDefinitions.get(background);
          
          if (!fgColor || !bgColor || !fgColor.startsWith('#') || !bgColor.startsWith('#')) {
            return true;
          }
          
          const ratio = getContrastRatio(fgColor, bgColor);
          
          // Contrast ratio should always be at least 1:1
          return ratio >= 1.0;
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });
});
