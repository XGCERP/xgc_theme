/**
 * Load Cookies Script
 * 
 * This script loads authentication cookies to access protected pages.
 * Modify the cookies array to include your Frappe session cookies.
 */

const fs = require('fs');
const path = require('path');

module.exports = async (page, scenario) => {
  const cookiesPath = path.resolve(__dirname, '../cookies.json');
  
  // Check if cookies file exists
  if (fs.existsSync(cookiesPath)) {
    const cookies = JSON.parse(fs.readFileSync(cookiesPath, 'utf8'));
    
    // Set cookies for the page
    for (const cookie of cookies) {
      await page.setCookie(cookie);
    }
    
    console.log('Cookies loaded for authentication');
  } else {
    console.log('No cookies file found. Create cookies.json for authenticated scenarios.');
  }
};
