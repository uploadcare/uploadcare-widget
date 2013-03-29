{namespace, jQuery: $, utils} = uploadcare

namespace 'uploadcare.files', (ns) ->

  class ns.BaseFile

    constructor: (settings) ->

      @settings = utils.buildSettings settings

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

    __requestInfo: =>
      fail = =>
        @__infoDf.reject('info', this)

      $.ajax "#{@settings.urlBase}/info/",
        data:
          file_id: @fileId
          pub_key: @settings.publicKey
        dataType: 'jsonp'
      .fail(fail)
      .done (data) =>
        return fail() if data.error

        @fileName = data.original_filename
        @fileSize = data.size
        @isImage = data.is_image
        @isStored = data.is_stored
        @__buildPreviewUrl()

        if @settings.imagesOnly && !@isImage
          @__infoDf.reject('image', this)
          return

        @__infoDf.resolve(this)

    __buildPreviewUrl: ->
      if @__tmpFinalPreviewUrl
        @previewUrl = @__tmpFinalPreviewUrl
      else
        @previewUrl = "#{@settings.urlBase}/preview/?file_id=#{@fileId}&pub_key=#{@settings.publicKey}"

    __progressInfo: ->
      state: @__progressState
      uploadProgress: @__progress
      progress: if @__progressState == 'ready' then 1 else @__progress * 0.9
      incompleteFileInfo: @__fileInfo()

    __fileInfo: =>
      cdnUrlPrefix = if @settings.pathValue then '' else @settings.cdnBase
      @cdnUrl ||= "/#{@fileId}/#{@cdnUrlModifiers or ''}"

      uuid: @fileId
      name: @fileName
      size: @fileSize
      isStored: @isStored
      isImage: @isImage
      cdnUrl: "#{cdnUrlPrefix}#{@cdnUrl}"
      cdnUrlModifiers: @cdnUrlModifiers
      previewUrl: @previewUrl

    __cancel: =>
      @__uploadDf.reject('user', this)

    __preview: (p, selector) =>
      p.done (info) =>
        return $(selector).empty() unless info.crop

        opts = info.crop

        img = new Image()
        img.src = @previewUrl
        img.onload = ->
          if opts.sw || opts.sh # Resized?
            sw = opts.sw || opts.sh * opts.w / opts.h
            sh = opts.sh || opts.sw * opts.h / opts.w
          else
            sw = opts.w
            sh = opts.h

          sx = sw / opts.w
          sy = sh / opts.h

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
      @apiDeferred.reject err, @__fileInfo()

    __resolveApi: =>
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
      @__infoDf.done =>
        @__progressState = 'ready'
        @__notifyApi()
        @__resolveApi()
      @__infoDf.fail @__rejectApi
      @__uploadDf.fail @__rejectApi

    promise: ->
      unless @__uploadStarted
        @__uploadStarted = true
        @__startUpload()
      @apiPromise
      
