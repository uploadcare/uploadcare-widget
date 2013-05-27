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
      @cdnUrl = null
      @cdnUrlModifiers = null
      @previewUrl = null
      @isImage = null

      @__uploadDf = $.Deferred()
      @__infoDf = $.Deferred()
      @__progressState = 'uploading'
      @__progress = 0

      @__uploadDf
        .fail (error) =>
          @__infoDf.reject(error, this)
        .done =>
          @__requestInfo()

      @__initApi()
      @__notifyApi()

    __startUpload: -> throw new Error('not implemented')

    __handleFileData: (data) ->
      @fileName = data.original_filename
      @fileSize = data.size
      @isImage = data.is_image
      @isStored = data.is_stored or data.is_public
      @__buildPreviewUrl()

      if @settings.imagesOnly && !@isImage
        @__infoDf.reject('image', this)
        return

      @__infoDf.resolve(this)

    __requestInfo: =>
      utils.jsonp "#{@settings.urlBase}/info/",
        file_id: @fileId,
        pub_key: @settings.publicKey
      .fail =>
        @__infoDf.reject('info', this)
      .done (data) =>
        @__handleFileData(data)

    __buildPreviewUrl: ->
      @previewUrl = "#{@settings.urlBase}/preview/?file_id=#{@fileId}&pub_key=#{@settings.publicKey}"

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
      cdnUrl: "#{@settings.cdnBase}/#{@fileId}/#{@cdnUrlModifiers or ''}"
      cdnUrlModifiers: @cdnUrlModifiers
      previewUrl: @previewUrl
      preview: @apiPromise.preview
      dimensions: @dimensions

    dimensions: =>
      url = @previewUrl

      $.Deferred(->
        img = new Image()

        img.onload = =>
          @resolve
            width: img.width
            height: img.height

        img.src = url
      ).promise()

    __cancel: =>
      @__uploadDf.reject('user', this)

    __preview: (p, selector) =>
      p.done (info) =>
        return $(selector).empty() unless info.crop

        opts = info.crop

        img = new Image()
        img.onload = ->
          if opts.sw || opts.sh # Resized?
            sw = opts.sw || opts.sh * opts.width / opts.height
            sh = opts.sh || opts.sw * opts.height / opts.width
          else
            sw = opts.width
            sh = opts.height

          sx = sw / opts.width
          sy = sh / opts.height

          el = $('<div>').css({
            position: 'relative'
            overflow: 'hidden'
            width: sw
            height: sh
          }).append($(img).css({
            position: 'absolute'
            left: opts.x * -sx
            top: opts.y * -sy
            width: img.width * sx
            height: img.height * sy
          }))
          $(selector).html(el)
        img.src = @previewUrl

    __extendPromise: (p) =>
      p.cancel = @__cancel
      p.preview = (selector) => @__preview(p, selector)

      __pipe = p.pipe
      p.pipe = => @__extendPromise __pipe.apply(p, arguments)

      __then = p.then
      p.then = => @__extendPromise __then.apply(p, arguments)

      p # extended promise

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
      @apiPromise = @__extendPromise @apiDeferred.promise()

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
        uploadcare.fileFrom('url', value, settings)
    else
      null
