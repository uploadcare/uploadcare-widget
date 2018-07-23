const semver = require('semver')

/**
 * Convert version to a semver value. Ex.: 2.5 -> 2.5.0; 1 -> 1.0.0;
 * @param {string} version
 * @return {string}
 */
const semVerify = (version) => {
  if (version === 'all') {
    return 'all'
  }

  if (typeof version === 'string' && semver.valid(version)) {
    return version
  }

  const split = version.toString().split('.')

  while (split.length < 2) {
    split.push('0')
  }

  return split.join('.')
}

module.exports = semVerify
