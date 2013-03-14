# = require uploadcare/utils/pusher

# USAGE:
#
#     var w = new uploadcare.utils.pubsub.PubSub('window', '123');
#     $(w).on('some-state-name', function(status) { alert(status) })
#
#     w.watch()
#     w.stop() # don't forget, in the end :D
#

{jQuery: $, debug} = uploadcare
{pusher} = uploadcare.utils

uploadcare.namespace 'uploadcare.utils.pubsub', (ns) ->
  class ns.PubSub
    constructor: (@settings, @channel, @topic) ->
      @pollUrlConstructor = (channel, topic) ->
        "#{@settings.socialBase}/pubsub/status/#{@channel}/#{@topic}"

      @pusherw = new PusherWatcher(this, @settings.pusherKey)
      @pollw = new PollWatcher(this)

    watch: ->
      @pusherw.watch()
      @pollw.watch()
      $(@pusherw).on 'started', =>
        @pollw.stop()

    stop: ->
      @pusherw.stop()
      @pollw.stop()

    __update: (status) ->
      if not @status or @status.score < status.score
        @status = status
        @__notify()

    __notify: ->
      debug('status', @status.score, @status.state, @status)
      $(this).trigger(@status.state, [@status])

  class PusherWatcher
    constructor: (@ps, pusherKey) ->
      @pusher = pusher.getPusher(pusherKey, @__channelName())

    __channelName: () ->
      "pubsub.channel.#{@ps.channel}.#{@ps.topic}"

    watch: ->

      @channel = @pusher.subscribe(@__channelName())

      @channel.bind 'event', (data) => @ps.__update $.parseJSON(data)

      # a little thingy to avoid polling
      onStarted = =>
        debug('wow, listening with pusher')
        $(this).trigger 'started'
        @channel.unbind 'event', onStarted
      @channel.bind 'event', onStarted

    stop: ->
      @pusher.release() if @pusher
      @pusher = null

  class PollWatcher
    constructor: (@ps) ->

    watch: ->
      @interval = setInterval (=> @__checkStatus()), 2000

    stop: ->
      clearInterval @interval if @interval
      @interval = null

    __checkStatus: ->
      debug('polling status...')

      fail = =>
        @ps.__update {score: -1, state: 'error'}

      $.ajax (@ps.pollUrlConstructor @ps.channel, @ps.topic),
        dataType: 'jsonp'
      .fail(fail)
      .done (data) =>
        return fail() if data.error
        @ps.__update data
