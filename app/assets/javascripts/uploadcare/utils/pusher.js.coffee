{
  jQuery: $,
} = uploadcare

uploadcare.namespace 'uploadcare.utils.pusher', (ns) ->
  pushers = {}

  # This fixes Pusher's prototype. Because Pusher replaces it:
  # Pusher.prototype = {method: ...}
  # instead of extending:
  # Pusher.prototype.method = ...
  uploadcare.Pusher.prototype.constructor = uploadcare.Pusher

  class ManagedPusher extends uploadcare.Pusher
    subscribe: (name) ->
      # Ensure we are connected when subscribing.
#      console.log('subscribed', name, @channels.channels)
      @connect()
      super

    unsubscribe: (name) ->
      super
#      console.log('unsubscribe', name, @channels.channels)
      if $.isEmptyObject(@channels.channels)
        setTimeout =>
          @disconnect()
        , 0

  ns.getPusher = (key) ->
    if not pushers[key]?
      pushers[key] = new ManagedPusher(key)

    pushers[key].connect()
    return pushers[key]
