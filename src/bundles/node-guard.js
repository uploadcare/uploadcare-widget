const { isNode } = require('../utils/is-window-defined')
module.exports = isNode ? {} : require('./uploadcare')
