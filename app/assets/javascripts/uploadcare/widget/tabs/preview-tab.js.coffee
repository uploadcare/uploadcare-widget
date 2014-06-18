{
  namespace,
  utils,
  ui: {progress},
  templates: {tpl},
  jQuery: $,
  crop: {CropWidget},
  locale: {t}
} = uploadcare

namespace 'uploadcare.widget.tabs', (ns) ->
  class ns.PreviewTab extends ns.BasePreviewTab

    constructor: ->
      super

      $.each @dialogApi.fileColl.get(), (i, file) =>
        @__setFile file

      @dialogApi.fileColl.onAdd.add @__setFile

      @widget = null

    __setFile: (@file) =>
      ifCur = (fn) =>
        =>
          if file == @file
            fn.apply(null, arguments)

      @file.progress ifCur utils.once (info) =>
        @__setState 'unknown', {file: info.incompleteFileInfo}

      @file.done ifCur (file) =>
        state = if file.isImage then 'image' else 'regular'
        @__setState state, {file}

      @file.fail ifCur (error, file) =>
        @__setState 'error', {error, file}

    element: (name) ->
      @container.find('@uploadcare-dialog-preview-' + name)

    # error
    # unknown
    # image
    # regular
    __setState: (state, data) ->
      @container.empty().append tpl("tab-preview-#{state}", data)

      if state is 'unknown' and @settings.crop
        @element('done').hide()
      if state is 'image' and @settings.crop
        @__initCrop(data)

    __initCrop: (data) ->
      @element('title').text t('dialog.tabs.preview.crop.title')
      @element('done').text t('dialog.tabs.preview.crop.done')
      @populateCropSizes()

      img = @element('image')
        .on 'error', =>
          @file = null
          @__setState 'error', error: 'loadImage'

      # crop widget can't get container size when container hidden
      # (dialog hidden) so we need timer here
      utils.defer =>
        return if not @file

        imgSize = [data.file.originalImageInfo.width, data.file.originalImageInfo.height]
        parentSize = [img.parent().width(), img.parent().height() or 600]
        widgetSize = utils.fitSize(imgSize, parentSize)
        img.css width: widgetSize[0], height: widgetSize[1], maxHeight: 'none'

        @widget = new CropWidget img, imgSize, @settings.crop[0]
        @widget.setSelectionFromModifiers(data.file.cdnUrlModifiers)

        @element('done').click =>
          opts = @widget.getSelectionWithModifiers()
          @dialogApi.fileColl.replace @file, @file.then (info) =>
            info.cdnUrlModifiers = opts.modifiers
            info.cdnUrl = "#{info.originalUrl}#{opts.modifiers or ''}"
            info.crop = opts.crop
            info

    populateCropSizes: ->
      if @settings.crop.length <= 1
        return

      @element('root').addClass('uploadcare-dialog-preview---with-sizes')

      control = @element('crop-sizes').show()
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
        item
          .attr('data-caption', caption)
          .on 'click', (e) =>
            if @widget
              @widget.setCrop(crop)
              control.find('>*').removeClass(currentClass)
              item.addClass(currentClass)
        if prefered
          size = utils.fitSize(prefered, [40, 40], true)
          item.children()
            .css
              width: Math.max 20, size[0]
              height: Math.max 12, size[1]
      template.remove()
      control.find('>*').eq(0).addClass(currentClass)
