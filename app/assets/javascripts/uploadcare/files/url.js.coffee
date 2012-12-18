# = require uploadcare/utils/pusher

uploadcare.whenReady ->
  {namespace, jQuery, utils, debug} = uploadcare
  {pusher} = uploadcare.utils

  namespace 'uploadcare.files', (ns) ->
    class ns.UrlFile
      constructor: (@settings, @url) ->
        @__shutdown = true

      upload: (settings) ->
        return unless @url?

        @uploading = true
        @pollWatcher = new PollWatcher(this, settings)
        @pusherWatcher = new PusherWatcher(this, settings)

        @__state('start')

        @xhr = jQuery.ajax("#{settings.urlBase}/from_url/",
          data: {pub_key: settings.publicKey, source_url: @url}
          dataType: 'jsonp'

        ).done (data) =>
          @token = data.token

          @pollWatcher.watch @token
          @pusherWatcher.watch @token
          jQuery(@pusherWatcher).on 'uploadcare.watch-started', => @pollWatcher.stopWatching()

        .fail (e) =>
          @__state('error')

      cancel: ->
        if @uploading
          @__shutdown = true
          @__cleanup()

      ####### Four States of uploader
      __state: (state, data) ->
        (
          start: =>
            @__shutdown = false
            jQuery(this).trigger('uploadcare.api.uploader.start')

          progress: (data) =>
            return if @__shutdown

            [@loaded, @fileSize] = [data.done, data.total]
            jQuery(this).trigger('uploadcare.api.uploader.progress')

          success: (data) =>
            return if @__shutdown

            @__state('progress', data)

            @__shutdown = true

            [@fileName, @fileId] = [data.original_filename, data.file_id]
            jQuery(this).trigger('uploadcare.api.uploader.load')

            @__cleanup()

          error: =>
            @__shutdown = true
            jQuery(this).trigger('uploadcare.api.uploader.error')

            @__cleanup()
        )[state](data)

      __cleanup: ->
        @uploading = false
        @pusherWatcher.stopWatching()
        @pollWatcher.stopWatching()

    class PusherWatcher
      constructor: (@uploader, @settings) ->
        @pusher = pusher.getPusher(@settings.pusherKey, 'url-upload')

      watch: (@token) ->
        debug('started url watching with pusher')
        @channel = @pusher.subscribe("task-status-#{@token}")

        onStarted = =>
          jQuery(this).trigger 'uploadcare.watch-started'
          @channel.unbind ev, onStarted for ev in ['progress', 'success']

        for ev in ['progress', 'success']
          do (ev) =>
            @channel.bind ev, onStarted
            @channel.bind ev, (data) => @uploader.__state ev, data

        @channel.bind 'fail', (data) => @uploader.__state('error')

      stopWatching: ->
        @pusher.release() if @pusher
        @pusher = null

    class PollWatcher
      constructor: (@uploader, @settings) ->

      watch: (@token) ->
        @interval = setInterval(
          => @__checkStatus (data) =>
            @uploader.__state data.status, data if data.status in ['progress', 'success', 'error']
        250)

      stopWatching: ->
        clearInterval @interval if @interval
        @interval = null

      __error: ->
        @stopWatching()
        @uploader.__state 'error', data

      __checkStatus: (callback) ->
        jQuery.ajax "#{@settings.urlBase}/status/",
          data: {'token': @token}
          dataType: 'jsonp'
        .fail =>
          @__error()

        .done callback
