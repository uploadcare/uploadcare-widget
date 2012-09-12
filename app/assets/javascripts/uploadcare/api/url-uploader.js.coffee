uploadcare.whenReady ->
  {namespace, jQuery, utils} = uploadcare

  namespace 'uploadcare.api', (ns) ->
    class ns.URLUploader
      constructor: (@settings) ->
        @_shutdown = true

      upload: (url) ->
        return unless url?

        @pollWatcher = new PollWatcher(this)
        @pusherWatcher = new PusherWatcher(this)

        @_stateStart()

        @xhr = jQuery.ajax("#{@settings['upload-url-base']}/from_url/",
          data: {pub_key: @settings['public-key'], source_url: url}
          dataType: 'jsonp'

        ).done (data) =>
          @token = data.token

          @pollWatcher.watch @token
          @pusherWatcher.watch @token
          jQuery(@pusherWatcher).on 'uploadcare.watch-started', => @pollWatcher.stopWatching()

        .fail (e) =>
          @_stateError()

      cancel: ->
        @_shutdown = true
        @_cleanup()

      ####### Four States of uploader
      _stateStart: ->
        @_shutdown = false
        jQuery(this).trigger('uploadcare.api.uploader.start')

      _stateProgress: (data) ->
        return if @_shutdown

        @_state = 'progress'

        [@loaded, @fileSize] = [data.done, data.total]
        jQuery(this).trigger('uploadcare.api.uploader.progress')

      _stateSuccess: (data) ->
        return if @_shutdown

        @_stateProgress(data)

        @_shutdown = true

        [@fileName, @fileId] = [data.original_filename, data.file_id]
        jQuery(this).trigger('uploadcare.api.uploader.load')

        @_cleanup()

      _stateError: ->
        @_shutdown = true
        jQuery(this).trigger('uploadcare.api.uploader.error')

        @_cleanup()

      _cleanup: ->
        @pusherWatcher.stopWatching()
        @pollWatcher.stopWatching()

    class PusherWatcher
      constructor: (@uploader) ->

      watch: (@token) ->
        @pusher = new Pusher(@uploader.settings['pusher-key'])

        @channel = @pusher.subscribe("task-status-#{@token}")

        @channel.bind 'progress', (data) => @uploader._stateProgress(data)
        @channel.bind 'success', (data) => @uploader._stateSuccess(data)
        @channel.bind 'fail', (data) => @uploader._stateError()

        onStarted = =>
          jQuery(this).trigger 'uploadcare.watch-started'
          @channel.unbind ev, onStarted for ev in ['progress', 'success']

        @channel.bind ev, onStarted for ev in ['progress', 'success']

      stopWatching: ->
        @pusher.disconnect() if @pusher
        @pusher = null

    class PollWatcher
      constructor: (@uploader) ->

      watch: (@token) ->
        @interval = setInterval(
          => @_checkStatus (data) =>
            return unless @interval? # maybe we've stopped watching already

            @uploader._stateProgress data if data.status == 'progress'
            @uploader._stateSuccess data if data.status == 'success'
            @uploader._stateError data if data.status == 'error'

        50)

      stopWatching: ->
        clearInterval @interval if @interval
        @interval = null

      _error: ->
        @stopWatching()
        @uploader._stateError data

      _checkStatus: (callback) ->
        jQuery.ajax "#{@uploader.settings['upload-url-base']}/status/",
          data: {'token': @token}
          dataType: 'jsonp'
        .fail =>
          @_error()

        .done callback

        
