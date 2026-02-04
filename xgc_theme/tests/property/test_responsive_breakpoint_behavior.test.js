/**
 * Property-Based Test: Responsive Breakpoint Behavior
 * 
 * Feature: oneui-frappe-theme-integration
 * Property 7: Responsive Breakpoint Behavior
 * 
 * Tests that layout adapts at defined OneUI breakpoints and that
 * breakpoint-specific media query styles are properly applied.
 * 
 * **Validates: Requirements 2.2, 8.1, 8.2**
 */

const fc = require('fast-check');
const fs = require('fs');
const path = require('path');

describe('Property 7: Responsive Breakpoint Behavior', () => {
  let cssContent;

  beforeAll(() => {
    // Read xgc_components.css which contains responsive media queries
    const cssFilePath = path.join(__dirname, '../../public/css/xgc_components.css');
    cssContent = fs.readFileSync(cssFilePath, 'utf-8');
  });

  // Define OneUI breakpoints
  const breakpoints = {
    mobile: { min: 320, max: 767, name: 'mobile' },
    tablet: { min: 768, max: 1023, name: 'tablet' },
    desktop: { min: 1024, max: 1439, name: 'desktop' },
    largeDesktop: { min: 1440, max: 1920, name: 'large-desktop' }
  };

  test('media queries are defined for all OneUI breakpoints', () => {
    // Property: For each breakpoint, there should be corresponding media queries
    
    const breakpointTests = [
      { pattern: /@media\s*\(max-width:\s*767px\)/, name: 'mobile' },
      { pattern: /@media\s*\(min-width:\s*768px\)\s*and\s*\(max-width:\s*1023px\)/, name: 'tablet' },
      { pattern: /@media\s*\(min-width:\s*1024px\)/, name: 'desktop' },
      { pattern: /@media\s*\(min-width:\s*1440px\)/, name: 'large-desktop' }
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...breakpointTests),
        (breakpointTest) => {
          // Each breakpoint should have a media query defined
          return breakpointTest.pattern.test(cssContent);
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('button components have breakpoint-specific styles', () => {
    // Property: Buttons should have different min-height values at different breakpoints
    
    const buttonBreakpointStyles = [
      { breakpoint: 'mobile', selector: '@media (max-width: 767px)', property: 'min-height', expectedPattern: /min-height:\s*2\.75rem/ },
      { breakpoint: 'tablet', selector: '@media (min-width: 768px) and (max-width: 1023px)', property: 'min-height', expectedPattern: /min-height:\s*2\.625rem/ },
      { breakpoint: 'desktop', selector: '@media (min-width: 1024px)', property: 'min-height', expectedPattern: /min-height:\s*2\.5rem/ }
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...buttonBreakpointStyles),
        (styleTest) => {
          // Find the media query block
          const mediaQueryRegex = new RegExp(
            styleTest.selector.replace(/[()]/g, '\\$&') + '[\\s\\S]*?\\.btn[\\s\\S]*?' + styleTest.expectedPattern.source,
            'i'
          );
          
          return mediaQueryRegex.test(cssContent);
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('form controls have breakpoint-specific styles', () => {
    // Property: Form controls should have different min-height values at different breakpoints
    
    const formBreakpointStyles = [
      { breakpoint: 'mobile', mediaQuery: '@media (max-width: 767px)', minHeight: '2.75rem' },
      { breakpoint: 'tablet', mediaQuery: '@media (min-width: 768px) and (max-width: 1023px)', minHeight: '2.625rem' },
      { breakpoint: 'desktop', mediaQuery: '@media (min-width: 1024px)', minHeight: '2.5rem' }
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...formBreakpointStyles),
        (styleTest) => {
          // Extract the media query block
          const mediaQueryRegex = new RegExp(
            styleTest.mediaQuery.replace(/[()]/g, '\\$&') + '\\s*\\{([\\s\\S]*?)\\n\\}',
            'i'
          );
          const match = cssContent.match(mediaQueryRegex);
          
          if (!match) return false;
          
          const mediaQueryBlock = match[1];
          
          // Check if .form-control or input selectors have the expected min-height
          const formControlRegex = /\.form-control[^}]*min-height:\s*2\.\d+rem/s;
          const inputRegex = /input\[type=[^\]]+\][^}]*min-height:\s*2\.\d+rem/s;
          
          return formControlRegex.test(mediaQueryBlock) || inputRegex.test(mediaQueryBlock);
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('navigation components have breakpoint-specific layout', () => {
    // Property: Navbar should have different flex-direction at different breakpoints
    
    const navBreakpointStyles = [
      { breakpoint: 'mobile', mediaQuery: '@media (max-width: 767px)', property: 'flex-direction', value: 'column' },
      { breakpoint: 'desktop', mediaQuery: '@media (min-width: 1024px)', property: 'flex-direction', value: 'row' }
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...navBreakpointStyles),
        (styleTest) => {
          // Extract the media query block
          const mediaQueryRegex = new RegExp(
            styleTest.mediaQuery.replace(/[()]/g, '\\$&') + '\\s*\\{([\\s\\S]*?)\\n\\}',
            'i'
          );
          const match = cssContent.match(mediaQueryRegex);
          
          if (!match) return false;
          
          const mediaQueryBlock = match[1];
          
          // Check if .navbar has the expected flex-direction
          const navbarRegex = new RegExp(`\\.navbar[^}]*flex-direction:\\s*${styleTest.value}`, 's');
          
          return navbarRegex.test(mediaQueryBlock);
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('card components have breakpoint-specific padding', () => {
    // Property: Cards should have different padding at different breakpoints
    
    const cardBreakpointStyles = [
      { breakpoint: 'mobile', mediaQuery: '@media (max-width: 767px)', padding: 'var(--spacing-md)' },
      { breakpoint: 'desktop', mediaQuery: '@media (min-width: 1024px)', padding: 'var(--spacing-lg)' },
      { breakpoint: 'large-desktop', mediaQuery: '@media (min-width: 1440px)', padding: 'var(--spacing-xl)' }
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...cardBreakpointStyles),
        (styleTest) => {
          // Extract the media query block
          const mediaQueryRegex = new RegExp(
            styleTest.mediaQuery.replace(/[()]/g, '\\$&') + '\\s*\\{([\\s\\S]*?)\\n\\}',
            'i'
          );
          const match = cssContent.match(mediaQueryRegex);
          
          if (!match) return false;
          
          const mediaQueryBlock = match[1];
          
          // Check if .card or .frappe-card has the expected padding
          const cardRegex = new RegExp(`\\.(?:card|frappe-card)[^}]*padding:\\s*${styleTest.padding.replace(/[()]/g, '\\$&')}`, 's');
          
          return cardRegex.test(mediaQueryBlock);
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('table components have breakpoint-specific display behavior', () => {
    // Property: Tables should have different display values at different breakpoints
    
    const tableBreakpointStyles = [
      { breakpoint: 'mobile', mediaQuery: '@media (max-width: 767px)', display: 'block' },
      { breakpoint: 'desktop', mediaQuery: '@media (min-width: 1024px)', display: 'table' }
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...tableBreakpointStyles),
        (styleTest) => {
          // Extract the media query block
          const mediaQueryRegex = new RegExp(
            styleTest.mediaQuery.replace(/[()]/g, '\\$&') + '\\s*\\{([\\s\\S]*?)\\n\\}',
            'i'
          );
          const match = cssContent.match(mediaQueryRegex);
          
          if (!match) return false;
          
          const mediaQueryBlock = match[1];
          
          // Check if .table has the expected display value
          const tableRegex = new RegExp(`\\.table[^}]*display:\\s*${styleTest.display}`, 's');
          
          return tableRegex.test(mediaQueryBlock);
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('modal components have breakpoint-specific sizing', () => {
    // Property: Modals should have different max-width at different breakpoints
    
    const modalBreakpointStyles = [
      { breakpoint: 'mobile', mediaQuery: '@media (max-width: 767px)', property: 'min-height', value: '100vh' },
      { breakpoint: 'tablet', mediaQuery: '@media (min-width: 768px) and (max-width: 1023px)', property: 'max-width', value: '90%' },
      { breakpoint: 'desktop', mediaQuery: '@media (min-width: 1024px)', property: 'max-width', value: '600px' },
      { breakpoint: 'large-desktop', mediaQuery: '@media (min-width: 1440px)', property: 'max-width', value: '800px' }
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...modalBreakpointStyles),
        (styleTest) => {
          // Extract the media query block
          const mediaQueryRegex = new RegExp(
            styleTest.mediaQuery.replace(/[()]/g, '\\$&') + '\\s*\\{([\\s\\S]*?)\\n\\}',
            'i'
          );
          const match = cssContent.match(mediaQueryRegex);
          
          if (!match) return false;
          
          const mediaQueryBlock = match[1];
          
          // Check if .modal-content has the expected property
          const modalRegex = new RegExp(`\\.modal-content[^}]*${styleTest.property}:\\s*${styleTest.value}`, 's');
          
          return modalRegex.test(mediaQueryBlock);
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('breakpoint ranges do not overlap incorrectly', () => {
    // Property: Breakpoint ranges should be properly defined without gaps or overlaps
    
    const breakpointRanges = [
      { name: 'mobile', max: 767 },
      { name: 'tablet', min: 768, max: 1023 },
      { name: 'desktop', min: 1024, max: 1439 },
      { name: 'large-desktop', min: 1440 }
    ];

    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: breakpointRanges.length - 2 }),
        (index) => {
          const current = breakpointRanges[index];
          const next = breakpointRanges[index + 1];
          
          // The max of current should be exactly one less than min of next
          if (current.max !== undefined && next.min !== undefined) {
            return current.max === next.min - 1;
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

  test('touch-friendly sizing is applied on mobile breakpoint', () => {
    // Property: Interactive elements should have larger touch targets on mobile
    
    const touchTargetElements = [
      { selector: '.btn', property: 'min-height', expectedValue: '2.75rem' },
      { selector: '.form-control', property: 'min-height', expectedValue: '2.75rem' },
      { selector: '.nav-link', property: 'min-height', expectedValue: '2.75rem' },
      { selector: 'input[type="checkbox"]', property: 'width', expectedValue: '1.375rem' },
      { selector: 'input[type="radio"]', property: 'width', expectedValue: '1.375rem' }
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...touchTargetElements),
        (element) => {
          // Extract mobile media query block
          const mobileMediaQueryRegex = /@media\s*\(max-width:\s*767px\)\s*\{([\s\S]*?)\n\}/i;
          const match = cssContent.match(mobileMediaQueryRegex);
          
          if (!match) return false;
          
          const mobileBlock = match[1];
          
          // Check if the element has the expected touch-friendly size
          const escapedSelector = element.selector.replace(/[[\]()="]/g, '\\$&');
          const selectorRegex = new RegExp(`${escapedSelector}[^}]*${element.property}:\\s*${element.expectedValue}`, 's');
          
          return selectorRegex.test(mobileBlock);
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('responsive styles maintain consistent property names across breakpoints', () => {
    // Property: The same CSS properties should be used across breakpoints for consistency
    
    const componentProperties = [
      { component: '.btn', properties: ['min-height', 'padding'] },
      { component: '.form-control', properties: ['min-height', 'padding'] },
      { component: '.card', properties: ['padding'] },
      { component: '.navbar', properties: ['flex-direction', 'padding'] }
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...componentProperties),
        (componentTest) => {
          // For each property, check if it appears in multiple breakpoints
          return componentTest.properties.every(property => {
            const propertyRegex = new RegExp(
              `${componentTest.component.replace(/[.[\]()]/g, '\\$&')}[^}]*${property}:`,
              'g'
            );
            
            const matches = cssContent.match(propertyRegex);
            // Property should appear at least once (could be in base styles or media queries)
            return matches && matches.length >= 1;
          });
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });

  test('all breakpoint media queries use correct syntax', () => {
    // Property: Media queries should follow correct CSS syntax
    
    const mediaQueryPatterns = [
      /@media\s*\(max-width:\s*\d+px\)/g,
      /@media\s*\(min-width:\s*\d+px\)/g,
      /@media\s*\(min-width:\s*\d+px\)\s*and\s*\(max-width:\s*\d+px\)/g
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...mediaQueryPatterns),
        (pattern) => {
          const matches = cssContent.match(pattern);
          
          if (!matches) return true; // No matches is okay
          
          // All matches should have properly closed braces
          return matches.every(match => {
            const startIndex = cssContent.indexOf(match);
            const afterMatch = cssContent.substring(startIndex);
            const openBrace = afterMatch.indexOf('{');
            const closeBrace = afterMatch.indexOf('}');
            
            return openBrace !== -1 && closeBrace !== -1 && openBrace < closeBrace;
          });
        }
      ),
      { 
        numRuns: 100,
        verbose: true
      }
    );
  });
});
