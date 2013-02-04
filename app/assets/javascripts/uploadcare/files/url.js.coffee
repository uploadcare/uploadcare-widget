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

    class ns.UrlFile extends ns.BaseFile
      constructor: (settings, @__url) ->
        super
        @__shutdown = true
        @previewUrl = @__url
        @fileName = utils.parseUrl(@__url).pathname.split('/').pop() or null

      __startUpload: ->

        @__pollWatcher = new PollWatcher(this, @settings)
        @__pusherWatcher = new PusherWatcher(this, @settings)

        @__state('start')

        $.ajax("#{@settings.urlBase}/from_url/",
          data: {pub_key: @settings.publicKey, source_url: @__url}
          dataType: 'jsonp'
        ).done (data) =>
          @__token = data.token
          @__pollWatcher.watch @__token
          @__pusherWatcher.watch @__token
          $(@__pusherWatcher).on 'started', =>
            @__pollWatcher.stopWatching()

        .fail (e) =>
          @__state('error')

        @__uploadDf.always =>
          @__shutdown = true
          @__pusherWatcher.stopWatching()
          @__pollWatcher.stopWatching()

        @__uploadDf.promise()

      
      ####### Four States of uploader
      __state: (state, data) ->
        (
          start: =>
            @__shutdown = false

          progress: (data) =>
            return if @__shutdown
            @fileSize = data.total
            @__uploadDf.notify(data.total / data.done, this)

          success: (data) =>
            return if @__shutdown
            @__state('progress', data)
            [@fileName, @fileId] = [data.original_filename, data.file_id]
            @__uploadDf.resolve(this)

          error: =>
            @__uploadDf.reject('upload', this)
        )[state](data)


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
