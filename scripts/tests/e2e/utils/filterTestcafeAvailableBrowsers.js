const testcafeAvailableBrowsers = [
  'chromium',
  'chrome',
  'chrome-canary',
  'ie',
  'edge',
  'firefox',
  'opera',
  'safari',
]

/**
 * Check browsers available in Testcafe testing utility.
 * @param {Array} browsers
 * @return {Array}
 */
const filterTestcafeAvailableBrowsers = (browsers) => browsers
  .filter(browser => testcafeAvailableBrowsers.includes(browser.family))

module.exports = filterTestcafeAvailableBrowsers
