{
  utils,
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

    __setFile: (@file) =>
      ifCur = (fn) =>
        =>
          if file == @file
            fn.apply(null, arguments)

      @__setState('unknown', {})
      @file.progress ifCur (info) =>
        info = info.incompleteFileInfo
        label = (info.name || "") + utils.readableFileSize(info.size, '', ', ')
        @element('label').text(label)

      @file.done ifCur (info) =>
        state = if info.isImage then 'image' else 'regular'
        @__setState(state, {file: info})

      @file.fail ifCur (error, info) =>
        @__setState('error', {error, file: info})

    element: (name) ->
      @container.find('.uploadcare-dialog-preview-' + name)

    # error
    # unknown
    # image
    # regular
    __setState: (state, data) ->
      @container.empty().append(tpl("tab-preview-#{state}", data))

      if state is 'unknown' and @settings.crop
        @element('done').hide()
      if state is 'image'
        @initImage(data.file)

    initImage: (info) ->
      img = @element('image')
      done = @element('done')
      imgSize = [info.originalImageInfo.width,
                 info.originalImageInfo.height]

      imgLoader = utils.imageLoader(img.attr('src'))
        .done =>
          @element('root').addClass('uploadcare-dialog-preview--loaded')
        .fail =>
          @file = null
          @__setState('error', {error: 'loadImage'})

      startCrop = =>
        done.removeClass('uploadcare-disabled-el')

        @widget = new CropWidget(img, imgSize, @settings.crop[0])
        @widget.setSelectionFromModifiers(info.cdnUrlModifiers)

        done.on 'click', =>
          newFile = @widget.applySelectionToFile(@file)
          @dialogApi.fileColl.replace(@file, newFile)
          true

      if @settings.crop
        @element('title').text(t('dialog.tabs.preview.crop.title'))
        done.addClass('uploadcare-disabled-el')
        done.text(t('dialog.tabs.preview.crop.done'))

        @populateCropSizes()

        imgLoader.done ->
          utils.defer(startCrop)


    populateCropSizes: ->
      if @settings.crop.length <= 1
        return

      @element('root').addClass('uploadcare-dialog-preview--with-sizes')

      control = @element('crop-sizes')
      template = control.children()
      currentClass = 'uploadcare-crop-size--current'

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
          size = utils.fitSize(prefered, [40, 40], true)
          item.children()
            .css(
              width: Math.max(20, size[0])
              height: Math.max(12, size[1])
            )

      template.remove()
      control.find('>*').eq(0).addClass(currentClass)
