const parseBrowsersList = require('./parseBrowsersList')

const browserslist = require('browserslist')

/**
 * Get array of browsers from browserlist utility.
 * @param {Array} queries
 * @return {Array}
 */
const getBrowsersFromBrowserslist = (queries) => {
  let opts = {}

  if (browserslist.findConfig(process.cwd())) {
    opts.path = process.cwd()
  }
  else {
    throw new Error('Browserslist config was not found. Define queries or config path.')
  }

  return parseBrowsersList(browserslist(queries, opts))
}

module.exports = getBrowsersFromBrowserslist
