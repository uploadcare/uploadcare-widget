/**
 * Format browsers for BrowserStack.
 * @param {Array} browsers
 * @return {string}
 */
const formatBrowsersForBrowserStack = (browsers) => browsers
  .map((browser) => `browserstack:${browser.family}@${browser.version}`)
  .join(',')

module.exports = formatBrowsersForBrowserStack
