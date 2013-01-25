# = require uploadcare/utils/pusher

uploadcare.whenReady ->
  {
    namespace,
    jQuery: $,
    utils,
    debug
  } = uploadcare
  {pusher} = uploadcare.utils

  namespace 'uploadcare.files', (ns) ->
    class ns.UrlFile
      constructor: (@url) ->
        @__shutdown = true

      upload: (settings) ->
        @__dfd = $.Deferred()
        settings = utils.buildSettings settings

        unless @url?
          @__dfd.reject(this)
          return @__dfd.promise()

        @uploading = true
        @pollWatcher = new PollWatcher(this, settings)
        @pusherWatcher = new PusherWatcher(this, settings)

        @__state('start')

        @xhr = $.ajax("#{settings.urlBase}/from_url/",
          data: {pub_key: settings.publicKey, source_url: @url}
          dataType: 'jsonp'
        ).done (data) =>
          @token = data.token

          @pollWatcher.watch @token
          @pusherWatcher.watch @token
          $(@pusherWatcher).on 'started', =>
            @pollWatcher.stopWatching()

        .fail (e) =>
          @__state('error')

        @__dfd.promise()

      cancel: ->
        if @uploading
          @__shutdown = true
          @__cleanup()

      ####### Four States of uploader
      __state: (state, data) ->
        (
          start: =>
            @__shutdown = false

          progress: (data) =>
            return if @__shutdown
            [@loaded, @fileSize] = [data.done, data.total]
            @__dfd.notify(this)

          success: (data) =>
            return if @__shutdown
            @__state('progress', data)
            @__shutdown = true
            [@fileName, @fileId] = [data.original_filename, data.file_id]
            @__dfd.resolve(this)
            @__cleanup()

          error: =>
            @__shutdown = true
            @__dfd.reject(this)
            @__cleanup()
        )[state](data)

      __cleanup: ->
        @uploading = false
        @pusherWatcher.stopWatching()
        @pollWatcher.stopWatching()
        @__dfd = null

    class PusherWatcher
      constructor: (@uploader, @settings) ->
        @pusher = pusher.getPusher(@settings.pusherKey, 'url-upload')

      watch: (@token) ->
        debug('started url watching with pusher')
        @channel = @pusher.subscribe("task-status-#{@token}")

        onStarted = =>
          $(this).trigger 'started'
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
        $.ajax "#{@settings.urlBase}/status/",
          data: {'token': @token}
          dataType: 'jsonp'
        .fail =>
          @__error()

        .done callback
