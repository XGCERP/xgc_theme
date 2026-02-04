/**
 * Set Dark Theme Script
 * 
 * This script switches the page to dark theme before taking screenshots.
 * It sets the data-theme attribute and waits for theme transition.
 */

module.exports = async (page, scenario, vp) => {
  // Load cookies first
  await require('./loadCookies')(page, scenario);
  
  // Navigate to the page
  await page.goto(scenario.url);
  
  // Wait for page to load
  await page.waitForSelector('body', { timeout: 10000 });
  
  // Set dark theme
  await page.evaluate(() => {
    // Set data-theme attribute on html element
    document.documentElement.setAttribute('data-theme', 'dark');
    
    // Also add dark-mode class if used
    document.body.classList.add('dark-mode');
    
    // Trigger any theme change events
    const event = new CustomEvent('theme-change', { detail: { theme: 'dark' } });
    document.dispatchEvent(event);
  });
  
  // Wait for theme transition to complete
  await page.waitForTimeout(500);
  
  console.log('Dark theme applied for scenario: ' + scenario.label);
};
