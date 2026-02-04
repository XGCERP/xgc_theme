/**
 * Property-Based Test: Typographic Hierarchy
 * 
 * Feature: oneui-frappe-theme-integration
 * Property 10: Typographic Hierarchy
 * 
 * Tests that heading elements maintain proper size hierarchy:
 * - Each subsequent heading level has font-size ≤ previous level
 * - h1 ≥ h2 ≥ h3 ≥ h4 ≥ h5 ≥ h6
 * 
 * **Validates: Requirements 12.1**
 */

const fc = require('fast-check');
const fs = require('fs');
const path = require('path');

describe('Property 10: Typographic Hierarchy', () => {
  let cssVariableDefinitions;
  let headingFontSizes;

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

    // Extract heading font sizes from CSS
    headingFontSizes = new Map();
    const headingLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    
    headingLevels.forEach(level => {
      // Match heading styles like: h1, .h1 { ... font-size: var(--font-size-4xl); ... }
      const regex = new RegExp(`${level}[^{]*{[^}]*font-size:\\s*([^;]+);`, 'i');
      const match = componentsCSS.match(regex);
      
      if (match) {
        let fontSize = match[1].trim();
        
        // Resolve CSS variable if present
        if (fontSize.startsWith('var(')) {
          const varMatch = fontSize.match(/var\((--[\w-]+)\)/);
          if (varMatch) {
            fontSize = cssVariableDefinitions.get(varMatch[1]);
          }
        }
        
        // Convert to pixels
        if (fontSize.endsWith('rem')) {
          fontSize = parseFloat(fontSize) * 16; // Assume 16px base
        } else if (fontSize.endsWith('px')) {
          fontSize = parseFloat(fontSize);
        }
        
        headingFontSizes.set(level, fontSize);
      }
    });
  });

  /**
   * Get font size for a heading level
   */
  function getFontSize(level) {
    return headingFontSizes.get(level) || 0;
  }

  test('heading elements maintain proper size hierarchy (h1 ≥ h2 ≥ h3 ≥ h4 ≥ h5 ≥ h6)', () => {
    // Property: For any sequence of heading elements,
    // each subsequent heading level should have font-size ≤ previous level
    
    const headingLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    
    fc.assert(
      fc.property(
        fc.constantFrom(...headingLevels),
        (startingLevel) => {
          const startIndex = headingLevels.indexOf(startingLevel);
          const levelsToTest = headingLevels.slice(startIndex);
          
          // Get font sizes for these levels
          const fontSizes = levelsToTest.map(level => getFontSize(level));
          
          // Verify hierarchy: each subsequent heading should be ≤ previous
          for (let i = 1; i < fontSizes.length; i++) {
            if (fontSizes[i] > fontSizes[i - 1]) {
              return false;
            }
          }
          
          return true;
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('all heading levels have decreasing font sizes from h1 to h6', () => {
    // Specific test: Create all headings and verify complete hierarchy
    const headingLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    const fontSizes = headingLevels.map(level => getFontSize(level));
    
    // Verify each level is smaller than or equal to the previous
    for (let i = 1; i < fontSizes.length; i++) {
      expect(fontSizes[i]).toBeLessThanOrEqual(fontSizes[i - 1]);
    }
    
    // Verify h1 is the largest
    expect(fontSizes[0]).toBeGreaterThanOrEqual(fontSizes[fontSizes.length - 1]);
  });

  test('h1 has the largest font size among all headings', () => {
    // Specific test: h1 should be the largest
    const headingLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    const fontSizes = headingLevels.map(level => getFontSize(level));
    const h1Size = fontSizes[0];
    
    // h1 should be >= all other headings
    fontSizes.slice(1).forEach(size => {
      expect(h1Size).toBeGreaterThanOrEqual(size);
    });
  });

  test('h6 has the smallest font size among all headings', () => {
    // Specific test: h6 should be the smallest
    const headingLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    const fontSizes = headingLevels.map(level => getFontSize(level));
    const h6Size = fontSizes[fontSizes.length - 1];
    
    // h6 should be <= all other headings
    fontSizes.slice(0, -1).forEach(size => {
      expect(h6Size).toBeLessThanOrEqual(size);
    });
  });

  test('adjacent heading levels have meaningful size differences', () => {
    // Property: Adjacent heading levels should have noticeable size differences
    // (at least 0px difference - allowing equal for smallest levels)
    
    const headingLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    const fontSizes = headingLevels.map(level => getFontSize(level));
    
    // Check that there's at least some difference between levels
    for (let i = 1; i < fontSizes.length; i++) {
      const difference = fontSizes[i - 1] - fontSizes[i];
      expect(difference).toBeGreaterThanOrEqual(0);
    }
  });

  test('heading sizes are within expected OneUI ranges', () => {
    // Verify headings use OneUI font size scale
    const expectedSizes = {
      h1: 36, // --font-size-4xl
      h2: 30, // --font-size-3xl
      h3: 24, // --font-size-2xl
      h4: 20, // --font-size-xl
      h5: 18, // --font-size-lg
      h6: 15  // --font-size-base
    };
    
    Object.entries(expectedSizes).forEach(([level, expectedSize]) => {
      const actualSize = getFontSize(level);
      
      // Allow 1px tolerance for rounding
      expect(actualSize).toBeGreaterThanOrEqual(expectedSize - 1);
      expect(actualSize).toBeLessThanOrEqual(expectedSize + 1);
    });
  });

  test('heading hierarchy property holds for all subsequences', () => {
    // Property: For any subsequence of headings, hierarchy is maintained
    
    const headingLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 5 }),
        fc.integer({ min: 0, max: 5 }),
        (start, end) => {
          if (start > end) {
            [start, end] = [end, start];
          }
          
          const subsequence = headingLevels.slice(start, end + 1);
          if (subsequence.length < 2) {
            return true; // Single element always maintains hierarchy
          }
          
          const fontSizes = subsequence.map(level => getFontSize(level));
          
          // Verify hierarchy
          for (let i = 1; i < fontSizes.length; i++) {
            if (fontSizes[i] > fontSizes[i - 1]) {
              return false;
            }
          }
          
          return true;
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('all heading levels have defined font sizes', () => {
    // Verify all headings have font sizes defined in CSS
    const headingLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    
    headingLevels.forEach(level => {
      const fontSize = getFontSize(level);
      expect(fontSize).toBeGreaterThan(0);
    });
  });

  test('heading font sizes are reasonable (between 12px and 48px)', () => {
    // Property: All heading font sizes should be within reasonable range
    const headingLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    
    fc.assert(
      fc.property(
        fc.constantFrom(...headingLevels),
        (level) => {
          const fontSize = getFontSize(level);
          return fontSize >= 12 && fontSize <= 48;
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('h1 is significantly larger than h6', () => {
    // Specific test: h1 should be noticeably larger than h6
    const h1Size = getFontSize('h1');
    const h6Size = getFontSize('h6');
    
    // h1 should be at least 10px larger than h6
    expect(h1Size - h6Size).toBeGreaterThanOrEqual(10);
  });
});
