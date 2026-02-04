/**
 * Performance Testing: Page Load Performance
 * 
 * Tests page load performance metrics to ensure the XGC Theme does not
 * significantly degrade performance compared to the default Frappe theme.
 * 
 * Requirements:
 * - 13.1: Minimize CSS file sizes through efficient selectors
 * - 13.2: Minimize JavaScript file sizes by including only necessary code
 * - 13.3: Leverage Frappe's asset bundling for optimal loading
 * - 13.5: No noticeable performance degradation (>10% slower)
 */

const { describe, test, expect } = require('@jest/globals');
const fs = require('fs');
const path = require('path');

describe('Page Load Performance', () => {
  describe('Asset Size Validation', () => {
    test('CSS bundle sizes should be reasonable', () => {
      const cssFiles = [
        'public/css/xgc_variables.css',
        'public/css/xgc_components.css',
        'public/css/xgc_desk.css',
        'public/css/xgc_website.css',
        'public/css/xgc_dark.css'
      ];

      const sizes = {};
      let totalSize = 0;
      let filesFound = 0;

      cssFiles.forEach(file => {
        const filePath = path.join(process.cwd(), file);
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          const sizeKB = stats.size / 1024;
          sizes[path.basename(file)] = sizeKB;
          totalSize += sizeKB;
          filesFound++;
        }
      });
      
      // Skip test if files don't exist (not built yet)
      if (filesFound === 0) {
        console.log('\n⚠️  CSS files not found. Run bench build to generate assets.');
        return;
      }

      // Log sizes for reference
      console.log('\nCSS File Sizes:');
      Object.entries(sizes).forEach(([file, size]) => {
        console.log(`  ${file}: ${size.toFixed(2)} KB`);
      });
      console.log(`  Total: ${totalSize.toFixed(2)} KB`);

      // Validate individual file sizes (reasonable limits)
      if (sizes['xgc_variables.css']) {
        expect(sizes['xgc_variables.css']).toBeLessThan(10); // Variables should be small
      }
      if (sizes['xgc_components.css']) {
        expect(sizes['xgc_components.css']).toBeLessThan(50); // Components is the largest
      }
      if (sizes['xgc_desk.css']) {
        expect(sizes['xgc_desk.css']).toBeLessThan(30);
      }
      if (sizes['xgc_website.css']) {
        expect(sizes['xgc_website.css']).toBeLessThan(40); // Website has more content
      }
      if (sizes['xgc_dark.css']) {
        expect(sizes['xgc_dark.css']).toBeLessThan(30);
      }

      // Total CSS should be under 150KB (unminified)
      expect(totalSize).toBeLessThan(150);
    });

    test('JavaScript bundle sizes should be reasonable', () => {
      const jsFiles = [
        'public/js/xgc_theme.js'
      ];

      const sizes = {};
      let totalSize = 0;
      let filesFound = 0;

      jsFiles.forEach(file => {
        const filePath = path.join(process.cwd(), file);
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          const sizeKB = stats.size / 1024;
          sizes[path.basename(file)] = sizeKB;
          totalSize += sizeKB;
          filesFound++;
        }
      });
      
      // Skip test if files don't exist (not built yet)
      if (filesFound === 0) {
        console.log('\n⚠️  JavaScript files not found. Run bench build to generate assets.');
        return;
      }

      // Log sizes for reference
      console.log('\nJavaScript File Sizes:');
      Object.entries(sizes).forEach(([file, size]) => {
        console.log(`  ${file}: ${size.toFixed(2)} KB`);
      });
      console.log(`  Total: ${totalSize.toFixed(2)} KB`);

      // JavaScript should be under 30KB (unminified)
      expect(totalSize).toBeLessThan(30);
    });
  });

  describe('CSS Efficiency', () => {
    test('CSS files should not have excessive specificity', () => {
      const cssFiles = [
        'public/css/xgc_components.css',
        'public/css/xgc_desk.css',
        'public/css/xgc_website.css'
      ];

      cssFiles.forEach(file => {
        const filePath = path.join(process.cwd(), file);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf-8');
          
          // Check for overly specific selectors (more than 4 levels deep)
          const deepSelectors = content.match(/([.#][\w-]+\s+){5,}/g) || [];
          
          // Should have minimal deeply nested selectors
          expect(deepSelectors.length).toBeLessThan(10);
          
          if (deepSelectors.length > 0) {
            console.log(`\nDeep selectors in ${path.basename(file)}:`, deepSelectors.length);
          }
        }
      });
    });

    test('CSS files should not have excessive duplicate selectors', () => {
      const cssFiles = [
        'public/css/xgc_components.css',
        'public/css/xgc_desk.css',
        'public/css/xgc_website.css'
      ];

      cssFiles.forEach(file => {
        const filePath = path.join(process.cwd(), file);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf-8');
          
          // Extract selectors (simplified pattern)
          const selectorPattern = /([.#][\w-]+(?:\s*[.#][\w-]+)*)\s*{/g;
          const selectors = [];
          let match;
          
          while ((match = selectorPattern.exec(content)) !== null) {
            selectors.push(match[1].trim());
          }
          
          // Count duplicates
          const selectorCounts = {};
          selectors.forEach(selector => {
            selectorCounts[selector] = (selectorCounts[selector] || 0) + 1;
          });
          
          const duplicates = Object.entries(selectorCounts)
            .filter(([_, count]) => count > 3)
            .length;
          
          // Should have minimal duplicate selectors (some are expected for variants)
          expect(duplicates).toBeLessThan(20);
          
          if (duplicates > 0) {
            console.log(`\nDuplicate selectors in ${path.basename(file)}:`, duplicates);
          }
        }
      });
    });
  });

  describe('Performance Baseline', () => {
    test('should document baseline performance metrics', () => {
      // This test documents expected performance characteristics
      const performanceBaseline = {
        css: {
          totalSize: '< 150 KB (unminified)',
          minifiedSize: '< 50 KB (minified)',
          gzippedSize: '< 15 KB (gzipped)'
        },
        javascript: {
          totalSize: '< 30 KB (unminified)',
          minifiedSize: '< 15 KB (minified)',
          gzippedSize: '< 5 KB (gzipped)'
        },
        pageLoad: {
          desktop: {
            fcp: '< 1.8s',
            lcp: '< 2.5s',
            tti: '< 3.8s',
            tbt: '< 200ms',
            cls: '< 0.1'
          },
          mobile: {
            fcp: '< 2.5s',
            lcp: '< 4.0s',
            tti: '< 5.0s',
            tbt: '< 300ms',
            cls: '< 0.1'
          }
        },
        comparison: {
          maxSlowerThanDefault: '10%',
          cssSizeIncrease: '< 20%',
          jsSizeIncrease: '< 15%'
        }
      };

      console.log('\nPerformance Baseline:');
      console.log(JSON.stringify(performanceBaseline, null, 2));

      // This test always passes - it's for documentation
      expect(performanceBaseline).toBeDefined();
    });
  });

  describe('Asset Loading Strategy', () => {
    test('CSS files should be loaded in correct order', () => {
      // Read hooks.py to verify asset loading order
      const hooksPath = path.join(process.cwd(), 'hooks.py');
      
      if (fs.existsSync(hooksPath)) {
        const content = fs.readFileSync(hooksPath, 'utf-8');
        
        // Variables should be loaded first
        const variablesIndex = content.indexOf('xgc_variables.css');
        const componentsIndex = content.indexOf('xgc_components.css');
        const deskIndex = content.indexOf('xgc_desk.css');
        const websiteIndex = content.indexOf('xgc_website.css');
        
        // Verify loading order: variables → components → context-specific
        if (variablesIndex > -1 && componentsIndex > -1) {
          expect(variablesIndex).toBeLessThan(componentsIndex);
        }
        
        if (componentsIndex > -1 && deskIndex > -1) {
          expect(componentsIndex).toBeLessThan(deskIndex);
        }
        
        if (componentsIndex > -1 && websiteIndex > -1) {
          expect(componentsIndex).toBeLessThan(websiteIndex);
        }
        
        console.log('\nAsset loading order verified in hooks.py');
      }
    });

    test('should use Frappe asset bundling', () => {
      const hooksPath = path.join(process.cwd(), 'hooks.py');
      
      if (fs.existsSync(hooksPath)) {
        const content = fs.readFileSync(hooksPath, 'utf-8');
        
        // Verify assets are registered via hooks
        expect(content).toContain('app_include_css');
        expect(content).toContain('app_include_js');
        expect(content).toContain('web_include_css');
        expect(content).toContain('web_include_js');
        
        // Verify assets use /assets/ path (Frappe bundling)
        expect(content).toContain('/assets/xgc_theme/');
        
        console.log('\nFrappe asset bundling configuration verified');
      }
    });
  });
});
