{
  utils,
  utils: {abilities: {URL}},
  ui: {progress},
  templates: {tpl},
  jQuery: $,
  crop: {CropWidget},
  locale: {t}
} = uploadcare

uploadcare.namespace 'widget.tabs', (ns) ->
  class ns.PreviewTab extends ns.BasePreviewTab

    constructor: (@container, @tabButton, @dialogApi, @settings, @name) ->
      super

      $.each @dialogApi.fileColl.get(), (i, file) =>
        @__setFile(file)

      @dialogApi.fileColl.onAdd.add(@__setFile)

      @widget = null
      @__state = null

    __setFile: (@file) =>
      ifCur = (fn) =>
        =>
          if file == @file
            fn.apply(null, arguments)

      tryToLoadImagePreview = utils.once(@__tryToLoadImagePreview)
      tryToLoadVideoPreview = utils.once(@__tryToLoadVideoPreview)

      @__setState('unknown', {})
      @file.progress ifCur (info) =>
        info = info.incompleteFileInfo
        label = (info.name || "") + utils.readableFileSize(info.size, '', ', ')
        @container.find('.uploadcare--preview__file-name').text(label)

        source = info.sourceInfo
        blob = utils.abilities.Blob
        if source.file and blob and source.file instanceof blob
          tryToLoadImagePreview(file, source.file)
          .fail =>
            tryToLoadVideoPreview(file, source.file)

      @file.done ifCur (info) =>
        if @__state == 'video'
          return

        if info.isImage
          # avoid subsequent image states
          if @__state != 'image'
            src = info.originalUrl
            # 1162x684 is 1.5 size of conteiner
            src += "-/preview/1162x693/-/setfill/ffffff/-/format/jpeg/-/progressive/yes/"

            if @settings.previewUrlCallback
               src = @settings.previewUrlCallback(src, info)

            imgInfo = info.originalImageInfo
            @__setState('image', {src, name: info.name, info})
            @initImage([imgInfo.width, imgInfo.height], info.cdnUrlModifiers)
        else
          # , but update if other
          @__setState('regular', {file: info})

      @file.fail ifCur (error, info) =>
        @__setState('error', {error, file: info})

    __tryToLoadImagePreview: (file, blob) =>
      df = $.Deferred()

      if (
        file.state() != 'pending' or
        not blob.size or
        blob.size >= @settings.multipartMinSize
      )
        return df.reject().promise()


      utils.image.drawFileToCanvas(
        blob, 1550, 924, '#ffffff', @settings.imagePreviewMaxSize
      )
      .done (canvas, size) =>
        utils.canvasToBlob canvas, 'image/jpeg', 0.95,
          (blob) =>
            df.resolve()

            canvas.width = canvas.height = 1
            if (
              file.state() != 'pending' or
              @dialogApi.state() != 'pending' or
              @file != file
            )
              return

            src = URL.createObjectURL(blob)
            @dialogApi.always ->
              URL.revokeObjectURL(src)

            if @__state != 'image'
              @__setState('image', {src, name: ""})
              @initImage(size)
      .fail(df.reject)

      df.promise()

    __tryToLoadVideoPreview: (file, blob) =>
      df = $.Deferred()

      if (
        not URL or
        not blob.size
      )
        return df.reject().promise()

      src = URL.createObjectURL(blob)
      op = utils.videoLoader(src)
      op
      .fail =>
        URL.revokeObjectURL(src)
        df.reject()
      .done =>
        df.resolve()

        @dialogApi.always ->
          URL.revokeObjectURL(src)

        @__setState('video')
        videoTag = @container.find('.uploadcare--preview__video')

        # hack to enable seeking due to bug in MediaRecorder API
        # https://bugs.chromium.org/p/chromium/issues/detail?id=569840
        videoTag.on('loadeddata', () ->
          el = videoTag.get(0)
          el.currentTime = 360000 # 100 hours
          videoTag.off('loadeddata')
        )
        videoTag.on('ended', () ->
          el = videoTag.get(0)
          el.currentTime = 0
          videoTag.off('ended')
        )
        # end of hack

        videoTag.attr('src', src)

        # hack to load first-frame poster on ios safari
        videoTag.get(0).load()

      df.promise()

    # error
    # unknown
    # image
    # regular
    __setState: (state, data) =>
      @__state = state
      data = data || {}

      data.crop = @settings.crop
      @container.empty().append(tpl("tab-preview-#{state}", data))
      @container.removeClass (index, classes) ->
        classes
          .split(' ')
          .filter (c) ->
            !!~ c.indexOf 'uploadcare--preview_status_'
          .join ' '

      if state is 'unknown' and @settings.crop
        @container.find('.uploadcare--preview__done').hide()

      if state is 'error'
        @container.addClass('uploadcare--preview_status_error-' + data.error)

    initImage: (imgSize, cdnModifiers) =>
      img = @container.find('.uploadcare--preview__image')
      done = @container.find('.uploadcare--preview__done')

      imgLoader = utils.imageLoader(img[0])
        .done =>
          @container.addClass('uploadcare--preview_status_loaded')
        .fail =>
          @file = null
          @__setState('error', {error: 'loadImage'})

      startCrop = =>
        @container.find('.uploadcare--crop-sizes__item')
          .attr('aria-disabled', false)
          .attr('tabindex', 0)
        done.attr('disabled', false)

        @widget = new CropWidget(img, imgSize, @settings.crop[0])
        if cdnModifiers
          @widget.setSelectionFromModifiers(cdnModifiers)

        done.on 'click', =>
          newFile = @widget.applySelectionToFile(@file)
          @dialogApi.fileColl.replace(@file, newFile)
          true

      if @settings.crop
        @container.find('.uploadcare--preview__title').text(t('dialog.tabs.preview.crop.title'))
        @container.find('.uploadcare--preview__content').addClass('uploadcare--preview__content_crop')
        done.attr('disabled', true)
        done.text(t('dialog.tabs.preview.crop.done'))

        @populateCropSizes()
        @container.find('.uploadcare--crop-sizes__item')
          .attr('aria-disabled', true)
          .attr('tabindex', -1)

        imgLoader.done ->
          # Often IE 11 doesn't do reflow after image.onLoad
          # and actual image remains 28x30 (broken image placeholder).
          # Looks like defer always fixes it.
          utils.defer(startCrop)


    populateCropSizes: =>
      control = @container.find('.uploadcare--crop-sizes')
      template = control.children()
      currentClass = 'uploadcare--crop-sizes__item_current'

      $.each @settings.crop, (i, crop) =>
        prefered = crop.preferedSize
        if prefered
          gcd = utils.gcd(prefered[0], prefered[1])
          caption = "#{prefered[0] / gcd}:#{prefered[1] / gcd}"
        else
          caption = t('dialog.tabs.preview.crop.free')

        item = template.clone().appendTo(control)
          .attr('data-caption', caption)
          .on 'click', (e) =>
            if $(e.currentTarget).attr('aria-disabled') is 'true'
              return
            if not $(e.currentTarget).hasClass(currentClass) and @settings.crop.length > 1 and @widget
              @widget.setCrop(crop)
              control.find('>*').removeClass(currentClass)
              item.addClass(currentClass)
            return
        if prefered
          size = utils.fitSize(prefered, [30, 30], true)
          item.children()
            .css(
              width: Math.max(20, size[0])
              height: Math.max(12, size[1])
            )
        else
          icon = $("<svg width='32' height='32'><use xlink:href='#uploadcare--icon-crop-free'/></svg>")
            .attr('role', 'presentation')
            .attr('class', 'uploadcare--icon')
          item.children()
            .append(icon)
            .addClass('uploadcare--crop-sizes__icon_free')

      template.remove()
      control.find('>*').eq(0).addClass(currentClass)

    onHide: () =>
      video = @container.find('.uploadcare--preview__video').get(0)

      if video and not video.paused
        video.pause()
        video.autoPaused = true

    onShow: () =>
      video = @container.find('.uploadcare--preview__video').get(0)

      if video?.paused and video.autoPaused
        video.play()
        video.autoPaused = false
