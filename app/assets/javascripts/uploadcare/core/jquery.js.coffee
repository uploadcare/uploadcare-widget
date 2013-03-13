# = require uploadcare/core/jquery.1.7.2.js

{namespace} = uploadcare

namespace 'uploadcare', (ns) ->
  
  ns.jQuery = jQuery
  jQuery.noConflict(true)

  # back compatibility
  ns.whenReady = (fn) -> fn()
  ns.expose 'whenReady'
