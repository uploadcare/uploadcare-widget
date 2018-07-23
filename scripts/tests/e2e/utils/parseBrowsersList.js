const semVerify = require('./semVerify')

const browserNameMap = {
  bb: 'blackberry',
  chrome: 'chrome',
  and_chr: 'chrome:android',
  ChromeAndroid: 'chrome:android',
  FirefoxAndroid: 'firefox:android',
  ff: 'firefox',
  firefox: 'firefox',
  ie: 'ie',
  edge: 'edge',
  ie_mob: 'ie:mobile',
  and_ff: 'firefox:android',
  ios_saf: 'safari:ios',
  safari: 'safari',
  op_mini: 'opera:mini',
  op_mob: 'opera:mobile',
  opera: 'opera',
  and_qq: 'qq:android',
  and_uc: 'uc:android',
  baidu: 'baidu',
  android: 'android',
  samsung: 'samsung',
}

const parseBrowsersList = (browsersList) => browsersList.map(browser => {
  const [browserName, browserVersion] = browser.split(' ')

  let normalizedName = browserName
  let normalizedVersion = browserVersion

  if (browserName in browserNameMap) {
    normalizedName = browserNameMap[browserName]
  }

  try {
    // Browser version can return as "10.0-10.2"
    const splitVersion = browserVersion.split('-')[0]

    normalizedVersion = semVerify(splitVersion)
  }
  catch (error) {}

  return {
    family: normalizedName,
    version: normalizedVersion,
  }
})

module.exports = parseBrowsersList
