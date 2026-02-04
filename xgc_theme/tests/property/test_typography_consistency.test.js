/**
 * Property-Based Test: Typography Consistency
 * 
 * Feature: oneui-frappe-theme-integration
 * Property 12: Typography Consistency
 * 
 * Tests that text elements within typographic sub-categories have consistent line-height and letter-spacing:
 * - Large headings (h1-h2) have consistent line-height and letter-spacing
 * - Small headings (h3-h6) have consistent line-height and letter-spacing
 * - Body text has consistent line-height and letter-spacing
 * - Code blocks have consistent line-height and letter-spacing
 * - Consistency within ±0.1 for line-height, within ±0.01em for letter-spacing
 * 
 * **Validates: Requirements 12.4**
 */

const fc = require('fast-check');
const fs = require('fs');
const path = require('path');

describe('Property 12: Typography Consistency', () => {
  let cssVariableDefinitions;
  let typographyStyles;

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

    // Extract typography styles for different element categories
    typographyStyles = {
      largeHeadings: [],  // h1-h2
      smallHeadings: [],  // h3-h6
      bodyText: [],
      codeBlocks: []
    };

    // Extract heading styles (h1-h6) and categorize them
    const headingLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    headingLevels.forEach(level => {
      const regex = new RegExp(`${level}[^{]*{([^}]+)}`, 'i');
      const match = componentsCSS.match(regex);
      
      if (match) {
        const styles = match[1];
        const lineHeight = extractStyleValue(styles, 'line-height');
        const letterSpacing = extractStyleValue(styles, 'letter-spacing');
        
        const headingData = {
          element: level,
          lineHeight: resolveValue(lineHeight),
          letterSpacing: resolveValue(letterSpacing)
        };
        
        // Categorize into large (h1-h2) or small (h3-h6) headings
        if (level === 'h1' || level === 'h2') {
          typographyStyles.largeHeadings.push(headingData);
        } else {
          typographyStyles.smallHeadings.push(headingData);
        }
      }
    });

    // Extract body text styles (p, .body-text)
    const bodyRegex = /(?:p|\.body-text)[^{]*{([^}]+)}/gi;
    let bodyMatch;
    while ((bodyMatch = bodyRegex.exec(componentsCSS)) !== null) {
      const styles = bodyMatch[1];
      const lineHeight = extractStyleValue(styles, 'line-height');
      const letterSpacing = extractStyleValue(styles, 'letter-spacing');
      
      typographyStyles.bodyText.push({
        element: 'body',
        lineHeight: resolveValue(lineHeight),
        letterSpacing: resolveValue(letterSpacing)
      });
    }

    // Extract code block styles (code, pre)
    const codeElements = ['code', 'pre'];
    codeElements.forEach(element => {
      const regex = new RegExp(`${element}[^{]*{([^}]+)}`, 'i');
      const match = componentsCSS.match(regex);
      
      if (match) {
        const styles = match[1];
        const lineHeight = extractStyleValue(styles, 'line-height');
        const letterSpacing = extractStyleValue(styles, 'letter-spacing');
        
        typographyStyles.codeBlocks.push({
          element,
          lineHeight: resolveValue(lineHeight),
          letterSpacing: resolveValue(letterSpacing)
        });
      }
    });
  });

  /**
   * Extract a style value from CSS text
   */
  function extractStyleValue(cssText, property) {
    const regex = new RegExp(`${property}:\\s*([^;]+);`, 'i');
    const match = cssText.match(regex);
    return match ? match[1].trim() : null;
  }

  /**
   * Resolve CSS variable or return numeric value
   */
  function resolveValue(value) {
    if (!value) return null;
    
    // Resolve CSS variable
    if (value.startsWith('var(')) {
      const varMatch = value.match(/var\((--[\w-]+)\)/);
      if (varMatch) {
        value = cssVariableDefinitions.get(varMatch[1]);
      }
    }
    
    // Convert to numeric value
    if (typeof value === 'string') {
      // Remove units and parse
      if (value.endsWith('em')) {
        return parseFloat(value);
      } else if (value.endsWith('rem')) {
        return parseFloat(value);
      } else {
        return parseFloat(value);
      }
    }
    
    return value;
  }

  /**
   * Check if values are consistent within tolerance
   */
  function areConsistent(values, tolerance) {
    if (values.length === 0) return true;
    
    const validValues = values.filter(v => v !== null && !isNaN(v));
    if (validValues.length === 0) return true;
    
    const min = Math.min(...validValues);
    const max = Math.max(...validValues);
    
    return (max - min) <= tolerance;
  }

  test('large headings (h1-h2) have consistent line-height (within ±0.1)', () => {
    // Property: Large heading elements (h1-h2) should have consistent line-height values
    
    const lineHeights = typographyStyles.largeHeadings
      .map(h => h.lineHeight)
      .filter(lh => lh !== null);
    
    if (lineHeights.length > 0) {
      const isConsistent = areConsistent(lineHeights, 0.1);
      expect(isConsistent).toBe(true);
      
      const min = Math.min(...lineHeights);
      const max = Math.max(...lineHeights);
      expect(max - min).toBeLessThanOrEqual(0.1);
    }
  });

  test('large headings (h1-h2) have consistent letter-spacing (within ±0.01em)', () => {
    // Property: Large heading elements (h1-h2) should have consistent letter-spacing values
    
    const letterSpacings = typographyStyles.largeHeadings
      .map(h => h.letterSpacing)
      .filter(ls => ls !== null);
    
    if (letterSpacings.length > 0) {
      const isConsistent = areConsistent(letterSpacings, 0.01);
      expect(isConsistent).toBe(true);
    }
  });

  test('small headings (h3-h6) have consistent line-height (within ±0.1)', () => {
    // Property: Small heading elements (h3-h6) should have consistent line-height values
    
    const lineHeights = typographyStyles.smallHeadings
      .map(h => h.lineHeight)
      .filter(lh => lh !== null);
    
    if (lineHeights.length > 0) {
      const isConsistent = areConsistent(lineHeights, 0.1);
      expect(isConsistent).toBe(true);
      
      const min = Math.min(...lineHeights);
      const max = Math.max(...lineHeights);
      expect(max - min).toBeLessThanOrEqual(0.1);
    }
  });

  test('small headings (h3-h6) have consistent letter-spacing (within ±0.01em)', () => {
    // Property: Small heading elements (h3-h6) should have consistent letter-spacing values
    
    const letterSpacings = typographyStyles.smallHeadings
      .map(h => h.letterSpacing)
      .filter(ls => ls !== null);
    
    if (letterSpacings.length > 0) {
      const isConsistent = areConsistent(letterSpacings, 0.01);
      expect(isConsistent).toBe(true);
    }
  });

  test('body text elements have consistent line-height (within ±0.1)', () => {
    // Property: All body text elements should have consistent line-height
    
    const lineHeights = typographyStyles.bodyText
      .map(b => b.lineHeight)
      .filter(lh => lh !== null);
    
    if (lineHeights.length > 0) {
      const isConsistent = areConsistent(lineHeights, 0.1);
      expect(isConsistent).toBe(true);
    }
  });

  test('body text elements have consistent letter-spacing (within ±0.01em)', () => {
    // Property: All body text elements should have consistent letter-spacing
    
    const letterSpacings = typographyStyles.bodyText
      .map(b => b.letterSpacing)
      .filter(ls => ls !== null);
    
    if (letterSpacings.length > 0) {
      const isConsistent = areConsistent(letterSpacings, 0.01);
      expect(isConsistent).toBe(true);
    }
  });

  test('code blocks have consistent line-height (within ±0.1)', () => {
    // Property: All code block elements should have consistent line-height
    
    const lineHeights = typographyStyles.codeBlocks
      .map(c => c.lineHeight)
      .filter(lh => lh !== null);
    
    if (lineHeights.length > 0) {
      const isConsistent = areConsistent(lineHeights, 0.1);
      expect(isConsistent).toBe(true);
    }
  });

  test('code blocks have consistent letter-spacing (within ±0.01em)', () => {
    // Property: All code block elements should have consistent letter-spacing
    
    const letterSpacings = typographyStyles.codeBlocks
      .map(c => c.letterSpacing)
      .filter(ls => ls !== null);
    
    if (letterSpacings.length > 0) {
      const isConsistent = areConsistent(letterSpacings, 0.01);
      expect(isConsistent).toBe(true);
    }
  });

  test('typography sub-categories maintain internal consistency', () => {
    // Property: For any sub-category (large headings, small headings, body, code), 
    // all elements in that sub-category should have consistent line-height and letter-spacing
    
    const categories = ['largeHeadings', 'smallHeadings', 'bodyText', 'codeBlocks'];
    
    fc.assert(
      fc.property(
        fc.constantFrom(...categories),
        (category) => {
          const elements = typographyStyles[category];
          
          if (elements.length === 0) return true;
          
          const lineHeights = elements.map(e => e.lineHeight).filter(v => v !== null);
          const letterSpacings = elements.map(e => e.letterSpacing).filter(v => v !== null);
          
          const lineHeightConsistent = areConsistent(lineHeights, 0.1);
          const letterSpacingConsistent = areConsistent(letterSpacings, 0.01);
          
          return lineHeightConsistent && letterSpacingConsistent;
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('line-height values are within reasonable range (1.0 to 2.0)', () => {
    // Property: All line-height values should be reasonable for readability
    
    const allLineHeights = [
      ...typographyStyles.largeHeadings.map(h => h.lineHeight),
      ...typographyStyles.smallHeadings.map(h => h.lineHeight),
      ...typographyStyles.bodyText.map(b => b.lineHeight),
      ...typographyStyles.codeBlocks.map(c => c.lineHeight)
    ].filter(lh => lh !== null && !isNaN(lh));
    
    fc.assert(
      fc.property(
        fc.constantFrom(...allLineHeights),
        (lineHeight) => {
          return lineHeight >= 1.0 && lineHeight <= 2.0;
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('letter-spacing values are within reasonable range (-0.05em to 0.1em)', () => {
    // Property: All letter-spacing values should be reasonable
    
    const allLetterSpacings = [
      ...typographyStyles.largeHeadings.map(h => h.letterSpacing),
      ...typographyStyles.smallHeadings.map(h => h.letterSpacing),
      ...typographyStyles.bodyText.map(b => b.letterSpacing),
      ...typographyStyles.codeBlocks.map(c => c.letterSpacing)
    ].filter(ls => ls !== null && !isNaN(ls));
    
    if (allLetterSpacings.length > 0) {
      fc.assert(
        fc.property(
          fc.constantFrom(...allLetterSpacings),
          (letterSpacing) => {
            return letterSpacing >= -0.05 && letterSpacing <= 0.1;
          }
        ),
        { 
          numRuns: 100,
          verbose: true
        }
      );
    }
  });

  test('all typography elements have defined line-height', () => {
    // Verify all elements have line-height defined
    const allElements = [
      ...typographyStyles.largeHeadings,
      ...typographyStyles.smallHeadings,
      ...typographyStyles.bodyText,
      ...typographyStyles.codeBlocks
    ];
    
    allElements.forEach(element => {
      expect(element.lineHeight).not.toBeNull();
      expect(element.lineHeight).not.toBeNaN();
    });
  });

  test('heading line-heights use OneUI variables', () => {
    // Verify headings use defined line-height variables
    const expectedLineHeights = [1.25, 1.5, 1.75]; // tight, base, relaxed
    
    const allHeadings = [
      ...typographyStyles.largeHeadings,
      ...typographyStyles.smallHeadings
    ];
    
    allHeadings.forEach(heading => {
      if (heading.lineHeight !== null) {
        const matchesExpected = expectedLineHeights.some(expected => 
          Math.abs(heading.lineHeight - expected) < 0.01
        );
        expect(matchesExpected).toBe(true);
      }
    });
  });

  test('body text uses relaxed line-height for readability', () => {
    // Body text should use relaxed line-height (1.75 or close to it)
    const bodyLineHeights = typographyStyles.bodyText
      .map(b => b.lineHeight)
      .filter(lh => lh !== null);
    
    if (bodyLineHeights.length > 0) {
      bodyLineHeights.forEach(lh => {
        // Should be close to 1.75 (relaxed) or 1.5 (base)
        const isRelaxed = Math.abs(lh - 1.75) < 0.1 || Math.abs(lh - 1.5) < 0.1;
        expect(isRelaxed).toBe(true);
      });
    }
  });

  test('consistency is maintained across all element pairs within sub-categories', () => {
    // Property: For any two elements in the same sub-category, their line-height and
    // letter-spacing should be consistent
    
    const categories = ['largeHeadings', 'smallHeadings', 'bodyText', 'codeBlocks'];
    
    fc.assert(
      fc.property(
        fc.constantFrom(...categories),
        fc.integer({ min: 0, max: 10 }),
        fc.integer({ min: 0, max: 10 }),
        (category, idx1, idx2) => {
          const elements = typographyStyles[category];
          
          if (elements.length < 2) return true;
          
          const i1 = idx1 % elements.length;
          const i2 = idx2 % elements.length;
          
          const el1 = elements[i1];
          const el2 = elements[i2];
          
          // Check line-height consistency
          if (el1.lineHeight !== null && el2.lineHeight !== null) {
            const lhDiff = Math.abs(el1.lineHeight - el2.lineHeight);
            if (lhDiff > 0.1) return false;
          }
          
          // Check letter-spacing consistency
          if (el1.letterSpacing !== null && el2.letterSpacing !== null) {
            const lsDiff = Math.abs(el1.letterSpacing - el2.letterSpacing);
            if (lsDiff > 0.01) return false;
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

  test('typography styles are extracted for all expected elements', () => {
    // Verify we found styles for all expected elements
    expect(typographyStyles.largeHeadings.length).toBeGreaterThan(0);
    expect(typographyStyles.smallHeadings.length).toBeGreaterThan(0);
    expect(typographyStyles.bodyText.length).toBeGreaterThan(0);
    expect(typographyStyles.codeBlocks.length).toBeGreaterThan(0);
    
    // Verify we have correct heading distribution (2 large, 4 small)
    expect(typographyStyles.largeHeadings.length).toBe(2);
    expect(typographyStyles.smallHeadings.length).toBe(4);
  });
});
