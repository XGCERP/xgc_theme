/**
 * Unit Tests: Asset Loading
 * 
 * Tests that verify asset paths, registration, and configuration
 * Requirements: 1.5, 9.4, 9.5
 */

const fs = require('fs');
const path = require('path');

describe('Asset Loading Tests', () => {
  const publicDir = path.join(__dirname, '../../public');
  const hooksPath = path.join(__dirname, '../../hooks.py');

  describe('CSS File Existence', () => {
    test('xgc_variables.css should exist', () => {
      const filePath = path.join(publicDir, 'css/xgc_variables.css');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    test('xgc_components.css should exist', () => {
      const filePath = path.join(publicDir, 'css/xgc_components.css');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    test('xgc_desk.css should exist', () => {
      const filePath = path.join(publicDir, 'css/xgc_desk.css');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    test('xgc_website.css should exist', () => {
      const filePath = path.join(publicDir, 'css/xgc_website.css');
      expect(fs.existsSync(filePath)).toBe(true);
    });

    test('xgc_dark.css should exist', () => {
      const filePath = path.join(publicDir, 'css/xgc_dark.css');
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });

  describe('JavaScript File Existence', () => {
    test('xgc_theme.js should exist', () => {
      const filePath = path.join(publicDir, 'js/xgc_theme.js');
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });

  describe('CSS File Content Validation', () => {
    test('xgc_variables.css should contain CSS variable definitions', () => {
      const filePath = path.join(publicDir, 'css/xgc_variables.css');
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Should contain :root selector
      expect(content).toContain(':root');
      
      // Should contain brand color variables
      expect(content).toContain('--xgc-forest-green');
      expect(content).toContain('--xgc-gold');
      
      // Should contain Frappe core variable overrides
      expect(content).toContain('--primary');
      expect(content).toContain('--accent');
    });

    test('xgc_components.css should contain component styles', () => {
      const filePath = path.join(publicDir, 'css/xgc_components.css');
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Should contain button styles
      expect(content).toContain('.btn');
      
      // Should contain form control styles
      expect(content).toContain('.form-control');
      
      // Should contain card styles
      expect(content).toContain('.card');
    });

    test('xgc_desk.css should contain Desk-specific styles', () => {
      const filePath = path.join(publicDir, 'css/xgc_desk.css');
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Should contain desk sidebar styles
      expect(content).toContain('.desk-sidebar');
      
      // Should contain page header styles
      expect(content).toContain('.page-head');
    });

    test('xgc_website.css should contain Website-specific styles', () => {
      const filePath = path.join(publicDir, 'css/xgc_website.css');
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Should contain web header styles
      expect(content).toContain('.web-header');
      
      // Should contain web content styles
      expect(content).toContain('.web-content');
    });

    test('xgc_dark.css should contain dark theme overrides', () => {
      const filePath = path.join(publicDir, 'css/xgc_dark.css');
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Should contain dark theme selector
      expect(content).toMatch(/\[data-theme="dark"\]|\.dark-mode/);
      
      // Should contain dark background colors
      expect(content).toContain('--bg-color');
      expect(content).toContain('#111827');
    });
  });

  describe('JavaScript File Content Validation', () => {
    test('xgc_theme.js should contain theme initialization', () => {
      const filePath = path.join(publicDir, 'js/xgc_theme.js');
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Should contain xgc_theme namespace
      expect(content).toContain('xgc_theme');
      
      // Should contain init function
      expect(content).toContain('init');
    });
  });

  describe('Hooks.py Configuration', () => {
    test('hooks.py should exist', () => {
      expect(fs.existsSync(hooksPath)).toBe(true);
    });

    test('hooks.py should contain app metadata', () => {
      const content = fs.readFileSync(hooksPath, 'utf8');
      
      expect(content).toContain('app_name = "xgc_theme"');
      expect(content).toContain('app_title = "XGC Theme"');
      expect(content).toContain('app_publisher = "XGC"');
    });

    test('hooks.py should register Desk CSS assets in correct order', () => {
      const content = fs.readFileSync(hooksPath, 'utf8');
      
      // Extract app_include_css array
      const cssMatch = content.match(/app_include_css\s*=\s*\[([\s\S]*?)\]/);
      expect(cssMatch).toBeTruthy();
      
      const cssArray = cssMatch[1];
      
      // Verify order: variables → components → desk
      const variablesIndex = cssArray.indexOf('xgc_variables.css');
      const componentsIndex = cssArray.indexOf('xgc_components.css');
      const deskIndex = cssArray.indexOf('xgc_desk.css');
      
      expect(variablesIndex).toBeGreaterThan(-1);
      expect(componentsIndex).toBeGreaterThan(-1);
      expect(deskIndex).toBeGreaterThan(-1);
      expect(variablesIndex).toBeLessThan(componentsIndex);
      expect(componentsIndex).toBeLessThan(deskIndex);
    });

    test('hooks.py should register Website CSS assets in correct order', () => {
      const content = fs.readFileSync(hooksPath, 'utf8');
      
      // Extract web_include_css array
      const cssMatch = content.match(/web_include_css\s*=\s*\[([\s\S]*?)\]/);
      expect(cssMatch).toBeTruthy();
      
      const cssArray = cssMatch[1];
      
      // Verify order: variables → components → website
      const variablesIndex = cssArray.indexOf('xgc_variables.css');
      const componentsIndex = cssArray.indexOf('xgc_components.css');
      const websiteIndex = cssArray.indexOf('xgc_website.css');
      
      expect(variablesIndex).toBeGreaterThan(-1);
      expect(componentsIndex).toBeGreaterThan(-1);
      expect(websiteIndex).toBeGreaterThan(-1);
      expect(variablesIndex).toBeLessThan(componentsIndex);
      expect(componentsIndex).toBeLessThan(websiteIndex);
    });

    test('hooks.py should register JavaScript assets', () => {
      const content = fs.readFileSync(hooksPath, 'utf8');
      
      expect(content).toContain('app_include_js');
      expect(content).toContain('xgc_theme.js');
      expect(content).toContain('web_include_js');
    });

    test('hooks.py should define theme variants', () => {
      const content = fs.readFileSync(hooksPath, 'utf8');
      
      expect(content).toContain('themes = {');
      expect(content).toContain('"XGC Light"');
      expect(content).toContain('"XGC Dark"');
    });

    test('hooks.py should include dark CSS in dark theme variant', () => {
      const content = fs.readFileSync(hooksPath, 'utf8');
      
      // Find the XGC Dark theme definition
      const darkThemeMatch = content.match(/"XGC Dark":\s*{[\s\S]*?}/);
      expect(darkThemeMatch).toBeTruthy();
      
      const darkTheme = darkThemeMatch[0];
      expect(darkTheme).toContain('xgc_dark.css');
    });
  });

  describe('Asset Path Format', () => {
    test('all CSS asset paths should use /assets/xgc_theme/ prefix', () => {
      const content = fs.readFileSync(hooksPath, 'utf8');
      
      const cssFiles = [
        'xgc_variables.css',
        'xgc_components.css',
        'xgc_desk.css',
        'xgc_website.css',
        'xgc_dark.css'
      ];
      
      cssFiles.forEach(file => {
        if (content.includes(file)) {
          expect(content).toContain(`/assets/xgc_theme/css/${file}`);
        }
      });
    });

    test('all JS asset paths should use /assets/xgc_theme/ prefix', () => {
      const content = fs.readFileSync(hooksPath, 'utf8');
      
      expect(content).toContain('/assets/xgc_theme/js/xgc_theme.js');
    });
  });

  describe('CSS File Syntax Validation', () => {
    const cssFiles = [
      'xgc_variables.css',
      'xgc_components.css',
      'xgc_desk.css',
      'xgc_website.css',
      'xgc_dark.css'
    ];

    cssFiles.forEach(file => {
      test(`${file} should have balanced braces`, () => {
        const filePath = path.join(publicDir, 'css', file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        const openBraces = (content.match(/{/g) || []).length;
        const closeBraces = (content.match(/}/g) || []).length;
        
        expect(openBraces).toBe(closeBraces);
      });

      test(`${file} should not have syntax errors (basic check)`, () => {
        const filePath = path.join(publicDir, 'css', file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for common CSS syntax errors
        expect(content).not.toMatch(/:\s*;/); // Empty property values
        expect(content).not.toMatch(/{\s*}/); // Empty rule sets (allow some)
      });
    });
  });

  describe('JavaScript Syntax Validation', () => {
    test('xgc_theme.js should have valid JavaScript syntax', () => {
      const filePath = path.join(publicDir, 'js/xgc_theme.js');
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Basic syntax check - should not throw when parsed
      expect(() => {
        new Function(content);
      }).not.toThrow();
    });
  });
});
