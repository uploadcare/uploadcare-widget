(function (global, factory) {
  // Not a browser enviroment at all: not Browserify/Webpack.
  if (!global.document) {
    return
  }

  if (typeof module === 'object' && module.exports) {
    module.exports = factory(global, require('jquery'))
  } else {
    global.uploadcare = factory(global)
  }
}(typeof window !== 'undefined' ? window : this, function (window, jQuery) {
  var uploadcare
  // eslint-disable-next-line no-unused-vars
  var document = window.document

  // eslint-disable-next-line no-undef, no-unused-expressions, camelcase
  ___widget_code___

  return uploadcare.__exports
}))
