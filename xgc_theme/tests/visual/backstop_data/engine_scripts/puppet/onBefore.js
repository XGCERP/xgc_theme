/**
 * OnBefore Script - Runs before each scenario
 * 
 * This script executes before each BackstopJS scenario to set up
 * the browser environment and handle authentication if needed.
 */

module.exports = async (page, scenario, vp) => {
  await require('./loadCookies')(page, scenario);
};
