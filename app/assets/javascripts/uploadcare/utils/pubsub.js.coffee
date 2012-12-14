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
      constructor: (@widget, @channel, @topic) ->
        @pollUrlConstructor = (channel, topic) ->
          "#{@widget.settings.socialBase}/pubsub/status/#{@channel}/#{@topic}"

        @pusherw = new PusherWatcher(this, @widget.settings.pusherKey)
        @pollw = new PollWatcher(this)

      watch: ->
        @pusherw.watch()
        @pollw.watch()
        jQuery(@pusherw).on 'uploadcare-watchstart', =>
          @pollw.stop()

      stop: ->
        @pusherw.stop()
        @pollw.stop()

      _update: (status) ->
        if not @status or @status.score < status.score
          @status = status
          @_notify()

      _notify: ->
        debug('status', @status.score, @status.state, @status)
        jQuery(this).trigger('state-changed', [@status])
        jQuery(this).trigger(@status.state, [@status])

    class PusherWatcher
      constructor: (@ps, pusherKey) ->
        @pusher = pusher.getPusher(pusherKey, @_channelName())

      _channelName: () ->
        "pubsub.channel.#{@ps.channel}.#{@ps.topic}"

      watch: ->
        @channel = @pusher.subscribe(@_channelName())

        @channel.bind 'event', (data) => @ps._update jQuery.parseJSON(data)

        # a little thingy to avoid polling
        onStarted = =>
          debug('wow, listening with pusher')
          jQuery(this).trigger 'uploadcare-watchstart'
          @channel.unbind 'event', onStarted
        @channel.bind 'event', onStarted

      stop: ->
        @pusher.release() if @pusher
        @pusher = null

    class PollWatcher
      constructor: (@ps) ->

      watch: ->
        @interval = setInterval (=> @_checkStatus()), 2000

      stop: ->
        clearInterval @interval if @interval
        @interval = null

      _checkStatus: ->
        debug('polling status...')
        jQuery.ajax (@ps.pollUrlConstructor @ps.channel, @ps.topic),
          dataType: 'jsonp'
        .fail =>
          @ps._update {score: -1, state: 'error'}
        .done (data) =>
          @ps._update data
