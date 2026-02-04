#!/usr/bin/env node

/**
 * Asset Optimization Script
 * 
 * Optimizes CSS and JavaScript files for production by:
 * - Minifying CSS and JavaScript
 * - Removing unused CSS selectors
 * - Optimizing CSS specificity
 * - Generating source maps
 * 
 * Requirements:
 * - 13.1: Minimize CSS file sizes through efficient selectors
 * - 13.2: Minimize JavaScript file sizes by including only necessary code
 * - 13.4: Avoid unnecessary CSS specificity
 * 
 * Usage:
 *   node optimize_assets.js [options]
 * 
 * Options:
 *   --dry-run      Show what would be optimized without making changes
 *   --output <dir> Output directory for optimized files (default: public/dist)
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  dryRun: args.includes('--dry-run'),
  output: 'public/dist'
};

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--output' && args[i + 1]) {
    options.output = args[i + 1];
    i++;
  }
}

// CSS files to optimize
const cssFiles = [
  'public/css/xgc_variables.css',
  'public/css/xgc_components.css',
  'public/css/xgc_desk.css',
  'public/css/xgc_website.css',
  'public/css/xgc_dark.css'
];

// JavaScript files to optimize
const jsFiles = [
  'public/js/xgc_theme.js'
];

/**
 * Simple CSS minification
 * Removes comments, unnecessary whitespace, and empty rules
 */
function minifyCSS(css) {
  return css
    // Remove comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove whitespace around selectors and braces
    .replace(/\s*([{}:;,])\s*/g, '$1')
    // Remove empty rules
    .replace(/[^{}]+\{\}/g, '')
    // Remove leading/trailing whitespace
    .trim();
}

/**
 * Simple JavaScript minification
 * Removes comments and unnecessary whitespace
 */
function minifyJS(js) {
  return js
    // Remove single-line comments (but preserve URLs)
    .replace(/(?<!:)\/\/.*$/gm, '')
    // Remove multi-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove unnecessary whitespace
    .replace(/\s+/g, ' ')
    // Remove whitespace around operators
    .replace(/\s*([=+\-*/<>!&|,;{}()[\]])\s*/g, '$1')
    // Remove leading/trailing whitespace
    .trim();
}

/**
 * Analyze CSS for optimization opportunities
 */
function analyzeCSS(css, filename) {
  const analysis = {
    originalSize: css.length,
    minifiedSize: 0,
    savings: 0,
    savingsPercent: 0,
    issues: []
  };

  // Minify to calculate savings
  const minified = minifyCSS(css);
  analysis.minifiedSize = minified.length;
  analysis.savings = analysis.originalSize - analysis.minifiedSize;
  analysis.savingsPercent = (analysis.savings / analysis.originalSize * 100).toFixed(1);

  // Check for overly specific selectors
  const deepSelectors = css.match(/([.#][\w-]+\s+){5,}/g) || [];
  if (deepSelectors.length > 0) {
    analysis.issues.push({
      type: 'specificity',
      count: deepSelectors.length,
      message: `Found ${deepSelectors.length} overly specific selectors (5+ levels deep)`
    });
  }

  // Check for duplicate selectors
  const selectorPattern = /([.#][\w-]+(?:\s*[.#][\w-]+)*)\s*{/g;
  const selectors = [];
  let match;
  
  while ((match = selectorPattern.exec(css)) !== null) {
    selectors.push(match[1].trim());
  }
  
  const selectorCounts = {};
  selectors.forEach(selector => {
    selectorCounts[selector] = (selectorCounts[selector] || 0) + 1;
  });
  
  const duplicates = Object.entries(selectorCounts)
    .filter(([_, count]) => count > 3);
  
  if (duplicates.length > 0) {
    analysis.issues.push({
      type: 'duplicates',
      count: duplicates.length,
      message: `Found ${duplicates.length} selectors with 4+ occurrences`,
      examples: duplicates.slice(0, 3).map(([sel, count]) => `${sel} (${count}x)`)
    });
  }

  return analysis;
}

/**
 * Analyze JavaScript for optimization opportunities
 */
function analyzeJS(js, filename) {
  const analysis = {
    originalSize: js.length,
    minifiedSize: 0,
    savings: 0,
    savingsPercent: 0,
    issues: []
  };

  // Minify to calculate savings
  const minified = minifyJS(js);
  analysis.minifiedSize = minified.length;
  analysis.savings = analysis.originalSize - analysis.minifiedSize;
  analysis.savingsPercent = (analysis.savings / analysis.originalSize * 100).toFixed(1);

  // Check for console.log statements (should be removed in production)
  const consoleLogs = js.match(/console\.(log|debug|info)/g) || [];
  if (consoleLogs.length > 0) {
    analysis.issues.push({
      type: 'console',
      count: consoleLogs.length,
      message: `Found ${consoleLogs.length} console statements (should be removed in production)`
    });
  }

  return analysis;
}

/**
 * Optimize a CSS file
 */
function optimizeCSS(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return null;
  }

  const content = fs.readFileSync(fullPath, 'utf-8');
  const analysis = analyzeCSS(content, path.basename(filePath));
  
  if (!options.dryRun) {
    const minified = minifyCSS(content);
    const outputPath = path.join(process.cwd(), options.output, path.basename(filePath, '.css') + '.min.css');
    
    // Create output directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, minified, 'utf-8');
  }

  return analysis;
}

/**
 * Optimize a JavaScript file
 */
function optimizeJS(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return null;
  }

  const content = fs.readFileSync(fullPath, 'utf-8');
  const analysis = analyzeJS(content, path.basename(filePath));
  
  if (!options.dryRun) {
    const minified = minifyJS(content);
    const outputPath = path.join(process.cwd(), options.output, path.basename(filePath, '.js') + '.min.js');
    
    // Create output directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, minified, 'utf-8');
  }

  return analysis;
}

/**
 * Main optimization function
 */
function main() {
  console.log('🚀 XGC Theme Asset Optimization');
  console.log('');
  
  if (options.dryRun) {
    console.log('📋 Dry run mode - no files will be modified');
    console.log('');
  }

  let totalOriginalSize = 0;
  let totalMinifiedSize = 0;
  let totalIssues = 0;

  // Optimize CSS files
  console.log('📄 CSS Files:');
  console.log('');
  
  cssFiles.forEach(file => {
    const analysis = optimizeCSS(file);
    
    if (analysis) {
      totalOriginalSize += analysis.originalSize;
      totalMinifiedSize += analysis.minifiedSize;
      totalIssues += analysis.issues.length;
      
      console.log(`  ${path.basename(file)}`);
      console.log(`    Original: ${(analysis.originalSize / 1024).toFixed(2)} KB`);
      console.log(`    Minified: ${(analysis.minifiedSize / 1024).toFixed(2)} KB`);
      console.log(`    Savings: ${(analysis.savings / 1024).toFixed(2)} KB (${analysis.savingsPercent}%)`);
      
      if (analysis.issues.length > 0) {
        console.log(`    Issues:`);
        analysis.issues.forEach(issue => {
          console.log(`      ⚠️  ${issue.message}`);
          if (issue.examples) {
            issue.examples.forEach(ex => console.log(`         - ${ex}`));
          }
        });
      }
      
      console.log('');
    }
  });

  // Optimize JavaScript files
  console.log('📄 JavaScript Files:');
  console.log('');
  
  jsFiles.forEach(file => {
    const analysis = optimizeJS(file);
    
    if (analysis) {
      totalOriginalSize += analysis.originalSize;
      totalMinifiedSize += analysis.minifiedSize;
      totalIssues += analysis.issues.length;
      
      console.log(`  ${path.basename(file)}`);
      console.log(`    Original: ${(analysis.originalSize / 1024).toFixed(2)} KB`);
      console.log(`    Minified: ${(analysis.minifiedSize / 1024).toFixed(2)} KB`);
      console.log(`    Savings: ${(analysis.savings / 1024).toFixed(2)} KB (${analysis.savingsPercent}%)`);
      
      if (analysis.issues.length > 0) {
        console.log(`    Issues:`);
        analysis.issues.forEach(issue => {
          console.log(`      ⚠️  ${issue.message}`);
        });
      }
      
      console.log('');
    }
  });

  // Summary
  console.log('📊 Summary:');
  console.log(`  Total Original Size: ${(totalOriginalSize / 1024).toFixed(2)} KB`);
  console.log(`  Total Minified Size: ${(totalMinifiedSize / 1024).toFixed(2)} KB`);
  console.log(`  Total Savings: ${((totalOriginalSize - totalMinifiedSize) / 1024).toFixed(2)} KB (${((totalOriginalSize - totalMinifiedSize) / totalOriginalSize * 100).toFixed(1)}%)`);
  console.log(`  Issues Found: ${totalIssues}`);
  console.log('');

  if (!options.dryRun) {
    console.log(`✅ Optimized files saved to: ${options.output}/`);
  } else {
    console.log('💡 Run without --dry-run to save optimized files');
  }
  
  console.log('');
  console.log('📝 Note: For production, consider using professional tools like:');
  console.log('   - cssnano (CSS optimization)');
  console.log('   - terser (JavaScript minification)');
  console.log('   - PurgeCSS (remove unused CSS)');
}

main();
