{
  jQuery: $
} = uploadcare

uploadcare.namespace 'utils', (ns) ->

  callbacks = {}

  $(window).on "message", ({originalEvent: e}) =>
    try
      message = JSON.parse(e.data)
    catch
      return

    if message.type of callbacks
      for item in callbacks[message.type]
        if e.source == item[0]
          item[1](message)


  ns.registerMessage = (type, sender, callback) ->
    if not (type of callbacks)
      callbacks[type] = []

    callbacks[type].push([sender, callback])


  ns.unregisterMessage = (type, sender) ->
    if type of callbacks
      callbacks[type] = $.filter callbacks[type], ->
        return this[0] != sender
