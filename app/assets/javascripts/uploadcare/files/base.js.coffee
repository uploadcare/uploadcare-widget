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

      @upload = null

      @__uploadDf = $.Deferred()
      @__infoDf = $.Deferred()
      @__promise = null
      @__progressState = 'uploading'
      @__progress = 0

      @__uploadDf.fail (error) =>
        @__infoDf.reject(error, this)

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

    __fileInfo: =>
      uuid: @fileId
      name: @fileName
      size: @fileSize
      isStored: @isStored
      isImage: @isImage
      cdnUrl: @cdnUrl
      cdnUrlModifiers: @cdnUrlModifiers
      previewUrl: @previewUrl

    __cancel: =>
      @__uploadDf.reject('user', this)

    # Empty deferred to use as proto
    __df = $.Deferred()

    __extendPromise: (p) =>
      p.cancel = @__cancel
      p.current = @__fileInfo

      p.progress = (fns) =>
        $.Callbacks().add(fns).fire @__progressInfo() # notify at least once
        __df.progress.call(p, fns)

      p.pipe = => @__extendPromise __df.pipe.apply(p, arguments)
      p.then = => @__extendPromise __df.then.apply(p, arguments)

      p # extended promise

    promise: ->
      return @__promise if @__promise?
      df = $.Deferred()
      @__promise = @__extendPromise df.promise()

      @__uploadDf.progress (progress) =>
        @__progress = progress
        df.notify @__progressInfo()
      @__uploadDf.done =>
        @__progressState = 'uploaded'
        @__progress = 1
        df.notify @__progressInfo()
        @__requestInfo()
      @__infoDf.done =>
        @__progressState = 'ready'
        df.notify @__progressInfo()
        df.resolve @__fileInfo()
      @__infoDf.fail (err) => df.reject err, @__fileInfo()
      @__uploadDf.fail (err) => df.reject err, @__fileInfo()

      @__startUpload()
      @__promise
