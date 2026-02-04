/**
 * OnReady Script - Runs when page is ready
 * 
 * This script executes when the page is ready for screenshot capture.
 * It can be used to hide dynamic elements, scroll, or perform interactions.
 */

module.exports = async (page, scenario, vp) => {
  console.log('SCENARIO > ' + scenario.label);
  
  // Wait for fonts to load
  await page.evaluateHandle('document.fonts.ready');
  
  // Hide elements that change frequently (timestamps, user-specific data)
  await page.evaluate(() => {
    // Hide timestamps
    const timestamps = document.querySelectorAll('.timestamp, .modified-date, .creation-date');
    timestamps.forEach(el => el.style.visibility = 'hidden');
    
    // Hide user avatars that might change
    const avatars = document.querySelectorAll('.avatar, .user-image');
    avatars.forEach(el => el.style.visibility = 'hidden');
  });
  
  // Additional wait for animations to complete
  await page.waitForTimeout(500);
};
