uploadcare.whenReady ->
  {
    namespace,
    utils,
    ui: {progress},
    templates: {tpl},
    jQuery: $
  } = uploadcare

  namespace 'uploadcare.widget.tabs', (ns) ->
    class ns.PreviewTab

      PREFIX = '@uploadcare-dialog-preview-'

      constructor: (@dialog, @settings) ->
        @onDone = $.Callbacks()
        @onBack = $.Callbacks()

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
      # TODO: crop
      __setState: (state, data) ->
        data = $.extend {@file}, data
        @content.empty().append tpl("tab-preview-#{state}", data)
        @__initCircle()

      __initCircle: ->
        circleEl = @content.find('@uploadcare-dialog-preview-circle')
        if circleEl.length
          circle = new progress.Circle circleEl
          circle.listen @file.startUpload()
