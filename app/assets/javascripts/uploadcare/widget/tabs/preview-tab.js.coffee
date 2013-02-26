uploadcare.whenReady ->
  {
    namespace,
    utils,
    ui: {progress},
    templates: {tpl},
    jQuery: $,
    crop: {CropWidget}
  } = uploadcare

  namespace 'uploadcare.widget.tabs', (ns) ->
    class ns.PreviewTab

      PREFIX = '@uploadcare-dialog-preview-'

      constructor: (@dialog, @settings) ->
        @onDone = $.Callbacks()
        @onBack = $.Callbacks()
        @__doCrop =  @settings.cropEnabled

      setContent: (@content) ->
        @content.on('click', PREFIX + 'back', @onBack.fire)
        @content.on('click', PREFIX + 'done', @onDone.fire)

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
          widget = new CropWidget {container, controls: false}
          img.remove()
          widget.croppedImageModifiers(img.attr 'src')
            .done (modifiers) =>
              @file.updateCdnUrlModifiers modifiers
            .fail =>
              # TODO
          doneButton
            .prop('disabled', true)
            .click -> widget.forceDone()
          widget.onStateChange.add (state) => 
            doneButton.prop('disabled', state != 'loaded')
        ), 100

      __initCircle: ->
        circleEl = @content.find('@uploadcare-dialog-preview-circle')
        if circleEl.length
          circle = new progress.Circle circleEl
          circle.listen @file.startUpload()
