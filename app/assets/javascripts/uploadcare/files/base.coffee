{
  namespace,
  settings: s,
  jQuery: $,
  utils
} = uploadcare

namespace 'files', (ns) ->

  # progressState: one of 'error', 'ready', 'uploading', 'uploaded'
  # internal api
  #   __notifyApi: file upload in progress
  #   __resolveApi: file is ready
  #   __rejectApi: file failed on any stage
  #   __completeUpload: file uploaded, info required

  class ns.BaseFile

    constructor: (param, @settings, @sourceInfo={}) ->
      @fileId = null
      @fileName = null
      @sanitizedName = null
      @fileSize = null
      @isStored = null
      @cdnUrlModifiers = null
      @isImage = null
      @imageInfo = null
      @mimeType = null
      @s3Bucket = null
      @sourceInfo.source ||= @sourceName

      # this can be exposed in the future
      @onInfoReady = $.Callbacks('once memory')

      @__setupValidation()
      @__initApi()

    __startUpload: ->
      $.Deferred().resolve()

    #
    # Complete uploading
    #

    __completeUpload: =>
      # Update info until @apiDeferred resolved.
      ncalls = 0
      if @settings.debugUploads
        utils.debug("Load file info.", @fileId, @settings.publicKey)
        logger = setInterval(=>
            utils.debug("Still waiting for file ready.", ncalls, @fileId,
                        @settings.publicKey)
          , 5000)
        @apiDeferred
          .done =>
            utils.debug("File uploaded.", ncalls, @fileId, @settings.publicKey)
          .always =>
            clearInterval(logger)

      timeout = 100
      do check = =>
        if @apiDeferred.state() == 'pending'
          ncalls += 1
          @__updateInfo().done =>
            setTimeout(check, timeout)
            timeout += 50

    __updateInfo: =>
      utils.jsonp("#{@settings.urlBase}/info/", 'GET', {
          jsonerrors: 1
          file_id: @fileId
          pub_key: @settings.publicKey
          wait_is_ready: +@onInfoReady.fired()
        },
        headers: {'X-UC-User-Agent': @settings._userAgent})
        .fail (reason) =>
          if @settings.debugUploads
            utils.log("Can't load file info. Probably removed.",
                      @fileId, @settings.publicKey, reason)
          @__rejectApi('info')
        .done(@__handleFileData)

    __handleFileData: (data) =>
      @fileName = data.original_filename
      @sanitizedName = data.filename
      @fileSize = data.size
      @isImage = data.is_image
      @imageInfo = data.image_info
      @mimeType = data.mime_type
      @isStored = data.is_stored
      @s3Bucket = data.s3_bucket
      if data.default_effects
        @cdnUrlModifiers = "-/" + data.default_effects

      if @s3Bucket and @cdnUrlModifiers
        @__rejectApi('baddata')

      if not @onInfoReady.fired()
        @onInfoReady.fire(@__fileInfo())

      if data.is_ready
        @__resolveApi()

    #
    # Retrieve info
    #

    __progressInfo: ->
      state: @__progressState
      uploadProgress: @__progress
      progress: if @__progressState in ['ready', 'error']
          1
        else
          @__progress * 0.9
      incompleteFileInfo: @__fileInfo()

    __fileInfo: =>
      if @s3Bucket
        urlBase = "https://#{@s3Bucket}.s3.amazonaws.com/#{@fileId}/#{@sanitizedName}"
      else
        urlBase = "#{@settings.cdnBase}/#{@fileId}/"

      uuid: @fileId
      name: @fileName
      size: @fileSize
      isStored: @isStored
      isImage: not @s3Bucket and @isImage
      originalImageInfo: @imageInfo
      mimeType: @mimeType
      originalUrl: if @fileId then urlBase else null
      cdnUrl: if @fileId
          "#{urlBase}#{@cdnUrlModifiers or ''}"
        else
          null
      cdnUrlModifiers: @cdnUrlModifiers
      sourceInfo: @sourceInfo

    #
    # Validators
    #

    __setupValidation: ->
      @validators = @settings.validators or @settings.__validators or []

      if @settings.imagesOnly
        @validators.push (info) ->
          if info.isImage is false
            throw new Error('image')

      @onInfoReady.add(@__runValidators)

    __runValidators: (info) =>
      info = info || @__fileInfo()
      try
        for v in @validators
          v(info)
      catch err
        @__rejectApi(err.message)

    #
    # Internal API control
    #

    __initApi: ->
      @apiDeferred = $.Deferred()

      @__progressState = 'uploading'
      @__progress = 0
      @__notifyApi()

    __notifyApi: ->
      @apiDeferred.notify(@__progressInfo())

    __rejectApi: (err) =>
      @__progressState = 'error'
      @__notifyApi()
      @apiDeferred.reject(err, @__fileInfo())

    __resolveApi: =>
      @__progressState = 'ready'
      @__notifyApi()
      @apiDeferred.resolve(@__fileInfo())

    #
    # External API
    #

    __cancel: =>
      @__rejectApi('user')

    __extendApi: (api) =>
      api.cancel = @__cancel

      api.pipe = api.then = =>  # 'pipe' is alias to 'then' from jQuery 1.8
        @__extendApi(utils.fixedPipe(api, arguments...))

      api # extended promise

    promise: ->
      if not @__apiPromise
        @__apiPromise = @__extendApi(@apiDeferred.promise())

        @__runValidators()
        if @apiDeferred.state() == 'pending'
          op = @__startUpload()
          op.done =>
            @__progressState = 'uploaded'
            @__progress = 1
            @__notifyApi()
            @__completeUpload()
          op.progress (progress) =>
            if progress > @__progress
              @__progress = progress
              @__notifyApi()
          op.fail =>
            @__rejectApi('upload')
          @apiDeferred.always(op.reject)

      @__apiPromise


namespace 'utils', (utils) ->

  # Check if given obj is file API promise (aka File object)
  utils.isFile = (obj) ->
    return obj and obj.done and obj.fail and obj.cancel

  # Converts user-given value to File object.
  utils.valueToFile = (value, settings) ->
    if value and not utils.isFile(value)
      value = uploadcare.fileFrom('uploaded', value, settings)
    value or null
