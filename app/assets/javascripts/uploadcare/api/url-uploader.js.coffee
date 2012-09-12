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

        @_state('start')

        @xhr = jQuery.ajax("#{@settings['upload-url-base']}/from_url/",
          data: {pub_key: @settings['public-key'], source_url: url}
          dataType: 'jsonp'

        ).done (data) =>
          @token = data.token

          @pollWatcher.watch @token
          @pusherWatcher.watch @token
          jQuery(@pusherWatcher).on 'uploadcare.watch-started', => @pollWatcher.stopWatching()

        .fail (e) =>
          @_state('error')

      cancel: ->
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
        @pusherWatcher.stopWatching()
        @pollWatcher.stopWatching()

    class PusherWatcher
      constructor: (@uploader) ->
        @pusher = new Pusher(@uploader.settings['pusher-key'])

      watch: (@token) ->
        @channel = @pusher.subscribe("task-status-#{@token}")

        onStarted = =>
          jQuery(this).trigger 'uploadcare.watch-started'
          @channel.unbind ev, onStarted for ev in ['progress', 'success']

        for ev in ['progress', 'success']
          do (ev) =>
            @channel.bind ev, onStarted 
            @channel.bind ev, (data) => console.log(ev, data); @uploader._state ev, data

        @channel.bind 'fail', (data) => @uploader._state('error')

      stopWatching: ->
        @pusher.disconnect() if @pusher
        @pusher = null

    class PollWatcher
      constructor: (@uploader) ->

      watch: (@token) ->
        @interval = setInterval(
          => @_checkStatus (data) =>
            return unless @interval? # maybe we've stopped watching already

            console.log '/status/', data

            @uploader._state data.status, data if data.status in ['progress', 'success', 'error']
        250)

      stopWatching: ->
        clearInterval @interval if @interval
        @interval = null

      _error: ->
        @stopWatching()
        @uploader._state 'error', data

      _checkStatus: (callback) ->
        jQuery.ajax "#{@uploader.settings['upload-url-base']}/status/",
          data: {'token': @token}
          dataType: 'jsonp'
        .fail =>
          @_error()

        .done callback

        
