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
  class ns.PreviewTab

    PREFIX = '@uploadcare-dialog-preview-'

    constructor: (@dialog, @settings) ->
      @onDone = $.Callbacks()
      @onBack = $.Callbacks()
      @__doCrop = @settings.__cropParsed.enabled

    setContent: (@content) ->
      notDisabled = ':not(.uploadcare-disabled-el)'
      @content.on('click', PREFIX + 'back' + notDisabled, @onBack.fire)
      @content.on('click', PREFIX + 'done' + notDisabled, @onDone.fire)

    setFile: (@file) ->
      @__setState 'unknown'
      @file.info()
        .done (file) =>
          if file == @file
            if @file.isImage
              @__setState 'image'
            else
              @__setState 'regular'
        .fail (error, file) =>
          if file == @file
            @__setState 'error', {error}

    # error
    # unknown
    # image
    # regular
    __setState: (state, data) ->
      data = $.extend {@file}, data
      @content.empty().append tpl("tab-preview-#{state}", data)
      @__afterRender state

    __afterRender: (state) ->
      if state is 'unknown'
        @__initCircle()
        if @__doCrop
          @__hideDoneButton()
      if state is 'image' and @__doCrop
        @__initCrop()

    __hideDoneButton: ->
      @content.find(PREFIX + 'done').hide()

    __initCrop: ->
      # crop widget can't get container size when container hidden 
      # (dialog hidden) so we need timer here 
      setTimeout (=>
        img = @content.find(PREFIX + 'image')
        container = img.parent()
        doneButton = @content.find(PREFIX + 'done')
        widget = new CropWidget $.extend({}, @settings.__cropParsed, {
          container
          controls: false
        })
        widget.croppedImageModifiers(img.attr('src'), @file.cdnUrlModifiers)
          .done (modifiers) =>
            @file.updateCdnUrlModifiers modifiers
        doneButton.addClass('uploadcare-disabled-el')
        widget.onStateChange.add (state) => 
          if state == 'loaded'
            doneButton
              .removeClass('uploadcare-disabled-el')
              .click -> widget.forceDone()

        # REFACTOR: separate templates?
        img.remove()
        @content.find('.uploadcare-dialog-title').text t('dialog.tabs.preview.crop.title')
      ), 100

    __initCircle: ->
      circleEl = @content.find('@uploadcare-dialog-preview-circle')
      if circleEl.length
        circle = new progress.Circle circleEl
        circle.listen @file.startUpload()
