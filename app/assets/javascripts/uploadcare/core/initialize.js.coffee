{namespace} = uploadcare

namespace 'uploadcare', (ns) ->
  ns.__readyCallbacks = []

  isReady = false
  ns.ready = ->
    isReady = true
    callback() for callback in ns.__readyCallbacks
  ns.whenReady = (callback) ->
    if isReady
      callback()
    else
      ns.__readyCallbacks.push(callback)

  ns.initialize = (options) ->
    {jQuery} = uploadcare
    extra = options.extra or ->
    run = () ->
      for e in jQuery(options.elements)
        continue if (not options.name?) || jQuery(e).data(options.name)?
        jQuery(e).data(options.name, new options.class(jQuery(e), extra(jQuery(e))))

    run()
    jQuery(document).on('ajaxSuccess htmlInserted', run)
