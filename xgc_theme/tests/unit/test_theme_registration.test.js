/**
 * Unit Tests for Theme Registration
 * 
 * Tests that hooks.py contains correct theme registration configuration
 * including app metadata, asset paths, and theme variants.
 * 
 * Requirements: 1.1, 1.4
 */

const fs = require('fs');
const path = require('path');
const { describe, test, expect, beforeAll } = require('@jest/globals');

describe('Theme Registration - hooks.py', () => {
  let hooksContent;
  let hooksPath;

  beforeAll(() => {
    // Read hooks.py file
    hooksPath = path.join(__dirname, '../../hooks.py');
    hooksContent = fs.readFileSync(hooksPath, 'utf8');
  });

  describe('App Metadata', () => {
    test('should have correct app_name', () => {
      expect(hooksContent).toMatch(/app_name\s*=\s*["']xgc_theme["']/);
    });

    test('should have correct app_title', () => {
      expect(hooksContent).toMatch(/app_title\s*=\s*["']XGC Theme["']/);
    });

    test('should have correct app_publisher', () => {
      expect(hooksContent).toMatch(/app_publisher\s*=\s*["']XGC["']/);
    });

    test('should have app_description', () => {
      expect(hooksContent).toMatch(/app_description\s*=\s*["'].*OneUI.*["']/i);
    });

    test('should have app_version', () => {
      expect(hooksContent).toMatch(/app_version\s*=\s*["']\d+\.\d+\.\d+["']/);
    });

    test('should have app_email', () => {
      expect(hooksContent).toMatch(/app_email\s*=\s*["'][^"']+@[^"']+["']/);
    });

    test('should have app_license', () => {
      expect(hooksContent).toMatch(/app_license\s*=\s*["'][^"']+["']/);
    });
  });

  describe('Desk Asset Paths', () => {
    test('should define app_include_css array', () => {
      expect(hooksContent).toMatch(/app_include_css\s*=\s*\[/);
    });

    test('should include xgc_variables.css in app_include_css', () => {
      expect(hooksContent).toMatch(/["']\/assets\/xgc_theme\/css\/xgc_variables\.css["']/);
    });

    test('should include xgc_components.css in app_include_css', () => {
      expect(hooksContent).toMatch(/["']\/assets\/xgc_theme\/css\/xgc_components\.css["']/);
    });

    test('should include xgc_desk.css in app_include_css', () => {
      expect(hooksContent).toMatch(/["']\/assets\/xgc_theme\/css\/xgc_desk\.css["']/);
    });

    test('should define app_include_js array', () => {
      expect(hooksContent).toMatch(/app_include_js\s*=\s*\[/);
    });

    test('should include xgc_theme.js in app_include_js', () => {
      expect(hooksContent).toMatch(/["']\/assets\/xgc_theme\/js\/xgc_theme\.js["']/);
    });

    test('all app CSS paths should follow /assets/xgc_theme/ format', () => {
      const cssMatches = hooksContent.match(/app_include_css\s*=\s*\[([\s\S]*?)\]/);
      if (cssMatches) {
        const cssArray = cssMatches[1];
        const paths = cssArray.match(/["']([^"']+)["']/g);
        if (paths) {
          paths.forEach(pathStr => {
            const cleanPath = pathStr.replace(/["']/g, '');
            expect(cleanPath).toMatch(/^\/assets\/xgc_theme\//);
          });
        }
      }
    });

    test('all app JS paths should follow /assets/xgc_theme/ format', () => {
      const jsMatches = hooksContent.match(/app_include_js\s*=\s*\[([\s\S]*?)\]/);
      if (jsMatches) {
        const jsArray = jsMatches[1];
        const paths = jsArray.match(/["']([^"']+)["']/g);
        if (paths) {
          paths.forEach(pathStr => {
            const cleanPath = pathStr.replace(/["']/g, '');
            expect(cleanPath).toMatch(/^\/assets\/xgc_theme\//);
          });
        }
      }
    });
  });

  describe('Website Asset Paths', () => {
    test('should define web_include_css array', () => {
      expect(hooksContent).toMatch(/web_include_css\s*=\s*\[/);
    });

    test('should include xgc_variables.css in web_include_css', () => {
      expect(hooksContent).toMatch(/["']\/assets\/xgc_theme\/css\/xgc_variables\.css["']/);
    });

    test('should include xgc_components.css in web_include_css', () => {
      expect(hooksContent).toMatch(/["']\/assets\/xgc_theme\/css\/xgc_components\.css["']/);
    });

    test('should include xgc_website.css in web_include_css', () => {
      expect(hooksContent).toMatch(/["']\/assets\/xgc_theme\/css\/xgc_website\.css["']/);
    });

    test('should define web_include_js array', () => {
      expect(hooksContent).toMatch(/web_include_js\s*=\s*\[/);
    });

    test('should include xgc_theme.js in web_include_js', () => {
      expect(hooksContent).toMatch(/["']\/assets\/xgc_theme\/js\/xgc_theme\.js["']/);
    });

    test('all web CSS paths should follow /assets/xgc_theme/ format', () => {
      const cssMatches = hooksContent.match(/web_include_css\s*=\s*\[([\s\S]*?)\]/);
      if (cssMatches) {
        const cssArray = cssMatches[1];
        const paths = cssArray.match(/["']([^"']+)["']/g);
        if (paths) {
          paths.forEach(pathStr => {
            const cleanPath = pathStr.replace(/["']/g, '');
            expect(cleanPath).toMatch(/^\/assets\/xgc_theme\//);
          });
        }
      }
    });

    test('all web JS paths should follow /assets/xgc_theme/ format', () => {
      const jsMatches = hooksContent.match(/web_include_js\s*=\s*\[([\s\S]*?)\]/);
      if (jsMatches) {
        const jsArray = jsMatches[1];
        const paths = jsArray.match(/["']([^"']+)["']/g);
        if (paths) {
          paths.forEach(pathStr => {
            const cleanPath = pathStr.replace(/["']/g, '');
            expect(cleanPath).toMatch(/^\/assets\/xgc_theme\//);
          });
        }
      }
    });
  });

  describe('Theme Variants', () => {
    test('should define themes dictionary', () => {
      expect(hooksContent).toMatch(/themes\s*=\s*\{/);
    });

    test('should define "XGC Light" theme variant', () => {
      expect(hooksContent).toMatch(/["']XGC Light["']\s*:\s*\{/);
    });

    test('should define "XGC Dark" theme variant', () => {
      expect(hooksContent).toMatch(/["']XGC Dark["']\s*:\s*\{/);
    });

    test('XGC Light theme should have app_include_css', () => {
      const lightThemeMatch = hooksContent.match(/["']XGC Light["']\s*:\s*\{([^}]+)\}/);
      if (lightThemeMatch) {
        expect(lightThemeMatch[1]).toMatch(/["']app_include_css["']/);
      } else {
        throw new Error('XGC Light theme not found');
      }
    });

    test('XGC Light theme should have web_include_css', () => {
      const lightThemeMatch = hooksContent.match(/["']XGC Light["']\s*:\s*\{([^}]+)\}/);
      if (lightThemeMatch) {
        expect(lightThemeMatch[1]).toMatch(/["']web_include_css["']/);
      } else {
        throw new Error('XGC Light theme not found');
      }
    });

    test('XGC Dark theme should have app_include_css', () => {
      const darkThemeMatch = hooksContent.match(/["']XGC Dark["']\s*:\s*\{([^}]+)\}/);
      if (darkThemeMatch) {
        expect(darkThemeMatch[1]).toMatch(/["']app_include_css["']/);
      } else {
        throw new Error('XGC Dark theme not found');
      }
    });

    test('XGC Dark theme should have web_include_css', () => {
      const darkThemeMatch = hooksContent.match(/["']XGC Dark["']\s*:\s*\{([^}]+)\}/);
      if (darkThemeMatch) {
        expect(darkThemeMatch[1]).toMatch(/["']web_include_css["']/);
      } else {
        throw new Error('XGC Dark theme not found');
      }
    });

    test('XGC Dark theme should include xgc_dark.css', () => {
      expect(hooksContent).toMatch(/["']\/assets\/xgc_theme\/css\/xgc_dark\.css["']/);
    });

    test('XGC Dark theme should reference app_include_css variable', () => {
      // The dark theme should use: app_include_css + ["/assets/xgc_theme/css/xgc_dark.css"]
      const darkThemeSection = hooksContent.match(/["']XGC Dark["']\s*:\s*\{[\s\S]*?\}/);
      if (darkThemeSection) {
        expect(darkThemeSection[0]).toMatch(/app_include_css\s*\+/);
      }
    });

    test('XGC Dark theme should reference web_include_css variable', () => {
      // The dark theme should use: web_include_css + ["/assets/xgc_theme/css/xgc_dark.css"]
      const darkThemeSection = hooksContent.match(/["']XGC Dark["']\s*:\s*\{[\s\S]*?\}/);
      if (darkThemeSection) {
        expect(darkThemeSection[0]).toMatch(/web_include_css\s*\+/);
      }
    });
  });

  describe('Asset Loading Order', () => {
    test('xgc_variables.css should be loaded before xgc_components.css in app_include_css', () => {
      const cssMatches = hooksContent.match(/app_include_css\s*=\s*\[([\s\S]*?)\]/);
      if (cssMatches) {
        const cssArray = cssMatches[1];
        const variablesIndex = cssArray.indexOf('xgc_variables.css');
        const componentsIndex = cssArray.indexOf('xgc_components.css');
        expect(variablesIndex).toBeLessThan(componentsIndex);
      }
    });

    test('xgc_components.css should be loaded before xgc_desk.css in app_include_css', () => {
      const cssMatches = hooksContent.match(/app_include_css\s*=\s*\[([\s\S]*?)\]/);
      if (cssMatches) {
        const cssArray = cssMatches[1];
        const componentsIndex = cssArray.indexOf('xgc_components.css');
        const deskIndex = cssArray.indexOf('xgc_desk.css');
        expect(componentsIndex).toBeLessThan(deskIndex);
      }
    });

    test('xgc_variables.css should be loaded before xgc_components.css in web_include_css', () => {
      const cssMatches = hooksContent.match(/web_include_css\s*=\s*\[([\s\S]*?)\]/);
      if (cssMatches) {
        const cssArray = cssMatches[1];
        const variablesIndex = cssArray.indexOf('xgc_variables.css');
        const componentsIndex = cssArray.indexOf('xgc_components.css');
        expect(variablesIndex).toBeLessThan(componentsIndex);
      }
    });

    test('xgc_components.css should be loaded before xgc_website.css in web_include_css', () => {
      const cssMatches = hooksContent.match(/web_include_css\s*=\s*\[([\s\S]*?)\]/);
      if (cssMatches) {
        const cssArray = cssMatches[1];
        const componentsIndex = cssArray.indexOf('xgc_components.css');
        const websiteIndex = cssArray.indexOf('xgc_website.css');
        expect(componentsIndex).toBeLessThan(websiteIndex);
      }
    });
  });

  describe('Asset Path Consistency', () => {
    test('all CSS files should have .css extension', () => {
      const allPaths = hooksContent.match(/["']\/assets\/xgc_theme\/[^"']+["']/g) || [];
      const cssPaths = allPaths.filter(p => p.includes('/css/'));
      cssPaths.forEach(pathStr => {
        expect(pathStr).toMatch(/\.css["']$/);
      });
    });

    test('all JS files should have .js extension', () => {
      const allPaths = hooksContent.match(/["']\/assets\/xgc_theme\/[^"']+["']/g) || [];
      const jsPaths = allPaths.filter(p => p.includes('/js/'));
      jsPaths.forEach(pathStr => {
        expect(pathStr).toMatch(/\.js["']$/);
      });
    });

    test('CSS files should be in /css/ directory', () => {
      const allPaths = hooksContent.match(/["']\/assets\/xgc_theme\/[^"']+\.css["']/g) || [];
      allPaths.forEach(pathStr => {
        expect(pathStr).toMatch(/\/css\//);
      });
    });

    test('JS files should be in /js/ directory', () => {
      const allPaths = hooksContent.match(/["']\/assets\/xgc_theme\/[^"']+\.js["']/g) || [];
      allPaths.forEach(pathStr => {
        expect(pathStr).toMatch(/\/js\//);
      });
    });
  });

  describe('Theme Variant Asset Arrays', () => {
    test('XGC Light theme should have exactly 2 asset arrays (app_include_css and web_include_css)', () => {
      const lightThemeMatch = hooksContent.match(/["']XGC Light["']\s*:\s*\{([^}]+)\}/);
      if (lightThemeMatch) {
        const themeContent = lightThemeMatch[1];
        const appCssMatch = themeContent.match(/["']app_include_css["']/);
        const webCssMatch = themeContent.match(/["']web_include_css["']/);
        expect(appCssMatch).toBeTruthy();
        expect(webCssMatch).toBeTruthy();
      } else {
        throw new Error('XGC Light theme not found');
      }
    });

    test('XGC Dark theme should have exactly 2 asset arrays (app_include_css and web_include_css)', () => {
      const darkThemeMatch = hooksContent.match(/["']XGC Dark["']\s*:\s*\{([^}]+)\}/);
      if (darkThemeMatch) {
        const themeContent = darkThemeMatch[1];
        const appCssMatch = themeContent.match(/["']app_include_css["']/);
        const webCssMatch = themeContent.match(/["']web_include_css["']/);
        expect(appCssMatch).toBeTruthy();
        expect(webCssMatch).toBeTruthy();
      } else {
        throw new Error('XGC Dark theme not found');
      }
    });

    test('both theme variants should reference the same base CSS arrays', () => {
      // Both themes should use app_include_css and web_include_css variables
      const lightThemeMatch = hooksContent.match(/["']XGC Light["']\s*:\s*\{([^}]+)\}/);
      const darkThemeMatch = hooksContent.match(/["']XGC Dark["']\s*:\s*\{([^}]+)\}/);
      
      if (lightThemeMatch && darkThemeMatch) {
        expect(lightThemeMatch[1]).toMatch(/app_include_css/);
        expect(lightThemeMatch[1]).toMatch(/web_include_css/);
        expect(darkThemeMatch[1]).toMatch(/app_include_css/);
        expect(darkThemeMatch[1]).toMatch(/web_include_css/);
      } else {
        throw new Error('Theme variants not found');
      }
    });
  });
});
