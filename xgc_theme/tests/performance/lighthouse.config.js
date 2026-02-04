/**
 * Lighthouse Configuration for XGC Theme Performance Testing
 * 
 * This configuration defines Lighthouse audit settings for measuring
 * page load performance of the XGC Theme in Frappe/ERPNext.
 */

module.exports = {
  ci: {
    collect: {
      // URLs to audit (update with actual Frappe instance URLs)
      url: [
        'http://localhost:8000/app',           // Desk interface
        'http://localhost:8000/login',         // Login page
        'http://localhost:8000'                // Website home
      ],
      numberOfRuns: 3,                         // Run each audit 3 times for consistency
      settings: {
        preset: 'desktop',                     // Desktop configuration
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1
        },
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false
        }
      }
    },
    assert: {
      // Performance assertions
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        
        // Core Web Vitals
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'interactive': ['error', { maxNumericValue: 3800 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        
        // Resource sizes
        'total-byte-weight': ['warn', { maxNumericValue: 1000000 }], // 1MB
        'dom-size': ['warn', { maxNumericValue: 1500 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  },
  
  // Mobile configuration
  mobile: {
    extends: 'lighthouse:default',
    settings: {
      formFactor: 'mobile',
      throttling: {
        rttMs: 150,
        throughputKbps: 1638.4,
        cpuSlowdownMultiplier: 4
      },
      screenEmulation: {
        mobile: true,
        width: 375,
        height: 667,
        deviceScaleFactor: 2,
        disabled: false
      }
    }
  },
  
  // Desktop configuration
  desktop: {
    extends: 'lighthouse:default',
    settings: {
      formFactor: 'desktop',
      throttling: {
        rttMs: 40,
        throughputKbps: 10240,
        cpuSlowdownMultiplier: 1
      },
      screenEmulation: {
        mobile: false,
        width: 1350,
        height: 940,
        deviceScaleFactor: 1,
        disabled: false
      }
    }
  }
};
