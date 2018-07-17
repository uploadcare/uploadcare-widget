const {exec} = require('child_process')

/* eslint-disable no-console */
const run = (browsers = 'chrome:headless', path = '__tests__/e2e/**/*.test.js') =>
  exec(`testcafe "${browsers}" ${path}`, (error, stdout) => {
    if (error) {
      console.error(error)

      return
    }
    console.log(stdout)
  })

module.exports = run
