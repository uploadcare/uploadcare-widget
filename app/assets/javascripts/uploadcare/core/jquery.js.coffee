# = require uploadcare/core/jquery.1.8.3.js

{namespace} = uploadcare

namespace 'uploadcare', (ns) ->
  
  ns.jQuery = jQuery
  jQuery.noConflict(true)

  # back compatibility
  ns.whenReady = (fn) -> fn()
  ns.expose 'whenReady'
