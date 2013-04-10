// = require_self
// = require jquery
// = require uploadcare/widget

jQuery(function($) {
  $(uploadcare).on('log.uploadcare', function(e, args){
    // IE can't console.log.apply() even if console.log is present
    console.log && console.log(args);
  });
});
