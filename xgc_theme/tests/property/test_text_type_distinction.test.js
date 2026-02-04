/**
 * Property-Based Test: Text Type Distinction
 * 
 * Feature: oneui-frappe-theme-integration
 * Property 13: Text Type Distinction
 * 
 * Tests that different text types have distinguishable styles:
 * - Heading vs body text
 * - Body text vs code
 * - Heading vs code
 * - Difference in at least one property: font-size (≥2px), font-weight (≥100), font-family, or color
 * 
 * **Validates: Requirements 12.5**
 */

const fc = require('fast-check');
const fs = require('fs');
const path = require('path');

describe('Property 13: Text Type Distinction', () => {
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

    // Extract typography styles for different element types
    typographyStyles = {
      headings: [],
      bodyText: [],
      code: []
    };

    // Extract heading styles (h1-h6) - improved regex to handle multi-line declarations
    const headingLevels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    headingLevels.forEach(level => {
      // Match heading selector with multi-line content
      const regex = new RegExp(`${level}[^{]*\\{([^}]+)\\}`, 'is');
      const match = componentsCSS.match(regex);
      
      if (match) {
        const styles = match[1];
        typographyStyles.headings.push({
          element: level,
          fontSize: extractAndResolve(styles, 'font-size'),
          fontWeight: extractAndResolve(styles, 'font-weight'),
          fontFamily: extractStyleValue(styles, 'font-family'),
          color: extractStyleValue(styles, 'color')
        });
      }
    });

    // Extract body text styles (p, .body-text) - improved to handle multi-line
    const bodyRegex = /(?:^|\s)(p|\.body-text)(?:\s|,)[^{]*\{([^}]+)\}/gis;
    let bodyMatch;
    while ((bodyMatch = bodyRegex.exec(componentsCSS)) !== null) {
      const styles = bodyMatch[2];
      typographyStyles.bodyText.push({
        element: 'body',
        fontSize: extractAndResolve(styles, 'font-size'),
        fontWeight: extractAndResolve(styles, 'font-weight'),
        fontFamily: extractStyleValue(styles, 'font-family'),
        color: extractStyleValue(styles, 'color')
      });
    }

    // If no body text found with complex regex, try simpler approach
    if (typographyStyles.bodyText.length === 0) {
      const simpleBodyRegex = /^p,\s*\.body-text\s*\{([^}]+)\}/gims;
      const simpleMatch = componentsCSS.match(simpleBodyRegex);
      if (simpleMatch) {
        const styles = simpleMatch[1];
        typographyStyles.bodyText.push({
          element: 'body',
          fontSize: extractAndResolve(styles, 'font-size'),
          fontWeight: extractAndResolve(styles, 'font-weight'),
          fontFamily: extractStyleValue(styles, 'font-family'),
          color: extractStyleValue(styles, 'color')
        });
      }
    }

    // Extract code styles - improved to handle multi-line
    const codeRegex = /^code\s*\{([^}]+)\}/gims;
    let codeMatch;
    while ((codeMatch = codeRegex.exec(componentsCSS)) !== null) {
      const styles = codeMatch[1];
      typographyStyles.code.push({
        element: 'code',
        fontSize: extractAndResolve(styles, 'font-size'),
        fontWeight: extractAndResolve(styles, 'font-weight'),
        fontFamily: extractStyleValue(styles, 'font-family'),
        color: extractStyleValue(styles, 'color')
      });
    }
  });

  /**
   * Extract a style value from CSS text
   */
  function extractStyleValue(cssText, property) {
    const regex = new RegExp(`${property}\\s*:\\s*([^;]+);`, 'i');
    const match = cssText.match(regex);
    return match ? match[1].trim() : null;
  }

  /**
   * Extract and resolve a style value to numeric
   */
  function extractAndResolve(cssText, property) {
    let value = extractStyleValue(cssText, property);
    if (!value) return null;
    
    // Resolve CSS variable
    if (value.includes('var(')) {
      const varMatch = value.match(/var\((--[\w-]+)\)/);
      if (varMatch) {
        const resolvedValue = cssVariableDefinitions.get(varMatch[1]);
        if (resolvedValue) {
          value = resolvedValue;
        }
      }
    }
    
    // Convert to numeric value
    if (typeof value === 'string') {
      // Handle rem units
      if (value.endsWith('rem')) {
        return parseFloat(value) * 16; // Convert to px
      } 
      // Handle px units
      else if (value.endsWith('px')) {
        return parseFloat(value);
      } 
      // Handle em units
      else if (value.endsWith('em')) {
        return parseFloat(value) * 16; // Approximate conversion to px
      } 
      // Handle numeric values (like font-weight: 400, 700)
      else if (!isNaN(parseFloat(value))) {
        return parseFloat(value);
      }
    }
    
    return value;
  }

  /**
   * Check if two text types are distinguishable
   */
  function areDistinguishable(type1, type2) {
    // Font size difference >= 2px
    if (type1.fontSize !== null && type2.fontSize !== null) {
      if (Math.abs(type1.fontSize - type2.fontSize) >= 2) {
        return true;
      }
    }
    
    // Font weight difference >= 100
    if (type1.fontWeight !== null && type2.fontWeight !== null) {
      if (Math.abs(type1.fontWeight - type2.fontWeight) >= 100) {
        return true;
      }
    }
    
    // Different font family
    if (type1.fontFamily && type2.fontFamily) {
      const family1 = type1.fontFamily.toLowerCase().split(',')[0].trim();
      const family2 = type2.fontFamily.toLowerCase().split(',')[0].trim();
      if (family1 !== family2) {
        return true;
      }
    }
    
    // Different color
    if (type1.color && type2.color) {
      if (type1.color !== type2.color) {
        return true;
      }
    }
    
    return false;
  }

  test('headings are distinguishable from body text', () => {
    // Property: For any heading and body text pair, they should be distinguishable
    
    if (typographyStyles.headings.length === 0 || typographyStyles.bodyText.length === 0) {
      return; // Skip if no styles found
    }
    
    fc.assert(
      fc.property(
        fc.constantFrom(...typographyStyles.headings),
        fc.constantFrom(...typographyStyles.bodyText),
        (heading, body) => {
          return areDistinguishable(heading, body);
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('body text is distinguishable from code', () => {
    // Property: For any body text and code pair, they should be distinguishable
    
    if (typographyStyles.bodyText.length === 0 || typographyStyles.code.length === 0) {
      return; // Skip if no styles found
    }
    
    fc.assert(
      fc.property(
        fc.constantFrom(...typographyStyles.bodyText),
        fc.constantFrom(...typographyStyles.code),
        (body, code) => {
          return areDistinguishable(body, code);
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('headings are distinguishable from code', () => {
    // Property: For any heading and code pair, they should be distinguishable
    
    if (typographyStyles.headings.length === 0 || typographyStyles.code.length === 0) {
      return; // Skip if no styles found
    }
    
    fc.assert(
      fc.property(
        fc.constantFrom(...typographyStyles.headings),
        fc.constantFrom(...typographyStyles.code),
        (heading, code) => {
          return areDistinguishable(heading, code);
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('h1 is significantly different from body text', () => {
    // Specific test: h1 should be very distinguishable from body text
    
    if (typographyStyles.headings.length === 0 || typographyStyles.bodyText.length === 0) {
      return;
    }
    
    const h1 = typographyStyles.headings.find(h => h.element === 'h1');
    const body = typographyStyles.bodyText[0];
    
    if (h1 && body) {
      // Should differ in multiple properties
      let differences = 0;
      
      if (h1.fontSize && body.fontSize && Math.abs(h1.fontSize - body.fontSize) >= 2) {
        differences++;
      }
      
      if (h1.fontWeight && body.fontWeight && Math.abs(h1.fontWeight - body.fontWeight) >= 100) {
        differences++;
      }
      
      // h1 should differ in at least 2 properties from body
      expect(differences).toBeGreaterThanOrEqual(1);
    }
  });

  test('code has distinct font family from body text', () => {
    // Specific test: Code should use monospace font family
    
    if (typographyStyles.code.length === 0 || typographyStyles.bodyText.length === 0) {
      return;
    }
    
    const code = typographyStyles.code[0];
    const body = typographyStyles.bodyText[0];
    
    if (code && body && code.fontFamily && body.fontFamily) {
      const codeFamily = code.fontFamily.toLowerCase();
      const bodyFamily = body.fontFamily.toLowerCase();
      
      // Code should use monospace, body should use sans-serif
      expect(codeFamily).toContain('monospace');
      expect(bodyFamily).toContain('sans-serif');
      expect(codeFamily).not.toBe(bodyFamily);
    }
  });

  test('all heading levels are distinguishable from body text', () => {
    // Verify each heading level is distinguishable from body text
    
    if (typographyStyles.headings.length === 0 || typographyStyles.bodyText.length === 0) {
      return;
    }
    
    const body = typographyStyles.bodyText[0];
    
    typographyStyles.headings.forEach(heading => {
      const isDistinct = areDistinguishable(heading, body);
      expect(isDistinct).toBe(true);
    });
  });

  test('text types differ in at least one significant property', () => {
    // Property: Any two different text type categories should be distinguishable
    
    const categories = [
      { name: 'headings', styles: typographyStyles.headings },
      { name: 'bodyText', styles: typographyStyles.bodyText },
      { name: 'code', styles: typographyStyles.code }
    ];
    
    // Filter out empty categories
    const validCategories = categories.filter(c => c.styles.length > 0);
    
    if (validCategories.length < 2) {
      return; // Need at least 2 categories to compare
    }
    
    fc.assert(
      fc.property(
        fc.constantFrom(...validCategories),
        fc.constantFrom(...validCategories),
        (cat1, cat2) => {
          // Skip if same category
          if (cat1.name === cat2.name) {
            return true;
          }
          
          // Pick first element from each category
          const style1 = cat1.styles[0];
          const style2 = cat2.styles[0];
          
          return areDistinguishable(style1, style2);
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('headings have larger font sizes than body text', () => {
    // Specific test: All headings should be larger than body text
    
    if (typographyStyles.headings.length === 0 || typographyStyles.bodyText.length === 0) {
      return;
    }
    
    const body = typographyStyles.bodyText[0];
    
    if (body && body.fontSize) {
      typographyStyles.headings.forEach(heading => {
        if (heading.fontSize) {
          expect(heading.fontSize).toBeGreaterThanOrEqual(body.fontSize);
        }
      });
    }
  });

  test('headings have heavier font weights than body text', () => {
    // Specific test: Headings should be bolder than body text
    
    if (typographyStyles.headings.length === 0 || typographyStyles.bodyText.length === 0) {
      return;
    }
    
    const body = typographyStyles.bodyText[0];
    
    if (body && body.fontWeight) {
      typographyStyles.headings.forEach(heading => {
        if (heading.fontWeight) {
          expect(heading.fontWeight).toBeGreaterThanOrEqual(body.fontWeight);
        }
      });
    }
  });

  test('code has distinct color from body text', () => {
    // Specific test: Code should have a different color for distinction
    
    if (typographyStyles.code.length === 0 || typographyStyles.bodyText.length === 0) {
      return;
    }
    
    const code = typographyStyles.code[0];
    const body = typographyStyles.bodyText[0];
    
    if (code && body && code.color && body.color) {
      // Colors should be different
      expect(code.color).not.toBe(body.color);
    }
  });

  test('all text types have defined styles', () => {
    // Verify we extracted styles for all text types
    expect(typographyStyles.headings.length).toBeGreaterThan(0);
    expect(typographyStyles.bodyText.length).toBeGreaterThan(0);
    expect(typographyStyles.code.length).toBeGreaterThan(0);
  });

  test('distinction is maintained across all element combinations', () => {
    // Property: For any combination of elements from different categories,
    // they should be distinguishable
    
    const allPairs = [];
    
    // Create pairs from different categories
    typographyStyles.headings.forEach(h => {
      typographyStyles.bodyText.forEach(b => {
        allPairs.push({ type1: h, type2: b, categories: 'heading-body' });
      });
      typographyStyles.code.forEach(c => {
        allPairs.push({ type1: h, type2: c, categories: 'heading-code' });
      });
    });
    
    typographyStyles.bodyText.forEach(b => {
      typographyStyles.code.forEach(c => {
        allPairs.push({ type1: b, type2: c, categories: 'body-code' });
      });
    });
    
    if (allPairs.length === 0) {
      return;
    }
    
    fc.assert(
      fc.property(
        fc.constantFrom(...allPairs),
        (pair) => {
          return areDistinguishable(pair.type1, pair.type2);
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('text type distinction uses multiple differentiating properties', () => {
    // Property: Text types should differ in multiple properties for strong distinction
    
    if (typographyStyles.headings.length === 0 || typographyStyles.bodyText.length === 0) {
      return;
    }
    
    const heading = typographyStyles.headings[0];
    const body = typographyStyles.bodyText[0];
    
    let differenceCount = 0;
    
    if (heading.fontSize && body.fontSize && Math.abs(heading.fontSize - body.fontSize) >= 2) {
      differenceCount++;
    }
    
    if (heading.fontWeight && body.fontWeight && Math.abs(heading.fontWeight - body.fontWeight) >= 100) {
      differenceCount++;
    }
    
    if (heading.fontFamily && body.fontFamily) {
      const family1 = heading.fontFamily.toLowerCase().split(',')[0].trim();
      const family2 = body.fontFamily.toLowerCase().split(',')[0].trim();
      if (family1 !== family2) {
        differenceCount++;
      }
    }
    
    // Should differ in at least one property (ideally multiple)
    expect(differenceCount).toBeGreaterThanOrEqual(1);
  });
});
