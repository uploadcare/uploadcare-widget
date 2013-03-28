# = require ./preview-tab-multiple

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

    setGroup: (fileGroup) ->
      if @settings.multiple
        new ns.GroupView(@content, fileGroup)
      else
        fileGroup.onFileAdded.add @setFile

    setFile: (@file) =>
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
      data = $.extend {file: @file.current()}, data
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
        prefix = if @settings.pathValue then '' else @settings.cdnBase
        @file.done (info) =>
          widget.croppedImageModifiers(img.attr('src'), info.cdnUrlModifiers)
            .done (modifiers) =>
              @file = @file.then (info) =>
                info.cdnUrlModifiers = modifiers
                info.cdnUrl = "#{prefix}/#{info.uuid}/#{modifiers or ''}"
                info
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
        circle.listen @file
