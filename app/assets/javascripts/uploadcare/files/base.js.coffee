{
  namespace,
  settings: s,
  jQuery: $,
  utils
} = uploadcare

namespace 'uploadcare.files', (ns) ->

  # progressState: one of 'error', 'ready', 'uploading', 'uploaded'
  # internal api
  #   __notifyApi: file upload in progress
  #   __resolveApi: file is ready
  #   __rejectApi: file failed on any stage
  #   __completeUpload: file uploaded, info required

  class ns.BaseFile

    constructor: (@settings) ->
      @fileId = null
      @fileName = null
      @fileSize = null
      @isStored = null
      @cdnUrlModifiers = null
      @isImage = null
      @imageInfo = null

      @__initApi()

    __startUpload: ->
      throw new Error('not implemented')

    __completeUpload: =>
      # Update info until @apiPromise resolved.
      timeout = 100
      do check = =>
        if @apiPromise.state() == 'pending'
          @__updateInfo().done =>
            setTimeout check, timeout
            timeout += 50

    __handleFileData: (data) =>
      @fileName = data.original_filename
      @fileSize = data.size
      @isImage = data.is_image
      @imageInfo = data.image_info
      @isStored = data.is_stored

      if @settings.imagesOnly && !@isImage
        @__infoDf.reject('image', this)
        return

      if data.is_ready
        @__resolveApi()

    __updateInfo: =>
      utils.jsonp "#{@settings.urlBase}/info/",
        file_id: @fileId,
        pub_key: @settings.publicKey
      .fail =>
        @__rejectApi('info')
      .done @__handleFileData

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
          utils.warnOnce "'dimensions' method is deprecated. " +
                         "Use originalImageInfo instead."
          $.Deferred().resolve(@imageInfo).promise()
        else null

    __cancel: =>
      @__uploadDf.reject('user')

    __preview: (selector) =>
      utils.warnOnce "'preview' method is deprecated. " +
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
        img.src = "#{info.cdnUrl}-/preview/1600x1600/"

    __extendApi: (api) =>
      api.cancel = @__cancel
      api.preview = @__preview

      __then = api.then
      api.pipe = api.then = =>  # 'pipe' is alias to 'then' from jQuery 1.8
        @__extendApi __then.apply(api, arguments)

      api # extended promise

    __notifyApi: ->
      @apiDeferred.notify @__progressInfo()

    __rejectApi: (err) =>
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

      @__progressState = 'uploading'
      @__progress = 0
      @__notifyApi()

      @__uploadDf = $.Deferred()
        .done(@__completeUpload)
        .done =>
          @__progressState = 'uploaded'
          @__progress = 1
          @__notifyApi()
        .progress (progress) =>
          if progress > @__progress
            @__progress = progress
            @__notifyApi()
        .fail =>
          @__rejectApi('upload')

    promise: ->
      unless @__uploadStarted
        @__uploadStarted = true
        @__startUpload()
      @apiPromise


namespace 'uploadcare.utils', (utils) ->

  # Check if given obj is file API promise (aka File object)
  utils.isFile = (obj) ->
    return obj and obj.done and obj.fail and obj.cancel

  # Converts user-given value to File object.
  utils.valueToFile = (value, settings) ->
    if value and not utils.isFile(value)
      value = uploadcare.fileFrom('uploaded', value, settings)
    value
