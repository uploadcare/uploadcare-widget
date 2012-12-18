# = require uploadcare/utils/pusher

# USAGE:
#
#     var w = new uploadcare.utils.pubsub.PubSub('window', '123');
#     jQuery(w).on('some-state-name', function(status) { alert(status) })
#
#     # or all of them
#     jQuery(w).on('state-changed', function(status) { alert(status) })
#
#     w.watch()
#     w.stop() # don't forget, in the end :D
#

uploadcare.whenReady ->
  {jQuery, debug} = uploadcare
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
        jQuery(@pusherw).on 'uploadcare.watch-started', =>
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
        jQuery(this).trigger('state-changed', [@status])
        jQuery(this).trigger(@status.state, [@status])

    class PusherWatcher
      constructor: (@ps, pusherKey) ->
        @pusher = pusher.getPusher(pusherKey, @__channelName())

      __channelName: () ->
        "pubsub.channel.#{@ps.channel}.#{@ps.topic}"

      watch: ->

        @channel = @pusher.subscribe(@__channelName())

        @channel.bind 'event', (data) => @ps.__update jQuery.parseJSON(data)

        # a little thingy to avoid polling
        onStarted = =>
          debug('wow, listening with pusher')
          jQuery(this).trigger 'uploadcare.watch-started'
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
        jQuery.ajax (@ps.pollUrlConstructor @ps.channel, @ps.topic),
          dataType: 'jsonp'
        .fail =>
          @ps.__update {score: -1, state: 'error'}
        .done (data) =>
          @ps.__update data
