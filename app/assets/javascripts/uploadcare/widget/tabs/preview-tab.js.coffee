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
      @__setState 'unknown'
      file = @file
      @file
        .done (info) =>
          if file == @file
            if info.isImage
              @__setState 'image'
            else
              @__setState 'regular'
        .fail (error) =>
          if file == @file
            @__setState 'error', {error}

    # error
    # unknown
    # image
    # regular
    __setState: (state, data) ->
      @file.progress utils.once (progressInfo) =>
        data = $.extend {file: progressInfo.incompleteFileInfo}, data
        @container.empty().append tpl("tab-preview-#{state}", data)
        @__afterRender state

    __afterRender: (state) ->
      if state is 'unknown'
        @__initCircle()
        if @__doCrop
          @__hideDoneButton()
      if state is 'image' and @__doCrop
        @__initCrop()

    __hideDoneButton: ->
      @container.find(PREFIX + 'done').hide()

    __initCrop: ->
      # crop widget can't get container size when container hidden 
      # (dialog hidden) so we need timer here 
      setTimeout (=>
        img = @container.find(PREFIX + 'image')
        container = img.parent()
        doneButton = @container.find(PREFIX + 'done')
        widget = new CropWidget $.extend({}, @settings.__cropParsed, {
          container
          controls: false
        })
        @file.done (info) =>
          widget.croppedImageModifiers(img.attr('src'), info.cdnUrlModifiers)
            .done (opts) =>
              @file = @file.then (info) =>
                prefix = @settings.cdnBase
                info.cdnUrlModifiers = opts.modifiers
                info.cdnUrl = "#{prefix}/#{info.uuid}/#{opts.modifiers or ''}"
                info.crop = opts.crop
                info
        doneButton.addClass('uploadcare-disabled-el')
        widget.onStateChange.add (state) => 
          if state == 'loaded'
            doneButton
              .removeClass('uploadcare-disabled-el')
              .click -> widget.forceDone()

        # REFACTOR: separate templates?
        img.remove()
        @container.find('.uploadcare-dialog-title').text t('dialog.tabs.preview.crop.title')
      ), 100

    __initCircle: ->
      circleEl = @container.find('@uploadcare-dialog-preview-circle')
      if circleEl.length
        circle = new progress.Circle circleEl
        circle.listen @file
