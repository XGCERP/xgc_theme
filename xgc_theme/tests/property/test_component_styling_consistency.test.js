/**
 * Property-Based Test: Component Styling Consistency
 * 
 * Feature: oneui-frappe-theme-integration
 * Property 6: Component Styling Consistency
 * 
 * Tests that all instances of each component type share consistent base styling:
 * - border-radius (within ±1px)
 * - padding (within ±2px)
 * - transition duration (within ±50ms)
 * 
 * **Validates: Requirements 11.1, 11.2, 11.3, 11.4**
 * 
 * @jest-environment jsdom
 */

const fc = require('fast-check');
const fs = require('fs');
const path = require('path');

describe('Property 6: Component Styling Consistency', () => {
  let document;
  let window;

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

    // Use the jsdom environment's document and window
    document = global.document;
    window = global.window;

    // Inject CSS into the document
    const styleVariables = document.createElement('style');
    styleVariables.textContent = variablesCSS;
    document.head.appendChild(styleVariables);

    const styleComponents = document.createElement('style');
    styleComponents.textContent = componentsCSS;
    document.head.appendChild(styleComponents);
  });

  /**
   * Parse CSS value to pixels
   */
  function parsePixels(value) {
    if (!value) return 0;
    if (value === 'none' || value === 'auto') return 0;
    
    // Handle rem values (assuming 16px base)
    if (value.includes('rem')) {
      return parseFloat(value) * 16;
    }
    
    // Handle px values
    if (value.includes('px')) {
      return parseFloat(value);
    }
    
    return 0;
  }

  /**
   * Parse transition duration to milliseconds
   */
  function parseTransitionDuration(value) {
    if (!value || value === 'none') return 0;
    
    // Handle multiple transitions (take the first one)
    const firstTransition = value.split(',')[0].trim();
    
    // Extract duration
    const durationMatch = firstTransition.match(/(\d+(?:\.\d+)?)(m?s)/);
    if (!durationMatch) return 0;
    
    const [, duration, unit] = durationMatch;
    const numericDuration = parseFloat(duration);
    
    // Convert to milliseconds
    return unit === 's' ? numericDuration * 1000 : numericDuration;
  }

  /**
   * Get computed style for an element
   */
  function getComputedStyle(element) {
    return window.getComputedStyle(element);
  }

  /**
   * Create multiple instances of a component
   */
  function createComponentInstances(componentType, count) {
    const instances = [];
    
    for (let i = 0; i < count; i++) {
      let element;
      
      switch (componentType) {
        case 'button':
          element = document.createElement('button');
          element.className = 'btn btn-primary';
          break;
          
        case 'input':
          element = document.createElement('input');
          element.type = 'text';
          element.className = 'form-control';
          break;
          
        case 'textarea':
          element = document.createElement('textarea');
          element.className = 'form-control';
          break;
          
        case 'select':
          element = document.createElement('select');
          element.className = 'form-control';
          break;
          
        case 'card':
          element = document.createElement('div');
          element.className = 'card';
          break;
          
        case 'alert':
          element = document.createElement('div');
          element.className = 'alert alert-info';
          break;
          
        case 'table':
          element = document.createElement('table');
          element.className = 'table';
          break;
          
        default:
          element = document.createElement('div');
      }
      
      document.body.appendChild(element);
      instances.push(element);
    }
    
    return instances;
  }

  /**
   * Clean up elements
   */
  function cleanupElements(elements) {
    elements.forEach(el => el.remove());
  }

  test('all button instances have consistent border-radius (within ±1px)', () => {
    // Property: All buttons should have the same border-radius
    
    const buttonVariants = [
      'btn btn-primary',
      'btn btn-secondary',
      'btn btn-success',
      'btn btn-danger',
      'btn btn-warning'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...buttonVariants),
        fc.integer({ min: 2, max: 5 }),
        (buttonClass, instanceCount) => {
          const buttons = [];
          
          for (let i = 0; i < instanceCount; i++) {
            const button = document.createElement('button');
            button.className = buttonClass;
            document.body.appendChild(button);
            buttons.push(button);
          }
          
          const borderRadii = buttons.map(btn => {
            const style = getComputedStyle(btn);
            return parsePixels(style.borderRadius || style.borderTopLeftRadius);
          });
          
          cleanupElements(buttons);
          
          // All border radii should be within ±1px of each other
          const min = Math.min(...borderRadii);
          const max = Math.max(...borderRadii);
          
          return (max - min) <= 1;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('all form control instances have consistent border-radius (within ±1px)', () => {
    // Property: All form controls should have the same border-radius
    
    const formControlTypes = [
      { tag: 'input', type: 'text' },
      { tag: 'input', type: 'email' },
      { tag: 'input', type: 'password' },
      { tag: 'textarea', type: null },
      { tag: 'select', type: null }
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...formControlTypes),
        fc.integer({ min: 2, max: 5 }),
        (controlType, instanceCount) => {
          const controls = [];
          
          for (let i = 0; i < instanceCount; i++) {
            const control = document.createElement(controlType.tag);
            if (controlType.type) {
              control.type = controlType.type;
            }
            control.className = 'form-control';
            document.body.appendChild(control);
            controls.push(control);
          }
          
          const borderRadii = controls.map(ctrl => {
            const style = getComputedStyle(ctrl);
            return parsePixels(style.borderRadius || style.borderTopLeftRadius);
          });
          
          cleanupElements(controls);
          
          // All border radii should be within ±1px of each other
          const min = Math.min(...borderRadii);
          const max = Math.max(...borderRadii);
          
          return (max - min) <= 1;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('all button instances have consistent padding (within ±2px)', () => {
    // Property: All buttons of the same size should have consistent padding
    
    const buttonSizes = [
      { class: 'btn btn-sm', name: 'small' },
      { class: 'btn', name: 'base' },
      { class: 'btn btn-lg', name: 'large' }
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...buttonSizes),
        fc.integer({ min: 2, max: 5 }),
        (buttonSize, instanceCount) => {
          const buttons = [];
          
          for (let i = 0; i < instanceCount; i++) {
            const button = document.createElement('button');
            button.className = buttonSize.class;
            document.body.appendChild(button);
            buttons.push(button);
          }
          
          const paddingValues = buttons.map(btn => {
            const style = getComputedStyle(btn);
            const paddingTop = parsePixels(style.paddingTop);
            const paddingLeft = parsePixels(style.paddingLeft);
            return { top: paddingTop, left: paddingLeft };
          });
          
          cleanupElements(buttons);
          
          // Check vertical padding consistency
          const topPaddings = paddingValues.map(p => p.top);
          const minTop = Math.min(...topPaddings);
          const maxTop = Math.max(...topPaddings);
          
          // Check horizontal padding consistency
          const leftPaddings = paddingValues.map(p => p.left);
          const minLeft = Math.min(...leftPaddings);
          const maxLeft = Math.max(...leftPaddings);
          
          // Both should be within ±2px
          return (maxTop - minTop) <= 2 && (maxLeft - minLeft) <= 2;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('all form control instances have consistent padding (within ±2px)', () => {
    // Property: All form controls should have consistent padding
    
    const formControlTypes = [
      'input',
      'textarea',
      'select'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...formControlTypes),
        fc.integer({ min: 2, max: 5 }),
        (controlTag, instanceCount) => {
          const controls = [];
          
          for (let i = 0; i < instanceCount; i++) {
            const control = document.createElement(controlTag);
            if (controlTag === 'input') {
              control.type = 'text';
            }
            control.className = 'form-control';
            document.body.appendChild(control);
            controls.push(control);
          }
          
          const paddingValues = controls.map(ctrl => {
            const style = getComputedStyle(ctrl);
            const paddingTop = parsePixels(style.paddingTop);
            const paddingLeft = parsePixels(style.paddingLeft);
            return { top: paddingTop, left: paddingLeft };
          });
          
          cleanupElements(controls);
          
          // Check vertical padding consistency
          const topPaddings = paddingValues.map(p => p.top);
          const minTop = Math.min(...topPaddings);
          const maxTop = Math.max(...topPaddings);
          
          // Check horizontal padding consistency
          const leftPaddings = paddingValues.map(p => p.left);
          const minLeft = Math.min(...leftPaddings);
          const maxLeft = Math.max(...leftPaddings);
          
          // Both should be within ±2px
          return (maxTop - minTop) <= 2 && (maxLeft - minLeft) <= 2;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('all button instances have consistent transition duration (within ±50ms)', () => {
    // Property: All buttons should have consistent transition timing
    
    const buttonVariants = [
      'btn btn-primary',
      'btn btn-secondary',
      'btn btn-success',
      'btn btn-danger',
      'btn btn-warning'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...buttonVariants),
        fc.integer({ min: 2, max: 5 }),
        (buttonClass, instanceCount) => {
          const buttons = [];
          
          for (let i = 0; i < instanceCount; i++) {
            const button = document.createElement('button');
            button.className = buttonClass;
            document.body.appendChild(button);
            buttons.push(button);
          }
          
          const transitionDurations = buttons.map(btn => {
            const style = getComputedStyle(btn);
            return parseTransitionDuration(style.transition || style.transitionDuration);
          });
          
          cleanupElements(buttons);
          
          // All transition durations should be within ±50ms of each other
          const min = Math.min(...transitionDurations);
          const max = Math.max(...transitionDurations);
          
          return (max - min) <= 50;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('all form control instances have consistent transition duration (within ±50ms)', () => {
    // Property: All form controls should have consistent transition timing
    
    const formControlTypes = [
      { tag: 'input', type: 'text' },
      { tag: 'textarea', type: null },
      { tag: 'select', type: null }
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...formControlTypes),
        fc.integer({ min: 2, max: 5 }),
        (controlType, instanceCount) => {
          const controls = [];
          
          for (let i = 0; i < instanceCount; i++) {
            const control = document.createElement(controlType.tag);
            if (controlType.type) {
              control.type = controlType.type;
            }
            control.className = 'form-control';
            document.body.appendChild(control);
            controls.push(control);
          }
          
          const transitionDurations = controls.map(ctrl => {
            const style = getComputedStyle(ctrl);
            return parseTransitionDuration(style.transition || style.transitionDuration);
          });
          
          cleanupElements(controls);
          
          // All transition durations should be within ±50ms of each other
          const min = Math.min(...transitionDurations);
          const max = Math.max(...transitionDurations);
          
          return (max - min) <= 50;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('all card instances have consistent border-radius (within ±1px)', () => {
    // Property: All cards should have the same border-radius
    
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 5 }),
        (instanceCount) => {
          const cards = [];
          
          for (let i = 0; i < instanceCount; i++) {
            const card = document.createElement('div');
            card.className = i % 2 === 0 ? 'card' : 'frappe-card';
            document.body.appendChild(card);
            cards.push(card);
          }
          
          const borderRadii = cards.map(card => {
            const style = getComputedStyle(card);
            return parsePixels(style.borderRadius || style.borderTopLeftRadius);
          });
          
          cleanupElements(cards);
          
          // All border radii should be within ±1px of each other
          const min = Math.min(...borderRadii);
          const max = Math.max(...borderRadii);
          
          return (max - min) <= 1;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('all alert instances have consistent border-radius (within ±1px)', () => {
    // Property: All alerts should have the same border-radius
    
    const alertVariants = [
      'alert alert-success',
      'alert alert-warning',
      'alert alert-danger',
      'alert alert-info'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...alertVariants),
        fc.integer({ min: 2, max: 5 }),
        (alertClass, instanceCount) => {
          const alerts = [];
          
          for (let i = 0; i < instanceCount; i++) {
            const alert = document.createElement('div');
            alert.className = alertClass;
            document.body.appendChild(alert);
            alerts.push(alert);
          }
          
          const borderRadii = alerts.map(alert => {
            const style = getComputedStyle(alert);
            return parsePixels(style.borderRadius || style.borderTopLeftRadius);
          });
          
          cleanupElements(alerts);
          
          // All border radii should be within ±1px of each other
          const min = Math.min(...borderRadii);
          const max = Math.max(...borderRadii);
          
          return (max - min) <= 1;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('all alert instances have consistent padding (within ±2px)', () => {
    // Property: All alerts should have consistent padding
    
    const alertVariants = [
      'alert alert-success',
      'alert alert-warning',
      'alert alert-danger',
      'alert alert-info'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...alertVariants),
        fc.integer({ min: 2, max: 5 }),
        (alertClass, instanceCount) => {
          const alerts = [];
          
          for (let i = 0; i < instanceCount; i++) {
            const alert = document.createElement('div');
            alert.className = alertClass;
            document.body.appendChild(alert);
            alerts.push(alert);
          }
          
          const paddingValues = alerts.map(alert => {
            const style = getComputedStyle(alert);
            const paddingTop = parsePixels(style.paddingTop);
            const paddingLeft = parsePixels(style.paddingLeft);
            return { top: paddingTop, left: paddingLeft };
          });
          
          cleanupElements(alerts);
          
          // Check vertical padding consistency
          const topPaddings = paddingValues.map(p => p.top);
          const minTop = Math.min(...topPaddings);
          const maxTop = Math.max(...topPaddings);
          
          // Check horizontal padding consistency
          const leftPaddings = paddingValues.map(p => p.left);
          const minLeft = Math.min(...leftPaddings);
          const maxLeft = Math.max(...leftPaddings);
          
          // Both should be within ±2px
          return (maxTop - minTop) <= 2 && (maxLeft - minLeft) <= 2;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('component types have distinct styling properties', () => {
    // Property: Different component types should have distinguishable styling
    // Note: Buttons and form controls may share similar border-radius and padding
    // for visual consistency in OneUI, but cards should be distinct
    
    const componentPairs = [
      { type1: 'button', class1: 'btn', type2: 'card', class2: 'card' },
      { type1: 'input', class1: 'form-control', type2: 'card', class2: 'card' }
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...componentPairs),
        ({ type1, class1, type2, class2 }) => {
          const el1 = document.createElement(type1 === 'card' ? 'div' : type1);
          el1.className = class1;
          if (type1 === 'input') el1.type = 'text';
          
          const el2 = document.createElement(type2 === 'card' ? 'div' : type2);
          el2.className = class2;
          if (type2 === 'input') el2.type = 'text';
          
          document.body.appendChild(el1);
          document.body.appendChild(el2);
          
          const style1 = getComputedStyle(el1);
          const style2 = getComputedStyle(el2);
          
          const borderRadius1 = parsePixels(style1.borderRadius || style1.borderTopLeftRadius);
          const borderRadius2 = parsePixels(style2.borderRadius || style2.borderTopLeftRadius);
          
          const paddingTop1 = parsePixels(style1.paddingTop);
          const paddingTop2 = parsePixels(style2.paddingTop);
          
          cleanupElements([el1, el2]);
          
          // Cards should have different styling from buttons/inputs
          // (either different border-radius or different padding)
          const hasDifferentBorderRadius = Math.abs(borderRadius1 - borderRadius2) > 1;
          const hasDifferentPadding = Math.abs(paddingTop1 - paddingTop2) > 2;
          
          return hasDifferentBorderRadius || hasDifferentPadding;
        }
      ),
      { numRuns: 100 }
    );
  });
});
