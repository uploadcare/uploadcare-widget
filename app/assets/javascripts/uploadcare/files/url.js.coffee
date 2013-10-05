# = require uploadcare/utils/pusher

{
  namespace,
  jQuery: $,
  utils
} = uploadcare
{pusher} = uploadcare.utils

namespace 'uploadcare.files', (ns) ->

  class ns.UrlFile extends ns.BaseFile
    allEvents: 'progress success error fail'

    constructor: (settings, @__url) ->
      super

      filename = utils.splitUrlRegex.exec(@__url)[3].split('/').pop()
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
      pusherWatcher = new PusherWatcher(@settings.pusherKey)
      pollWatcher = new PollWatcher("#{@settings.urlBase}/status/")
      @__listenWatcher($([pusherWatcher, pollWatcher]))

      # turn off pollWatcher if we receive any message from pusher
      $(pusherWatcher).one @allEvents, =>
        pollWatcher.stopWatching()

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
          @__uploadDf.reject()
        .done (data) =>
          pusherWatcher.watch data.token
          pollWatcher.watch data.token

      @__uploadDf.always =>
        $([pusherWatcher, pollWatcher]).off(@allEvents)
        pusherWatcher.stopWatching()
        pollWatcher.stopWatching()

    __listenWatcher: (watcher) =>
      watcher
        .on 'progress', (e, data) =>
          @fileSize = data.total
          @__uploadDf.notify(data.done / data.total)

        .on 'success', (e, data) =>
          $(e.target).trigger('progress', data)
          @fileId = data.uuid
          @fileName = data.original_filename
          @__uploadDf.resolve()

        .on 'error fail', @__uploadDf.reject


  class PusherWatcher
    constructor: (pusherKey) ->
      @pusher = pusher.getPusher(pusherKey, 'url-upload')

    watch: (token) ->
      channel = @pusher.subscribe("task-status-#{token}")

      channel.bind_all (ev, data) =>
        $(this).trigger ev, data

    stopWatching: ->
      @pusher.release()


  class PollWatcher
    constructor: (@poolUrl) ->

    watch: (@token) ->
      bind = =>
        @__updateStatus().done =>
          if @interval  # Do not schedule next request if watcher stopped.
            @interval = setTimeout bind, 250
      @interval = setTimeout bind, 0

    stopWatching: ->
      if @interval
        clearTimeout @interval
      @interval = null

    __updateStatus: ->
      utils.jsonp(@poolUrl, {@token})
        .fail (error) =>
          @stopWatching()
          $(this).trigger 'error'
        .done (data) =>
          $(this).trigger data.status, data
