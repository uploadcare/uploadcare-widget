# = require uploadcare/utils/pusher

uploadcare.whenReady ->
  {namespace, jQuery, utils, debug} = uploadcare
  {pusher} = uploadcare.utils

  namespace 'uploadcare.widget.uploaders', (ns) ->
    class ns.URLUploader extends ns.BaseUploader
      @registerAs 'url'
      constructor: (@settings) ->
        super
        @_shutdown = true

      upload: (url) ->
        return unless url?

        @uploading = true
        @pollWatcher = new PollWatcher(this)
        @pusherWatcher = new PusherWatcher(this)

        @_state('start')

        @xhr = jQuery.ajax("#{@settings.urlBase}/from_url/",
          data: {pub_key: @settings.publicKey, source_url: url}
          dataType: 'jsonp'

        ).done (data) =>
          @token = data.token

          @pollWatcher.watch @token
          @pusherWatcher.watch @token
          jQuery(@pusherWatcher).on 'uploadcare.watch-started', => @pollWatcher.stopWatching()

        .fail (e) =>
          @_state('error')

      cancel: ->
        if @uploading
          @_shutdown = true
          @_cleanup()

      ####### Four States of uploader
      _state: (state, data) ->
        (
          start: =>
            @_shutdown = false
            jQuery(this).trigger('uploadcare.api.uploader.start')

          progress: (data) =>
            return if @_shutdown

            [@loaded, @fileSize] = [data.done, data.total]
            jQuery(this).trigger('uploadcare.api.uploader.progress')

          success: (data) =>
            return if @_shutdown

            @_state('progress', data)

            @_shutdown = true

            [@fileName, @fileId] = [data.original_filename, data.file_id]
            jQuery(this).trigger('uploadcare.api.uploader.load')

            @_cleanup()

          error: =>
            @_shutdown = true
            jQuery(this).trigger('uploadcare.api.uploader.error')

            @_cleanup()
        )[state](data)

      _cleanup: ->
        @uploading = false
        @pusherWatcher.stopWatching()
        @pollWatcher.stopWatching()

    class PusherWatcher
      constructor: (@uploader) ->
        @pusher = pusher.getPusher(@uploader.settings.pusherKey)

      watch: (@token) ->
        debug('started url watching with pusher')
        @channel = @pusher.subscribe("task-status-#{@token}")

        onStarted = =>
          jQuery(this).trigger 'uploadcare.watch-started'
          @channel.unbind ev, onStarted for ev in ['progress', 'success']

        for ev in ['progress', 'success']
          do (ev) =>
            @channel.bind ev, onStarted
            @channel.bind ev, (data) => @uploader._state ev, data

        @channel.bind 'fail', (data) => @uploader._state('error')

      stopWatching: ->
        @pusher.release() if @pusher
        @pusher = null

    class PollWatcher
      constructor: (@uploader) ->

      watch: (@token) ->
        debug('started url watching with poller')
        @interval = setInterval(
          => @_checkStatus (data) =>
            return unless @interval? # maybe we've stopped watching already

            @uploader._state data.status, data if data.status in ['progress', 'success', 'error']
        250)

      stopWatching: ->
        clearInterval @interval if @interval
        @interval = null

      _error: ->
        @stopWatching()
        @uploader._state 'error', data

      _checkStatus: (callback) ->
        jQuery.ajax "#{@uploader.settings.urlBase}/status/",
          data: {'token': @token}
          dataType: 'jsonp'
        .fail =>
          @_error()

        .done callback
