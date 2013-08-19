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

    PREFIX = '@uploadcare-dialog-preview-'

    constructor: ->
      super

      @__doCrop = @settings.__cropParsed.enabled

      @dialogApi.fileColl.onAdd.add @__setFile

    __setFile: (@file) =>

      ifCur = (fn) =>
        => fn.apply(null, arguments) if file == @file

      @file.progress ifCur utils.once (info) =>
        @__setState 'unknown', {file: info.incompleteFileInfo}

      @file.done ifCur (file) =>
        state = if file.isImage then 'image' else 'regular'
        @__setState state, {file}

      @file.fail ifCur (error, file) =>
        @__setState 'error', {error, file}

    # error
    # unknown
    # image
    # regular
    __setState: (state, data) ->
      @container.empty().append tpl("tab-preview-#{state}", data)
      @__afterRender state

    __afterRender: (state) ->
      if state is 'unknown' and @__doCrop
        @__hideDoneButton()
      if state is 'image' and @__doCrop
        @__initCrop()

    __hideDoneButton: ->
      @container.find(PREFIX + 'done').hide()

    __initCrop: ->
      # crop widget can't get container size when container hidden
      # (dialog hidden) so we need timer here
      utils.defer =>
        img = @container.find(PREFIX + 'image')
        container = img.parent()
        doneButton = @container.find(PREFIX + 'done')
        widget = new CropWidget $.extend({}, @settings.__cropParsed, {
          container
          controls: false
        })
        doneButton.addClass('uploadcare-disabled-el')
        widget.onStateChange.add (state) =>
          if state == 'loaded'
            doneButton
              .removeClass('uploadcare-disabled-el')
              .click -> widget.forceDone()
        @file.done (info) =>
          widget.croppedImageModifiers(img.attr('src'), info.originalImageInfo,
                                       info.cdnUrlModifiers)
            .done (opts) =>
              @dialogApi.replaceFile @file, @file.then (info) =>
                info.cdnUrlModifiers = opts.modifiers
                info.cdnUrl = "#{@settings.cdnBase}/#{info.uuid}/#{opts.modifiers or ''}"
                info.crop = opts.crop
                info

        # REFACTOR: separate templates?
        img.remove()
        @container.find('.uploadcare-dialog-title').text t('dialog.tabs.preview.crop.title')
        @container.find('@uploadcare-dialog-preview-done').text t('dialog.tabs.preview.crop.done')
