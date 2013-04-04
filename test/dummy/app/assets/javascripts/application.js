// = require_self
// = require jquery
// = require uploadcare/widget

setTimeout(function() {
    uploadcare.jQuery(uploadcare).on('log.uploadcare', function(e, args){
        // IE can't console.log.apply() even if console.log is present
        console.log && console.log(args);
    });
}, 1000);


