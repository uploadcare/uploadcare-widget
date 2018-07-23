const getBrowsersFromBrowserslist = require('./utils/getBrowsersFromBrowserslist')
const formatBrowsersForBrowserStack = require('./utils/formatBrowsersForBrowserStack')
const filterTestcafeAvailableBrowsers = require('./utils/filterTestcafeAvailableBrowsers')
const run = require('./utils/run')
const nanoid = require('nanoid')

require('dotenv').config()

const version = process.env.npm_package_version
const hash = nanoid()

/* eslint-disable no-console */
console.log(`Version: ${version}, hash: ${hash}`)
process.env.BROWSERSTACK_BUILD_ID = `${version}:${hash}`

const browsersFromBrowserslist = getBrowsersFromBrowserslist()

console.log('Browsers from browserslist: ')
console.log(browsersFromBrowserslist)
console.log(`Count: ${browsersFromBrowserslist.length}`)

const browsersFiltered = filterTestcafeAvailableBrowsers(browsersFromBrowserslist)

console.log('Available in TestCafe & Browserstack: ')
console.log(browsersFiltered)
console.log(`Count: ${browsersFiltered.length}`)

const browsers = formatBrowsersForBrowserStack(browsersFiltered)

run(browsers)
console.log('Running…')
