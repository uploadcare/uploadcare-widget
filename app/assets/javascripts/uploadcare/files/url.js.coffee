# = require uploadcare/utils/pusher

{
  namespace,
  jQuery: $,
  utils
} = uploadcare
{pusher} = uploadcare.utils

namespace 'uploadcare.files', (ns) ->

  class ns.UrlFile extends ns.BaseFile
    constructor: (settings, @__url) ->
      super
      @__shutdown = true
      @previewUrl = @__url

      filename = utils.parseUrl(@__url).pathname.split('/').pop()
      if filename
        try
          @fileName = decodeURIComponent(filename)
        catch err
          @fileName = filename

      @__notifyApi()

    setName: (name) ->
      @__realFileName = name
      @fileName = name
      @__notifyApi()

    setIsImage: (isImage) ->
      @isImage = isImage
      @__notifyApi()

    __startUpload: ->

      @__pollWatcher = new PollWatcher(this, @settings)
      @__pusherWatcher = new PusherWatcher(this, @settings)

      @__state('start')

      data =
        pub_key: @settings.publicKey
        source_url: @__url
        filename: @__realFileName or ''
      if @settings.autostore
        data.store = 1

      utils.jsonp("#{@settings.urlBase}/from_url/", data)
        .fail (error) =>
          if @settings.autostore && /autostore/i.test(error)
            utils.commonWarning('autostore')
          @__state('error')
        .done (data) =>
          @__token = data.token
          @__pollWatcher.watch @__token
          @__pusherWatcher.watch @__token
          $(@__pusherWatcher).on 'started', =>
            @__pollWatcher.stopWatching()

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
          @__uploadDf.notify(data.done / data.total, this)

        success: (data) =>
          return if @__shutdown
          @__state('progress', data)
          [@fileName, @fileId] = [data.original_filename, data.uuid]
          @__uploadDf.resolve(this)

        error: =>
          @__uploadDf.reject('upload', this)
      )[state](data)


  class PusherWatcher
    constructor: (@uploader, @settings) ->
      @pusher = pusher.getPusher(@settings.pusherKey, 'url-upload')

    watch: (@token) ->
      @channel = @pusher.subscribe("task-status-#{@token}")

      onStarted = =>
        $(this).trigger 'started'
        @channel.unbind ev, onStarted for ev in ['progress', 'success']

      for ev in ['progress', 'success']
        do (ev) =>
          @channel.bind ev, (data) => @uploader.__state ev, data
          @channel.bind ev, onStarted  # self-removed callback should be last!

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
      @uploader.__state 'error'

    __checkStatus: (callback) ->
      utils.jsonp("#{@settings.urlBase}/status/", {@token})
        .fail (error) =>
          @__error()
        .done (data) ->
          callback(data)
