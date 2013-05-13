mocks.define 'pusher', ->

  orig = Pusher
  channels = {}


  class Channel

    constructor: ->
      @callbacks = {}

    bind: (name, fn) ->
      (@callbacks[name] or= $.Callbacks()).add fn

    unbind: (name, fn) ->
      @callbacks[name]?.remove fn

    send: (name, data) ->
      @callbacks[name]?.fire data


  getChanel = (name) -> channels[name] or= new Channel


  class FakePusher
    connect: ->
    disconnect: ->
    subscribe: getChanel


  turnOn: ->
    window.Pusher = FakePusher

  turnOff: ->
    channels = {}
    window.Pusher = orig

  channel: getChanel
