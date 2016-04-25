;(function(global, factory) {
  // module.exports can be object or function, if jQuery
  // is already initialized in the same script.
  if (typeof module === "object" && module.exports) {
    module.exports = factory(global);
  } else {
    global.uploadcare = factory(global);
  }

}(this, function(window, noGlobal) {
  var uploadcare;

___widget_code___

  return uploadcare.__exports;
}));
