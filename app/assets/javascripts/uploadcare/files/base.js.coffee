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
      cdnUrl: "#{if @settings.pathValue then '' else @settings.cdnBase}#{@cdnUrl}"
      cdnUrlModifiers: @cdnUrlModifiers
      previewUrl: @previewUrl

    __cancel: =>
      @__uploadDf.reject('user', this)

    __preview: (p, selector) =>
      p.done (info) =>
        return $(selector).empty() unless info.isImage

        img = new Image()
        img.src = @previewUrl
        img.onload = ->
          opts =
            x: 0
            y: 0
            w: img.width
            h: img.height
            cw: img.width
            ch: img.height

          modifiers = info.cdnUrlModifiers.split('-/').slice(1)
          for modifier in modifiers
            parts = modifier.split('/')
            switch parts[0]
              when 'resize'
                dims = parts[1].split('x')
                dims[0] = dims[1] * opts.w / opts.h unless dims[0]
                dims[1] = dims[0] * opts.h / opts.w unless dims[1]
                opts.w *= dims[0] / opts.cw
                opts.h *= dims[1] / opts.ch
              when 'crop'
                # -/crop/118x113/
                # -/crop/118x113/53,47/
                # -/crop/118x113/center/
                pt = switch parts[2]
                  when 'center'
                    [(opts.cw - dims[0]) / 2, (opts.ch - dims[1]) / 2]
                  when '' then [0, 0]
                  else parts[2].split(',')
                opts.x += (pt[0] - 0)
                opts.y += (pt[1] - 0)

                dims = parts[1].split('x')
                opts.cw = (dims[0] - 0)
                opts.ch = (dims[1] - 0)

          el = $('<div>').css({
            position: 'relative'
            overflow: 'hidden'
            width: opts.cw
            height: opts.ch
          }).append($(img).css({
            position: 'absolute'
            left: -opts.x
            top: -opts.y
            width: opts.w
            height: opts.h
          }))
          $(selector).html(el)

    __extendPromise: (p) =>
      p.cancel = @__cancel
      p.current = @__fileInfo
      p.preview = (selector) => @__preview(p, selector)

      __progress = p.progress
      p.progress = (fns) =>
        __progress.call(p, fns)

      __pipe = p.pipe
      p.pipe = => @__extendPromise __pipe.apply(p, arguments)

      __then = p.then
      p.then = => @__extendPromise __then.apply(p, arguments)

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
