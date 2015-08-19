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
      if @disconnectTimeout
        clearTimeout(@disconnectTimeout)
        @disconnectTimeout = null
      @connect()
      super

    unsubscribe: (name) ->
      super
      if $.isEmptyObject(@channels.channels)
        @disconnectTimeout = setTimeout =>
          @disconnectTimeout = null
          @disconnect()
        , 5000

  ns.getPusher = (key) ->
    if not pushers[key]?
      pushers[key] = new ManagedPusher(key)

    pushers[key].connect()
    return pushers[key]
