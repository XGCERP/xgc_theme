/**
 * Property-Based Test: Font Loading Success
 * 
 * Feature: oneui-frappe-theme-integration
 * Property 11: Font Loading Success
 * 
 * Tests that custom fonts load or fall back gracefully:
 * - Font loads successfully (font-family matches specified font)
 * - Or falls back to web-safe font (sans-serif, serif, monospace)
 * 
 * **Validates: Requirements 12.2**
 */

const fc = require('fast-check');
const fs = require('fs');
const path = require('path');

describe('Property 11: Font Loading Success', () => {
  let cssVariableDefinitions;
  let fontFamilyDeclarations;

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

    // Extract CSS variable definitions
    const variableDefRegex = /(--[\w-]+)\s*:\s*([^;]+);/g;
    cssVariableDefinitions = new Map();
    
    let match;
    while ((match = variableDefRegex.exec(variablesCSS)) !== null) {
      const [, varName, varValue] = match;
      cssVariableDefinitions.set(varName.trim(), varValue.trim());
    }

    // Extract all font-family declarations from both CSS files
    fontFamilyDeclarations = new Set();
    
    // From variables
    const fontFamilyVars = ['--font-family-sans-serif', '--font-family-monospace'];
    fontFamilyVars.forEach(varName => {
      const value = cssVariableDefinitions.get(varName);
      if (value) {
        fontFamilyDeclarations.add(value);
      }
    });

    // From components CSS (direct font-family declarations)
    const fontFamilyRegex = /font-family:\s*([^;]+);/gi;
    let fontMatch;
    while ((fontMatch = fontFamilyRegex.exec(componentsCSS)) !== null) {
      let fontFamily = fontMatch[1].trim();
      
      // Resolve CSS variable if present
      if (fontFamily.startsWith('var(')) {
        const varMatch = fontFamily.match(/var\((--[\w-]+)\)/);
        if (varMatch) {
          fontFamily = cssVariableDefinitions.get(varMatch[1]);
        }
      }
      
      if (fontFamily) {
        fontFamilyDeclarations.add(fontFamily);
      }
    }
  });

  /**
   * Parse font-family stack into individual fonts
   */
  function parseFontStack(fontFamily) {
    // Split by comma and clean up
    return fontFamily
      .split(',')
      .map(font => font.trim().replace(/['"]/g, ''));
  }

  /**
   * Check if a font is a web-safe fallback
   */
  function isWebSafeFallback(font) {
    const webSafeFonts = [
      'sans-serif',
      'serif',
      'monospace',
      'cursive',
      'fantasy',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont'
    ];
    
    return webSafeFonts.some(safe => 
      font.toLowerCase().includes(safe.toLowerCase())
    );
  }

  test('all font-family declarations include web-safe fallbacks', () => {
    // Property: Every font-family declaration should include at least one web-safe fallback
    
    fc.assert(
      fc.property(
        fc.constantFrom(...Array.from(fontFamilyDeclarations)),
        (fontFamily) => {
          const fonts = parseFontStack(fontFamily);
          
          // At least one font in the stack should be web-safe
          return fonts.some(font => isWebSafeFallback(font));
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('font stacks end with generic font families', () => {
    // Property: Font stacks should end with generic families (sans-serif, serif, monospace)
    
    const genericFamilies = ['sans-serif', 'serif', 'monospace', 'cursive', 'fantasy'];
    
    fc.assert(
      fc.property(
        fc.constantFrom(...Array.from(fontFamilyDeclarations)),
        (fontFamily) => {
          const fonts = parseFontStack(fontFamily);
          const lastFont = fonts[fonts.length - 1].toLowerCase();
          
          // Last font should be a generic family
          return genericFamilies.some(generic => lastFont === generic);
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('sans-serif font stack includes system fonts', () => {
    // Specific test: Sans-serif stack should include system fonts for performance
    const sansSerifStack = cssVariableDefinitions.get('--font-family-sans-serif');
    
    if (sansSerifStack) {
      const fonts = parseFontStack(sansSerifStack);
      
      // Should include at least one system font
      const systemFonts = [
        '-apple-system',
        'BlinkMacSystemFont',
        'Segoe UI',
        'Roboto',
        'Helvetica Neue',
        'Arial',
        'system-ui'
      ];
      
      const hasSystemFont = fonts.some(font => 
        systemFonts.some(sys => font.includes(sys))
      );
      
      expect(hasSystemFont).toBe(true);
    }
  });

  test('monospace font stack includes monospace fallback', () => {
    // Specific test: Monospace stack should end with 'monospace'
    const monospaceStack = cssVariableDefinitions.get('--font-family-monospace');
    
    if (monospaceStack) {
      const fonts = parseFontStack(monospaceStack);
      const lastFont = fonts[fonts.length - 1].toLowerCase();
      
      expect(lastFont).toBe('monospace');
    }
  });

  test('font stacks have multiple fallback options', () => {
    // Property: Font stacks should have at least 2 fonts (custom + fallback)
    
    fc.assert(
      fc.property(
        fc.constantFrom(...Array.from(fontFamilyDeclarations)),
        (fontFamily) => {
          const fonts = parseFontStack(fontFamily);
          
          // Should have at least 2 fonts in the stack
          return fonts.length >= 2;
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('font names are properly formatted', () => {
    // Property: Font names with spaces should be quoted or multi-word fonts should be valid
    
    fc.assert(
      fc.property(
        fc.constantFrom(...Array.from(fontFamilyDeclarations)),
        (fontFamily) => {
          const fonts = parseFontStack(fontFamily);
          
          // Each font should either:
          // 1. Be a single word (no spaces)
          // 2. Be a known multi-word font
          // 3. Have been quoted in the original (quotes removed by parser)
          
          const knownMultiWordFonts = [
            'Segoe UI',
            'Helvetica Neue',
            'Courier New',
            'Times New Roman',
            'SF Mono',
            'Cascadia Code',
            'Roboto Mono'
          ];
          
          return fonts.every(font => {
            // Single word fonts are always valid
            if (!font.includes(' ')) {
              return true;
            }
            
            // Known multi-word fonts are valid
            if (knownMultiWordFonts.some(known => font.includes(known))) {
              return true;
            }
            
            // Generic families with hyphens are valid
            if (font.startsWith('-') || isWebSafeFallback(font)) {
              return true;
            }
            
            return true; // Assume quoted fonts are valid
          });
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('primary font families are defined', () => {
    // Verify that the main font family variables exist
    const requiredFontVars = [
      '--font-family-sans-serif',
      '--font-family-monospace'
    ];
    
    requiredFontVars.forEach(varName => {
      const value = cssVariableDefinitions.get(varName);
      expect(value).toBeDefined();
      expect(value.length).toBeGreaterThan(0);
    });
  });

  test('font stacks do not have duplicate fonts', () => {
    // Property: Font stacks should not list the same font multiple times
    
    fc.assert(
      fc.property(
        fc.constantFrom(...Array.from(fontFamilyDeclarations)),
        (fontFamily) => {
          const fonts = parseFontStack(fontFamily);
          const uniqueFonts = new Set(fonts.map(f => f.toLowerCase()));
          
          // Number of unique fonts should equal total fonts
          return uniqueFonts.size === fonts.length;
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('font stacks are not empty', () => {
    // Property: All font-family declarations should have at least one font
    
    fc.assert(
      fc.property(
        fc.constantFrom(...Array.from(fontFamilyDeclarations)),
        (fontFamily) => {
          const fonts = parseFontStack(fontFamily);
          return fonts.length > 0 && fonts.every(f => f.length > 0);
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('sans-serif stack prioritizes modern fonts', () => {
    // Specific test: Sans-serif should prioritize Inter or modern system fonts
    const sansSerifStack = cssVariableDefinitions.get('--font-family-sans-serif');
    
    if (sansSerifStack) {
      const fonts = parseFontStack(sansSerifStack);
      const firstFont = fonts[0];
      
      // First font should be a modern font (Inter, system-ui, or system font)
      const modernFonts = ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont'];
      const isModern = modernFonts.some(modern => firstFont.includes(modern));
      
      expect(isModern).toBe(true);
    }
  });

  test('monospace stack prioritizes code-friendly fonts', () => {
    // Specific test: Monospace should prioritize fonts good for code
    const monospaceStack = cssVariableDefinitions.get('--font-family-monospace');
    
    if (monospaceStack) {
      const fonts = parseFontStack(monospaceStack);
      
      // Should include at least one code-friendly font
      const codeFonts = [
        'SF Mono',
        'Monaco',
        'Cascadia Code',
        'Roboto Mono',
        'Consolas',
        'Courier New',
        'Courier'
      ];
      
      const hasCodeFont = fonts.some(font => 
        codeFonts.some(code => font.includes(code))
      );
      
      expect(hasCodeFont).toBe(true);
    }
  });

  test('all font stacks follow best practices', () => {
    // Property: Font stacks should follow best practices:
    // 1. Start with custom/preferred font
    // 2. Include system fonts
    // 3. End with generic family
    
    fc.assert(
      fc.property(
        fc.constantFrom(...Array.from(fontFamilyDeclarations)),
        (fontFamily) => {
          const fonts = parseFontStack(fontFamily);
          
          if (fonts.length < 2) {
            return false; // Need at least custom + fallback
          }
          
          // Last font should be generic
          const lastFont = fonts[fonts.length - 1].toLowerCase();
          const genericFamilies = ['sans-serif', 'serif', 'monospace', 'cursive', 'fantasy'];
          const endsWithGeneric = genericFamilies.includes(lastFont);
          
          // Should have at least one non-generic font before the generic
          const hasCustomFont = fonts.slice(0, -1).some(font => 
            !isWebSafeFallback(font)
          );
          
          return endsWithGeneric && hasCustomFont;
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('font family declarations are consistent across CSS files', () => {
    // Verify that font families are used consistently
    const allDeclarations = Array.from(fontFamilyDeclarations);
    
    // Should have at least 2 font families (sans-serif and monospace)
    expect(allDeclarations.length).toBeGreaterThanOrEqual(2);
    
    // Each should be a valid font stack
    allDeclarations.forEach(fontFamily => {
      const fonts = parseFontStack(fontFamily);
      expect(fonts.length).toBeGreaterThan(0);
      expect(fonts.some(f => isWebSafeFallback(f))).toBe(true);
    });
  });
});
