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

    constructor: ->
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
        @container.find('.uploadcare--preview__label').text(label)

        source = info.sourceInfo
        blob = utils.abilities.Blob
        if source.file and blob and source.file instanceof blob
          tryToLoadImagePreview(file, source.file)
          .fail =>
            tryToLoadVideoPreview(file, source.file)

      @file.done ifCur (info) =>
        if @__state == 'video'
          return
        state = if info.isImage then 'image' else 'regular'
        if state != 'image' or state != @__state
          @__setState(state, {file: info})

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
        blob, 1550, 924, '#efefef', @settings.imagePreviewMaxSize
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

            @__setState('image', {file: false})
            @container.find('.uploadcare--preview__image').attr('src', src)
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
        @container.find('.uploadcare--preview__video').attr('src', src)

      df.promise()

    # error
    # unknown
    # image
    # regular
    __setState: (state, data) ->
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

      if state is 'image' and data.file
        imgInfo = data.file.originalImageInfo
        @initImage([imgInfo.width, imgInfo.height], data.file.cdnUrlModifiers)

      if state is 'error'
        @container.addClass('uploadcare--preview_status_error-' + data.error)

    initImage: (imgSize, cdnModifiers) ->
      img = @container.find('.uploadcare--preview__image')
      done = @container.find('.uploadcare--preview__done')

      imgLoader = utils.imageLoader(img[0])
        .done =>
          @container.addClass('uploadcare--preview_status_loaded')
        .fail =>
          @file = null
          @__setState('error', {error: 'loadImage'})

      startCrop = =>
        done.attr('aria-disabled', false)

        @widget = new CropWidget(img, imgSize, @settings.crop[0])
        if cdnModifiers
          @widget.setSelectionFromModifiers(cdnModifiers)

        done.on 'click', =>
          newFile = @widget.applySelectionToFile(@file)
          @dialogApi.fileColl.replace(@file, newFile)
          true

      if @settings.crop
        @container.find('.uploadcare--preview__title').text(t('dialog.tabs.preview.crop.title'))
        done.attr('aria-disabled', true)
        done.text(t('dialog.tabs.preview.crop.done'))

        @populateCropSizes()

        imgLoader.done ->
          # Often IE 11 doesn't do reflow after image.onLoad
          # and actual image remains 28x30 (broken image placeholder).
          # Looks like defer always fixes it.
          utils.defer(startCrop)


    populateCropSizes: ->
      if @settings.crop.length <= 1
        return

      @container.addClass('uploadcare--preview_status_with-sizes')

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
            if @widget
              @widget.setCrop(crop)
              control.find('>*').removeClass(currentClass)
              item.addClass(currentClass)
        if prefered
          size = utils.fitSize(prefered, [30, 30], true)
          item.children()
            .css(
              width: Math.max(20, size[0])
              height: Math.max(12, size[1])
            )
        else
          item.children().addClass('uploadcare--crop-sizes__icon_free')

      template.remove()
      control.find('>*').eq(0).addClass(currentClass)
