#!/usr/bin/env node

/**
 * Lighthouse Performance Testing Script
 * 
 * Runs Lighthouse audits on Frappe pages with XGC Theme and compares
 * performance metrics against baseline and default theme.
 * 
 * Usage:
 *   node run_lighthouse.js [options]
 * 
 * Options:
 *   --url <url>        URL to audit (default: http://localhost:8000)
 *   --mobile           Run mobile audit (default: desktop)
 *   --output <path>    Output directory for reports (default: ./lighthouse-reports)
 *   --compare          Compare with default theme
 */

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  url: 'http://localhost:8000',
  mobile: false,
  output: './lighthouse-reports',
  compare: false
};

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--url' && args[i + 1]) {
    options.url = args[i + 1];
    i++;
  } else if (args[i] === '--mobile') {
    options.mobile = true;
  } else if (args[i] === '--output' && args[i + 1]) {
    options.output = args[i + 1];
    i++;
  } else if (args[i] === '--compare') {
    options.compare = true;
  }
}

// Lighthouse configuration
const lighthouseConfig = {
  extends: 'lighthouse:default',
  settings: {
    onlyCategories: ['performance', 'accessibility', 'best-practices'],
    formFactor: options.mobile ? 'mobile' : 'desktop',
    throttling: options.mobile ? {
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4
    } : {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1
    },
    screenEmulation: options.mobile ? {
      mobile: true,
      width: 375,
      height: 667,
      deviceScaleFactor: 2
    } : {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1
    }
  }
};

async function runLighthouse(url, config) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const runnerResult = await lighthouse(url, {
    port: chrome.port,
    output: 'html',
    logLevel: 'info'
  }, config);

  await chrome.kill();
  return runnerResult;
}

function extractMetrics(lhr) {
  return {
    performanceScore: lhr.categories.performance.score * 100,
    firstContentfulPaint: lhr.audits['first-contentful-paint'].numericValue,
    largestContentfulPaint: lhr.audits['largest-contentful-paint'].numericValue,
    timeToInteractive: lhr.audits['interactive'].numericValue,
    totalBlockingTime: lhr.audits['total-blocking-time'].numericValue,
    cumulativeLayoutShift: lhr.audits['cumulative-layout-shift'].numericValue,
    speedIndex: lhr.audits['speed-index'].numericValue,
    totalByteWeight: lhr.audits['total-byte-weight'].numericValue
  };
}

function formatMetrics(metrics) {
  return {
    'Performance Score': `${metrics.performanceScore.toFixed(1)}/100`,
    'First Contentful Paint': `${(metrics.firstContentfulPaint / 1000).toFixed(2)}s`,
    'Largest Contentful Paint': `${(metrics.largestContentfulPaint / 1000).toFixed(2)}s`,
    'Time to Interactive': `${(metrics.timeToInteractive / 1000).toFixed(2)}s`,
    'Total Blocking Time': `${metrics.totalBlockingTime.toFixed(0)}ms`,
    'Cumulative Layout Shift': metrics.cumulativeLayoutShift.toFixed(3),
    'Speed Index': `${(metrics.speedIndex / 1000).toFixed(2)}s`,
    'Total Byte Weight': `${(metrics.totalByteWeight / 1024).toFixed(0)} KB`
  };
}

function compareMetrics(xgcMetrics, defaultMetrics) {
  const comparison = {};
  const degradationThreshold = 0.10; // 10% threshold
  
  for (const key in xgcMetrics) {
    const xgcValue = xgcMetrics[key];
    const defaultValue = defaultMetrics[key];
    const diff = ((xgcValue - defaultValue) / defaultValue) * 100;
    
    comparison[key] = {
      xgc: xgcValue,
      default: defaultValue,
      difference: `${diff > 0 ? '+' : ''}${diff.toFixed(1)}%`,
      acceptable: Math.abs(diff) <= degradationThreshold * 100
    };
  }
  
  return comparison;
}

async function main() {
  console.log('🚀 Running Lighthouse Performance Audit');
  console.log(`📍 URL: ${options.url}`);
  console.log(`📱 Device: ${options.mobile ? 'Mobile' : 'Desktop'}`);
  console.log('');

  try {
    // Run audit on XGC Theme
    console.log('⏳ Running audit on XGC Theme...');
    const xgcResult = await runLighthouse(options.url, lighthouseConfig);
    const xgcMetrics = extractMetrics(xgcResult.lhr);
    
    console.log('✅ XGC Theme audit complete');
    console.log('');
    console.log('📊 Performance Metrics:');
    const formattedMetrics = formatMetrics(xgcMetrics);
    Object.entries(formattedMetrics).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });
    console.log('');

    // Save report
    const outputDir = path.resolve(options.output);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = path.join(outputDir, `xgc-theme-${options.mobile ? 'mobile' : 'desktop'}-${timestamp}.html`);
    fs.writeFileSync(reportPath, xgcResult.report);
    console.log(`📄 Report saved: ${reportPath}`);
    console.log('');

    // Performance validation
    const thresholds = {
      performanceScore: 90,
      firstContentfulPaint: options.mobile ? 2500 : 1800,
      largestContentfulPaint: options.mobile ? 4000 : 2500,
      timeToInteractive: options.mobile ? 5000 : 3800,
      totalBlockingTime: options.mobile ? 300 : 200,
      cumulativeLayoutShift: 0.1
    };

    console.log('🎯 Performance Validation:');
    let allPassed = true;
    
    for (const [metric, threshold] of Object.entries(thresholds)) {
      const value = xgcMetrics[metric];
      const passed = value <= threshold;
      allPassed = allPassed && passed;
      
      const status = passed ? '✅' : '❌';
      console.log(`   ${status} ${metric}: ${value.toFixed(2)} (threshold: ${threshold})`);
    }
    
    console.log('');
    
    if (allPassed) {
      console.log('✅ All performance metrics meet requirements!');
    } else {
      console.log('⚠️  Some performance metrics need optimization');
    }

    // Compare with default theme if requested
    if (options.compare) {
      console.log('');
      console.log('⏳ Running audit on default Frappe theme...');
      // Note: This would require switching themes, which needs manual intervention
      console.log('⚠️  Comparison with default theme requires manual theme switching');
      console.log('   1. Switch to default Frappe theme');
      console.log('   2. Run: node run_lighthouse.js --url <url>');
      console.log('   3. Compare the reports manually');
    }

    process.exit(allPassed ? 0 : 1);
  } catch (error) {
    console.error('❌ Error running Lighthouse:', error.message);
    process.exit(1);
  }
}

// Check if lighthouse and chrome-launcher are available
try {
  require.resolve('lighthouse');
  require.resolve('chrome-launcher');
  main();
} catch (error) {
  console.error('❌ Missing dependencies. Install with:');
  console.error('   npm install --save-dev lighthouse chrome-launcher');
  console.error('');
  console.error('📝 Note: This script requires Chrome/Chromium to be installed');
  process.exit(1);
}
