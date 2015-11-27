{mocks} = jasmine

mocks.define 'pusher', ->
  orig = uploadcare.utils.pusher.getPusher
  channels = {}


  class Channel

    constructor: ->
      @events = {}
      @all = $.Callbacks()

    bind_all: (fn) ->
      @all.add fn

    bind: (name, fn) ->
      (@events[name] or= $.Callbacks()).add fn

    unbind: (name, fn) ->
      @events[name]?.remove fn

    send: (name, data) ->
      @all.fire name, data
      @events[name]?.fire data


  getChanel = (name) ->
    channels[name] or= new Channel


  class FakePusher
    connect: ->
    disconnect: ->
    subscribe: getChanel
    unsubscribe: ->


  turnOn: ->
    uploadcare.utils.pusher.getPusher = ->
      new FakePusher()

  turnOff: ->
    channels = {}
    uploadcare.Pusher = orig

  channel: getChanel
