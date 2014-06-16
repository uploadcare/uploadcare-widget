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
      @__afterRender state

    __afterRender: (state) ->
      if state is 'unknown' and @settings.crop
        @element('done').hide()
      if state is 'image' and @settings.crop
        @__initCrop()

    __initCrop: ->
      # crop widget can't get container size when container hidden
      # (dialog hidden) so we need timer here
      utils.defer =>
        @file.done (info) =>
          img = @element('image')
          imgSize = [info.originalImageInfo.width, info.originalImageInfo.height]
          wrap = img.parent()
          widgetSize = utils.fitSize(imgSize, [wrap.width(), wrap.height()])

          img.css width: widgetSize[0], height: widgetSize[1]

          widget = new CropWidget img, imgSize, @settings.crop[0]
          widget.croppedImageModifiers(info.cdnUrlModifiers)
            .done (opts) =>
              @dialogApi.fileColl.replace @file, @file.then (info) =>
                info.cdnUrlModifiers = opts.modifiers
                info.cdnUrl = "#{@settings.cdnBase}/#{info.uuid}/#{opts.modifiers or ''}"
                info.crop = opts.crop
                info

          @element('done').click ->
            widget.forceDone()

        @container.find('.uploadcare-dialog-title').text t('dialog.tabs.preview.crop.title')
        @container.find('@uploadcare-dialog-preview-done').text t('dialog.tabs.preview.crop.done')
