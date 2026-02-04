/**
 * Property-Based Test: Cross-Browser Style Consistency
 * 
 * Feature: oneui-frappe-theme-integration
 * Property 14: Cross-Browser Style Consistency
 * 
 * Tests that styles have proper vendor prefixes and fallbacks for cross-browser compatibility:
 * - Vendor prefixes for transitions (-webkit-, -moz-, -o-)
 * - Vendor prefixes for transforms (-webkit-, -moz-, -ms-, -o-)
 * - Vendor prefixes for user-select (-webkit-, -moz-, -ms-)
 * - Vendor prefixes for animations (-webkit-, -moz-, -o-)
 * - Fallback values for CSS variables
 * 
 * **Validates: Requirements 14.1, 14.3**
 * 
 * Note: This test validates that the CSS includes proper vendor prefixes and fallbacks
 * which ensures cross-browser compatibility. Actual multi-browser testing would require
 * running tests in different browser environments (Chrome, Firefox, Safari, Edge).
 * 
 * @jest-environment jsdom
 */

const fc = require('fast-check');
const fs = require('fs');
const path = require('path');

describe('Property 14: Cross-Browser Style Consistency', () => {
  let variablesCSS;
  let componentsCSS;
  let deskCSS;
  let websiteCSS;

  beforeAll(() => {
    // Read all CSS files
    variablesCSS = fs.readFileSync(
      path.join(__dirname, '../../public/css/xgc_variables.css'),
      'utf-8'
    );
    componentsCSS = fs.readFileSync(
      path.join(__dirname, '../../public/css/xgc_components.css'),
      'utf-8'
    );
    deskCSS = fs.readFileSync(
      path.join(__dirname, '../../public/css/xgc_desk.css'),
      'utf-8'
    );
    websiteCSS = fs.readFileSync(
      path.join(__dirname, '../../public/css/xgc_website.css'),
      'utf-8'
    );
  });

  /**
   * Check if a CSS property has vendor prefixes
   */
  function hasVendorPrefixes(cssContent, property, requiredPrefixes = ['-webkit-', '-moz-', '-o-']) {
    const propertyRegex = new RegExp(`${property}:\\s*[^;]+;`, 'g');
    const matches = cssContent.match(propertyRegex);
    
    if (!matches || matches.length === 0) {
      return true; // Property not used, so no prefixes needed
    }

    // For each standard property usage, check if vendor prefixes exist nearby
    const lines = cssContent.split('\n');
    let hasAllPrefixes = true;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.includes(`${property}:`) && !line.includes(`-${property}:`)) {
        // Found standard property, check if vendor prefixes exist in previous lines
        const contextStart = Math.max(0, i - 10);
        const contextLines = lines.slice(contextStart, i + 1).join('\n');
        
        const hasPrefixes = requiredPrefixes.every(prefix => {
          return contextLines.includes(`${prefix}${property}:`);
        });
        
        if (!hasPrefixes) {
          hasAllPrefixes = false;
          break;
        }
      }
    }

    return hasAllPrefixes;
  }

  /**
   * Check if transform properties have vendor prefixes
   */
  function hasTransformPrefixes(cssContent) {
    const transformRegex = /transform:\s*[^;]+;/g;
    const matches = cssContent.match(transformRegex);
    
    if (!matches || matches.length === 0) {
      return true; // No transforms used
    }

    // Check for vendor prefixes
    const hasWebkit = cssContent.includes('-webkit-transform:');
    const hasMoz = cssContent.includes('-moz-transform:');
    const hasMs = cssContent.includes('-ms-transform:');
    const hasO = cssContent.includes('-o-transform:');

    return hasWebkit && hasMoz && hasMs && hasO;
  }

  /**
   * Check if animation properties have vendor prefixes
   */
  function hasAnimationPrefixes(cssContent) {
    const animationRegex = /animation:\s*[^;]+;/g;
    const matches = cssContent.match(animationRegex);
    
    if (!matches || matches.length === 0) {
      return true; // No animations used
    }

    // Check for vendor prefixes
    const hasWebkit = cssContent.includes('-webkit-animation:');
    const hasMoz = cssContent.includes('-moz-animation:');
    const hasO = cssContent.includes('-o-animation:');

    return hasWebkit && hasMoz && hasO;
  }

  /**
   * Check if @keyframes have vendor prefixes
   */
  function hasKeyframesPrefixes(cssContent) {
    const keyframesRegex = /@keyframes\s+[\w-]+/g;
    const matches = cssContent.match(keyframesRegex);
    
    if (!matches || matches.length === 0) {
      return true; // No keyframes used
    }

    // For each @keyframes, check if vendor prefixed versions exist
    const keyframeNames = matches.map(m => m.replace('@keyframes ', '').trim());
    
    return keyframeNames.every(name => {
      const hasWebkit = cssContent.includes(`@-webkit-keyframes ${name}`);
      const hasMoz = cssContent.includes(`@-moz-keyframes ${name}`);
      const hasO = cssContent.includes(`@-o-keyframes ${name}`);
      
      return hasWebkit && hasMoz && hasO;
    });
  }

  /**
   * Check if CSS variables have fallback values
   */
  function hasCSSVariableFallbacks(cssContent) {
    // Check if there are fallback styles defined before :root
    const hasBodyFallbacks = cssContent.includes('body {') && 
                             cssContent.indexOf('body {') < cssContent.indexOf(':root {');
    
    const hasBtnFallbacks = cssContent.includes('.btn {') && 
                            cssContent.indexOf('.btn {') < cssContent.indexOf(':root {');
    
    const hasFormFallbacks = cssContent.includes('.form-control') && 
                             cssContent.indexOf('.form-control') < cssContent.indexOf(':root {');
    
    return hasBodyFallbacks || hasBtnFallbacks || hasFormFallbacks;
  }

  test('transition properties have vendor prefixes in all CSS files', () => {
    // Property: All transition properties should have -webkit-, -moz-, and -o- prefixes
    
    const cssFiles = [
      { name: 'components', content: componentsCSS },
      { name: 'desk', content: deskCSS },
      { name: 'website', content: websiteCSS }
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...cssFiles),
        (cssFile) => {
          // Check if the file has any transition properties
          const hasTransitions = cssFile.content.includes('transition:');
          
          if (!hasTransitions) {
            return true; // No transitions, so no prefixes needed
          }
          
          // Check that vendor prefixes exist in the file
          const hasWebkit = cssFile.content.includes('-webkit-transition:');
          const hasMoz = cssFile.content.includes('-moz-transition:');
          const hasO = cssFile.content.includes('-o-transition:');
          
          // All three vendor prefixes should be present if transitions are used
          return hasWebkit && hasMoz && hasO;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('transform properties have vendor prefixes in all CSS files', () => {
    // Property: All transform properties should have -webkit-, -moz-, -ms-, and -o- prefixes
    
    const cssFiles = [
      { name: 'components', content: componentsCSS },
      { name: 'desk', content: deskCSS },
      { name: 'website', content: websiteCSS }
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...cssFiles),
        (cssFile) => {
          return hasTransformPrefixes(cssFile.content);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('animation properties have vendor prefixes', () => {
    // Property: All animation properties should have -webkit-, -moz-, and -o- prefixes
    
    fc.assert(
      fc.property(
        fc.constant(componentsCSS),
        (cssContent) => {
          return hasAnimationPrefixes(cssContent);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('@keyframes have vendor prefixed versions', () => {
    // Property: All @keyframes should have @-webkit-keyframes, @-moz-keyframes, and @-o-keyframes versions
    
    fc.assert(
      fc.property(
        fc.constant(componentsCSS),
        (cssContent) => {
          return hasKeyframesPrefixes(cssContent);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('CSS variables have fallback values for older browsers', () => {
    // Property: CSS variables file should include fallback values before :root declaration
    
    fc.assert(
      fc.property(
        fc.constant(variablesCSS),
        (cssContent) => {
          return hasCSSVariableFallbacks(cssContent);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('user-select properties have vendor prefixes', () => {
    // Property: user-select should have -webkit-, -moz-, and -ms- prefixes
    
    fc.assert(
      fc.property(
        fc.constant(componentsCSS),
        (cssContent) => {
          const hasUserSelect = cssContent.includes('user-select:');
          
          if (!hasUserSelect) {
            return true; // Property not used
          }
          
          const hasWebkit = cssContent.includes('-webkit-user-select:');
          const hasMoz = cssContent.includes('-moz-user-select:');
          const hasMs = cssContent.includes('-ms-user-select:');
          
          return hasWebkit && hasMoz && hasMs;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('critical component styles have fallback values', () => {
    // Property: Critical components should have fallback values defined
    
    const criticalComponents = [
      { selector: '.btn', properties: ['font-family', 'font-size', 'border-radius'] },
      { selector: '.form-control', properties: ['font-family', 'font-size', 'border-radius'] },
      { selector: '.card', properties: ['background-color', 'border', 'border-radius'] }
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...criticalComponents),
        (component) => {
          // Check if fallback styles exist in variables.css before :root
          const beforeRoot = variablesCSS.substring(0, variablesCSS.indexOf(':root {'));
          
          const hasFallback = beforeRoot.includes(component.selector);
          
          return hasFallback;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('all transition declarations include standard property after vendor prefixes', () => {
    // Property: Standard property should always be included after vendor prefixes
    
    const cssFiles = [
      { name: 'components', content: componentsCSS },
      { name: 'desk', content: deskCSS },
      { name: 'website', content: websiteCSS }
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...cssFiles),
        (cssFile) => {
          const lines = cssFile.content.split('\n');
          let isValid = true;
          
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // If we find a vendor-prefixed transition
            if (line.includes('-webkit-transition:') || 
                line.includes('-moz-transition:') || 
                line.includes('-o-transition:')) {
              
              // Check that a standard transition: follows within the next few lines
              const nextLines = lines.slice(i, i + 10).join('\n');
              if (!nextLines.includes('transition:') || 
                  nextLines.indexOf('transition:') < nextLines.indexOf('-transition:')) {
                isValid = false;
                break;
              }
            }
          }
          
          return isValid;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('all transform declarations include standard property after vendor prefixes', () => {
    // Property: Standard transform property should always be included after vendor prefixes
    
    const cssFiles = [
      { name: 'components', content: componentsCSS },
      { name: 'desk', content: deskCSS },
      { name: 'website', content: websiteCSS }
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...cssFiles),
        (cssFile) => {
          // Find all blocks that have vendor-prefixed transforms
          const lines = cssFile.content.split('\n');
          let isValid = true;
          
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // If we find a vendor-prefixed transform
            if (line.match(/^-webkit-transform:\s*[^;]+;/) || 
                line.match(/^-moz-transform:\s*[^;]+;/) || 
                line.match(/^-ms-transform:\s*[^;]+;/) ||
                line.match(/^-o-transform:\s*[^;]+;/)) {
              
              // Check that a standard transform: follows within the next 10 lines
              const nextLines = lines.slice(i, i + 10);
              const hasStandardTransform = nextLines.some(l => 
                l.trim().match(/^transform:\s*[^;]+;$/)
              );
              
              if (!hasStandardTransform) {
                isValid = false;
                break;
              }
            }
          }
          
          return isValid;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('vendor prefixes are in correct order (webkit, moz, ms, o, standard)', () => {
    // Property: Vendor prefixes should appear in the conventional order
    
    const cssFiles = [
      { name: 'components', content: componentsCSS },
      { name: 'desk', content: deskCSS },
      { name: 'website', content: websiteCSS }
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...cssFiles),
        (cssFile) => {
          const lines = cssFile.content.split('\n');
          let isValid = true;
          
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // If we find a webkit prefix, check the order
            if (line.includes('-webkit-transition:') || line.includes('-webkit-transform:')) {
              const contextLines = lines.slice(i, i + 10);
              const contextText = contextLines.join('\n');
              
              // Find positions of each prefix
              const webkitPos = contextText.indexOf('-webkit-');
              const mozPos = contextText.indexOf('-moz-');
              const msPos = contextText.indexOf('-ms-');
              const oPos = contextText.indexOf('-o-');
              
              // Check order: webkit < moz < (ms or o) < standard
              if (mozPos !== -1 && mozPos < webkitPos) {
                isValid = false;
                break;
              }
              
              if (msPos !== -1 && msPos < mozPos) {
                isValid = false;
                break;
              }
              
              if (oPos !== -1 && oPos < mozPos) {
                isValid = false;
                break;
              }
            }
          }
          
          return isValid;
        }
      ),
      { numRuns: 100 }
    );
  });
});
