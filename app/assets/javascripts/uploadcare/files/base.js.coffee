{
  namespace,
  settings: s,
  jQuery: $,
  utils
} = uploadcare

namespace 'uploadcare.files', (ns) ->

  class ns.BaseFile

    constructor: (settings) ->

      @settings = s.build settings

      @fileId = null
      @fileName = null
      @fileSize = null
      @isStored = null
      @cdnUrlModifiers = null
      @isImage = null
      @imageInfo = null
      @isReady = null

      @__uploadDf = $.Deferred()
      @__infoDf = $.Deferred()
      @__progressState = 'uploading'
      @__progress = 0

      @__uploadDf
        .fail (error) =>
          @__infoDf.reject(error, this)
        .done =>
          @__completeUpload()

      @__initApi()
      @__notifyApi()

    __startUpload: -> throw new Error('not implemented')

    __completeUpload: =>
      # Update info until @__infoDf resolved.
      timeout = 100
      do check = =>
        if @__infoDf.state() == 'pending'
          @__updateInfo().done =>
            setTimeout check, timeout
            timeout += 50

    __handleFileData: (data) ->
      @fileName = data.original_filename
      @fileSize = data.size
      @isImage = data.is_image
      @imageInfo = data.image_info
      @isStored = data.is_stored
      @isReady = data.is_ready

      if @settings.imagesOnly && !@isImage
        @__infoDf.reject('image', this)
        return

      if @isReady
        @__infoDf.resolve(this)

    __updateInfo: =>
      utils.jsonp "#{@settings.urlBase}/info/",
        file_id: @fileId,
        pub_key: @settings.publicKey
      .fail =>
        @__infoDf.reject('info', this)
      .done (data) =>
        @__handleFileData(data)

    __progressInfo: ->
      state: @__progressState
      uploadProgress: @__progress
      progress: if @__progressState in ['ready', 'error'] then 1 else @__progress * 0.9
      incompleteFileInfo: @__fileInfo()

    __fileInfo: =>
      uuid: @fileId
      name: @fileName
      size: @fileSize
      isStored: @isStored
      isImage: @isImage
      originalImageInfo: @imageInfo
      originalUrl: "#{@settings.cdnBase}/#{@fileId}/"
      cdnUrl: "#{@settings.cdnBase}/#{@fileId}/#{@cdnUrlModifiers or ''}"
      cdnUrlModifiers: @cdnUrlModifiers
      previewUrl: "#{@settings.cdnBase}/#{@fileId}/"  # deprecated, use originalUrl
      preview: @apiPromise.preview
      dimensions: if @isImage then =>
          window.console?.warn? "'dimensions' method is deprecated. " +
                                "Use originalImageInfo instead."
          $.Deferred().resolve(@imageInfo).promise()
        else null

    __cancel: =>
      @__uploadDf.reject('user', this)

    __preview: (selector) =>
      window.console?.warn? "'preview' method is deprecated. " +
                            "Use fileInfo.cdnUrl as image source."
      @apiPromise.done (info) =>
        img = new Image()
        img.onload = ->
          $(selector).html(
            $('<div>')
              .css
                position: 'relative'
                overflow: 'hidden'
                width: @width
                height: @height
              .append img
          )
        img.src = info.cdnUrl

    __extendApi: (api) =>
      api.cancel = =>
        @__cancel()

      api.preview = (selector) =>
        @__preview(selector)

      __then = api.then
      api.pipe = api.then = =>  # 'pipe' is alias to 'then' from jQuery 1.8
        @__extendApi __then.apply(api, arguments)

      api # extended promise

    __notifyApi: =>
      @apiDeferred.notify @__progressInfo()

    __rejectApi: (err) =>
      @__progress = 1
      @__progressState = 'error'
      @__notifyApi()
      @apiDeferred.reject err, @__fileInfo()

    __resolveApi: =>
      @__progressState = 'ready'
      @__notifyApi()
      @apiDeferred.resolve @__fileInfo()

    __initApi: ->
      @apiDeferred = $.Deferred()
      @apiPromise = @__extendApi @apiDeferred.promise()

      @__uploadDf.progress (progress) =>
        @__progress = progress
        @__notifyApi()
      @__uploadDf.done =>
        @__progressState = 'uploaded'
        @__progress = 1
        @__notifyApi()
      @__infoDf.done @__resolveApi
      @__infoDf.fail @__rejectApi
      @__uploadDf.fail @__rejectApi

    promise: ->
      unless @__uploadStarted
        @__uploadStarted = true
        @__startUpload()
      @apiPromise


namespace 'uploadcare.utils', (utils) ->

  # Check if given obj is file API promise (aka File object)
  utils.isFile = (obj) ->
    return obj and obj.done and obj.fail and obj.cancel

  # Converts any of:
  #   URL
  #   CDN-URL
  #   UUID
  #   File object
  # to File object
  utils.anyToFile = (value, settings) ->
    if value
      if utils.isFile(value)
        value
      else
        uploadcare.fileFrom('url-or-uploaded', value, settings)
    else
      null
