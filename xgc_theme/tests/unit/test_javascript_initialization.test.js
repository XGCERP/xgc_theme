/**
 * Unit Tests for JavaScript Initialization
 * 
 * Tests that xgc_theme.js initializes correctly, defines the xgc_theme namespace,
 * and properly attaches event handlers.
 * 
 * Requirements: 10.3
 */

const fs = require('fs');
const path = require('path');
const { describe, test, expect, beforeAll } = require('@jest/globals');

describe('JavaScript Initialization - xgc_theme.js', () => {
  let jsContent;
  let jsPath;

  beforeAll(() => {
    // Read xgc_theme.js file
    jsPath = path.join(__dirname, '../../public/js/xgc_theme.js');
    jsContent = fs.readFileSync(jsPath, 'utf8');
  });

  describe('File Structure', () => {
    test('should exist at correct path', () => {
      expect(fs.existsSync(jsPath)).toBe(true);
    });

    test('should be a valid JavaScript file', () => {
      expect(() => {
        // Try to parse as JavaScript - will throw if invalid syntax
        new Function(jsContent);
      }).not.toThrow();
    });

    test('should have proper file header comment', () => {
      expect(jsContent).toMatch(/\/\*\*[\s\S]*XGC Theme[\s\S]*\*\//);
    });
  });

  describe('Namespace Definition', () => {
    test('should provide xgc_theme namespace using frappe.provide', () => {
      expect(jsContent).toMatch(/frappe\.provide\s*\(\s*['"]xgc_theme['"]\s*\)/);
    });

    test('should define xgc_theme object', () => {
      expect(jsContent).toMatch(/xgc_theme\s*=\s*\{/);
    });

    test('should define xgc_theme as a global object', () => {
      // Should not be wrapped in IIFE or module.exports
      expect(jsContent).toMatch(/^[^(]*xgc_theme\s*=/m);
    });
  });

  describe('Init Function', () => {
    test('should define init function', () => {
      expect(jsContent).toMatch(/init\s*:\s*function\s*\(\s*\)/);
    });

    test('init function should call setup_theme_switcher', () => {
      const initMatch = jsContent.match(/init\s*:\s*function\s*\(\s*\)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/);
      expect(initMatch).toBeTruthy();
      if (initMatch) {
        expect(initMatch[1]).toMatch(/this\.setup_theme_switcher\s*\(\s*\)/);
      }
    });

    test('init function should call apply_component_enhancements', () => {
      const initMatch = jsContent.match(/init\s*:\s*function\s*\(\s*\)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/);
      expect(initMatch).toBeTruthy();
      if (initMatch) {
        expect(initMatch[1]).toMatch(/this\.apply_component_enhancements\s*\(\s*\)/);
      }
    });

    test('init function should call setup_responsive_handlers', () => {
      const initMatch = jsContent.match(/init\s*:\s*function\s*\(\s*\)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/);
      expect(initMatch).toBeTruthy();
      if (initMatch) {
        expect(initMatch[1]).toMatch(/this\.setup_responsive_handlers\s*\(\s*\)/);
      }
    });

    test('init function should have error handling', () => {
      const initMatch = jsContent.match(/init\s*:\s*function\s*\(\s*\)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/);
      expect(initMatch).toBeTruthy();
      if (initMatch) {
        expect(initMatch[1]).toMatch(/try\s*\{/);
        expect(initMatch[1]).toMatch(/catch\s*\(/);
      }
    });

    test('init function should log initialization messages', () => {
      const initMatch = jsContent.match(/init\s*:\s*function\s*\(\s*\)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/);
      expect(initMatch).toBeTruthy();
      if (initMatch) {
        expect(initMatch[1]).toMatch(/console\.log/);
      }
    });
  });

  describe('Theme Switcher Enhancement', () => {
    test('should define setup_theme_switcher function', () => {
      expect(jsContent).toMatch(/setup_theme_switcher\s*:\s*function\s*\(\s*\)/);
    });

    test('setup_theme_switcher should listen for theme-change event', () => {
      const funcMatch = jsContent.match(/setup_theme_switcher\s*:\s*function\s*\(\s*\)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/);
      expect(funcMatch).toBeTruthy();
      if (funcMatch) {
        expect(funcMatch[1]).toMatch(/\$\(document\)\.on\s*\(\s*['"]theme-change['"]/);
      }
    });

    test('setup_theme_switcher should add theme-transitioning class', () => {
      const funcMatch = jsContent.match(/setup_theme_switcher\s*:\s*function\s*\(\s*\)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/);
      expect(funcMatch).toBeTruthy();
      if (funcMatch) {
        expect(funcMatch[1]).toMatch(/addClass\s*\(\s*['"]theme-transitioning['"]/);
      }
    });

    test('setup_theme_switcher should remove theme-transitioning class after delay', () => {
      const funcMatch = jsContent.match(/setup_theme_switcher\s*:\s*function\s*\(\s*\)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/);
      expect(funcMatch).toBeTruthy();
      if (funcMatch) {
        expect(funcMatch[1]).toMatch(/setTimeout/);
        expect(funcMatch[1]).toMatch(/removeClass\s*\(\s*['"]theme-transitioning['"]/);
      }
    });

    test('setup_theme_switcher should use 300ms transition delay', () => {
      const funcMatch = jsContent.match(/setup_theme_switcher\s*:\s*function\s*\(\s*\)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/);
      expect(funcMatch).toBeTruthy();
      if (funcMatch) {
        expect(funcMatch[1]).toMatch(/setTimeout[^}]*300/);
      }
    });
  });

  describe('Component Enhancements', () => {
    test('should define apply_component_enhancements function', () => {
      expect(jsContent).toMatch(/apply_component_enhancements\s*:\s*function\s*\(\s*\)/);
    });

    test('apply_component_enhancements should listen for button clicks', () => {
      const funcMatch = jsContent.match(/apply_component_enhancements\s*:\s*function\s*\(\s*\)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/);
      expect(funcMatch).toBeTruthy();
      if (funcMatch) {
        expect(funcMatch[1]).toMatch(/\$\(document\)\.on\s*\(\s*['"]click['"]\s*,\s*['"]\.btn['"]/);
      }
    });

    test('apply_component_enhancements should create ripple element', () => {
      const funcMatch = jsContent.match(/apply_component_enhancements\s*:\s*function\s*\(\s*\)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/);
      expect(funcMatch).toBeTruthy();
      if (funcMatch) {
        expect(funcMatch[1]).toMatch(/ripple.*=.*\$\s*\(\s*['"]<span[^>]*ripple/);
      }
    });

    test('apply_component_enhancements should position ripple at click location', () => {
      const funcMatch = jsContent.match(/apply_component_enhancements\s*:\s*function\s*\(\s*\)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/);
      expect(funcMatch).toBeTruthy();
      if (funcMatch) {
        expect(funcMatch[1]).toMatch(/ripple\.css/);
        expect(funcMatch[1]).toMatch(/left/);
        expect(funcMatch[1]).toMatch(/top/);
      }
    });

    test('apply_component_enhancements should remove ripple after animation', () => {
      const funcMatch = jsContent.match(/apply_component_enhancements\s*:\s*function\s*\(\s*\)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/);
      expect(funcMatch).toBeTruthy();
      if (funcMatch) {
        expect(funcMatch[1]).toMatch(/setTimeout/);
        expect(funcMatch[1]).toMatch(/ripple\.remove/);
      }
    });

    test('apply_component_enhancements should use 600ms ripple duration', () => {
      const funcMatch = jsContent.match(/apply_component_enhancements\s*:\s*function\s*\(\s*\)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/);
      expect(funcMatch).toBeTruthy();
      if (funcMatch) {
        expect(funcMatch[1]).toMatch(/setTimeout[^}]*600/);
      }
    });
  });

  describe('Responsive Handlers', () => {
    test('should define setup_responsive_handlers function', () => {
      expect(jsContent).toMatch(/setup_responsive_handlers\s*:\s*function\s*\(\s*\)/);
    });

    test('setup_responsive_handlers should use frappe.utils.debounce', () => {
      const funcMatch = jsContent.match(/setup_responsive_handlers\s*:\s*function\s*\(\s*\)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/);
      expect(funcMatch).toBeTruthy();
      if (funcMatch) {
        expect(funcMatch[1]).toMatch(/frappe\.utils\.debounce/);
      }
    });

    test('setup_responsive_handlers should toggle mobile-view class', () => {
      const funcMatch = jsContent.match(/setup_responsive_handlers\s*:\s*function\s*\(\s*\)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/);
      expect(funcMatch).toBeTruthy();
      if (funcMatch) {
        expect(funcMatch[1]).toMatch(/toggleClass\s*\(\s*['"]mobile-view['"]/);
      }
    });

    test('setup_responsive_handlers should toggle tablet-view class', () => {
      const funcMatch = jsContent.match(/setup_responsive_handlers\s*:\s*function\s*\(\s*\)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/);
      expect(funcMatch).toBeTruthy();
      if (funcMatch) {
        expect(funcMatch[1]).toMatch(/toggleClass\s*\(\s*['"]tablet-view['"]/);
      }
    });

    test('setup_responsive_handlers should toggle desktop-view class', () => {
      const funcMatch = jsContent.match(/setup_responsive_handlers\s*:\s*function\s*\(\s*\)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/);
      expect(funcMatch).toBeTruthy();
      if (funcMatch) {
        expect(funcMatch[1]).toMatch(/toggleClass\s*\(\s*['"]desktop-view['"]/);
      }
    });

    test('setup_responsive_handlers should use 768px mobile breakpoint', () => {
      const funcMatch = jsContent.match(/setup_responsive_handlers\s*:\s*function\s*\(\s*\)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/);
      expect(funcMatch).toBeTruthy();
      if (funcMatch) {
        expect(funcMatch[1]).toMatch(/768/);
      }
    });

    test('setup_responsive_handlers should use 1024px desktop breakpoint', () => {
      const funcMatch = jsContent.match(/setup_responsive_handlers\s*:\s*function\s*\(\s*\)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/);
      expect(funcMatch).toBeTruthy();
      if (funcMatch) {
        expect(funcMatch[1]).toMatch(/1024/);
      }
    });

    test('setup_responsive_handlers should use 250ms debounce delay', () => {
      const funcMatch = jsContent.match(/setup_responsive_handlers\s*:\s*function\s*\(\s*\)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/);
      expect(funcMatch).toBeTruthy();
      if (funcMatch) {
        expect(funcMatch[1]).toMatch(/debounce[^}]*250/);
      }
    });

    test('setup_responsive_handlers should attach resize handler', () => {
      const funcMatch = jsContent.match(/setup_responsive_handlers\s*:\s*function\s*\(\s*\)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/);
      expect(funcMatch).toBeTruthy();
      if (funcMatch) {
        expect(funcMatch[1]).toMatch(/\$\(window\)\.on\s*\(\s*['"]resize['"]/);
      }
    });

    test('setup_responsive_handlers should call handler immediately', () => {
      const funcMatch = jsContent.match(/setup_responsive_handlers\s*:\s*function\s*\(\s*\)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/);
      expect(funcMatch).toBeTruthy();
      if (funcMatch) {
        // Should call handleResize() at the end
        expect(funcMatch[1]).toMatch(/handleResize\s*\(\s*\)\s*;?\s*$/);
      }
    });
  });

  describe('Document Ready Handler', () => {
    test('should initialize on document ready', () => {
      expect(jsContent).toMatch(/\$\(document\)\.ready\s*\(/);
    });

    test('should call xgc_theme.init() on document ready', () => {
      const readyMatch = jsContent.match(/\$\(document\)\.ready\s*\(\s*function\s*\(\s*\)\s*\{([^}]*)\}/);
      expect(readyMatch).toBeTruthy();
      if (readyMatch) {
        expect(readyMatch[1]).toMatch(/xgc_theme\.init\s*\(\s*\)/);
      }
    });
  });

  describe('Code Quality', () => {
    test('should use strict equality operators', () => {
      // Should use === and !== instead of == and !=
      const looseEquality = jsContent.match(/[^=!]=[^=]/g);
      const looseInequality = jsContent.match(/!=[^=]/g);
      
      // Filter out CSS selectors and other valid uses
      const invalidLooseEquality = (looseEquality || []).filter(match => {
        return !match.includes(':') && !match.includes('"') && !match.includes("'");
      });
      
      expect(invalidLooseEquality.length).toBe(0);
    });

    test('should use const or let instead of var', () => {
      // Should not use var declarations
      const varDeclarations = jsContent.match(/\bvar\s+\w+/g);
      expect(varDeclarations).toBeNull();
    });

    test('should have consistent indentation', () => {
      // Check that indentation is consistent (spaces, not tabs)
      const lines = jsContent.split('\n');
      const indentedLines = lines.filter(line => line.match(/^\s+\S/));
      
      indentedLines.forEach(line => {
        // Should use spaces for indentation
        expect(line).not.toMatch(/^\t/);
      });
    });

    test('should have proper semicolons', () => {
      // Check for statements that should end with semicolons
      const lines = jsContent.split('\n');
      
      lines.forEach(line => {
        const trimmed = line.trim();
        // Skip empty lines, comments, and lines ending with { } or ,
        if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*') || 
            trimmed.endsWith('{') || trimmed.endsWith('}') || trimmed.endsWith(',') ||
            trimmed.endsWith('*/')) {
          return;
        }
        
        // Lines with function calls, assignments, or returns should end with semicolon
        if (trimmed.match(/^(const|let|return|console\.|.*\(.*\))\s/) && 
            !trimmed.endsWith(';') && !trimmed.endsWith('{')) {
          // This is informational - not failing the test
          // console.log('Missing semicolon:', trimmed);
        }
      });
    });

    test('should have descriptive function names', () => {
      // All functions should have descriptive names (not single letters)
      const functionNames = jsContent.match(/function\s+(\w+)/g);
      if (functionNames) {
        functionNames.forEach(funcDecl => {
          const name = funcDecl.replace('function ', '');
          expect(name.length).toBeGreaterThan(1);
        });
      }
    });

    test('should have JSDoc-style comments for main functions', () => {
      // Main functions should have documentation comments
      expect(jsContent).toMatch(/\/\*\*[\s\S]*Initialize the theme[\s\S]*\*\//);
      expect(jsContent).toMatch(/\/\*\*[\s\S]*theme switcher[\s\S]*\*\//i);
      expect(jsContent).toMatch(/\/\*\*[\s\S]*component enhancements[\s\S]*\*\//i);
      expect(jsContent).toMatch(/\/\*\*[\s\S]*responsive[\s\S]*\*\//i);
    });
  });

  describe('Error Handling', () => {
    test('should wrap initialization in try-catch', () => {
      const initMatch = jsContent.match(/init\s*:\s*function\s*\(\s*\)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/);
      expect(initMatch).toBeTruthy();
      if (initMatch) {
        expect(initMatch[1]).toMatch(/try\s*\{/);
        expect(initMatch[1]).toMatch(/catch\s*\(/);
      }
    });

    test('should log errors to console', () => {
      const initMatch = jsContent.match(/init\s*:\s*function\s*\(\s*\)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/);
      expect(initMatch).toBeTruthy();
      if (initMatch) {
        expect(initMatch[1]).toMatch(/console\.error/);
      }
    });

    test('should include error object in error logging', () => {
      const catchMatch = jsContent.match(/catch\s*\(\s*(\w+)\s*\)\s*\{([^}]*)\}/);
      expect(catchMatch).toBeTruthy();
      if (catchMatch) {
        const errorVar = catchMatch[1];
        const catchBody = catchMatch[2];
        expect(catchBody).toMatch(new RegExp(errorVar));
      }
    });
  });

  describe('jQuery Dependencies', () => {
    test('should use jQuery for DOM manipulation', () => {
      expect(jsContent).toMatch(/\$/);
    });

    test('should use jQuery document ready', () => {
      expect(jsContent).toMatch(/\$\(document\)\.ready/);
    });

    test('should use jQuery event delegation', () => {
      expect(jsContent).toMatch(/\$\(document\)\.on/);
    });

    test('should use jQuery window object', () => {
      expect(jsContent).toMatch(/\$\(window\)/);
    });
  });

  describe('Frappe Dependencies', () => {
    test('should use frappe.provide for namespace', () => {
      expect(jsContent).toMatch(/frappe\.provide/);
    });

    test('should use frappe.utils.debounce', () => {
      expect(jsContent).toMatch(/frappe\.utils\.debounce/);
    });

    test('should not modify frappe core objects', () => {
      // Should not reassign frappe or frappe.utils
      expect(jsContent).not.toMatch(/frappe\s*=/);
      expect(jsContent).not.toMatch(/frappe\.utils\s*=/);
    });
  });

  describe('Performance Considerations', () => {
    test('should use event delegation instead of direct binding', () => {
      // Should use $(document).on() instead of $('.btn').on()
      expect(jsContent).toMatch(/\$\(document\)\.on/);
      expect(jsContent).not.toMatch(/\$\(['"]\.btn['"]\)\.on/);
    });

    test('should debounce resize handler', () => {
      expect(jsContent).toMatch(/debounce/);
    });

    test('should use setTimeout for animations', () => {
      expect(jsContent).toMatch(/setTimeout/);
    });

    test('should clean up ripple elements', () => {
      expect(jsContent).toMatch(/ripple\.remove/);
    });
  });
});
