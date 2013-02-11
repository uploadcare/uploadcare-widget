uploadcare.whenReady ->
  {
    namespace,
    utils,
    jQuery: $
  } = uploadcare

  {tpl} = uploadcare.templates

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
        if @file.isImage and @file.previewUrl
          @__setState 'image'
        @file.info()
          .done (file) =>
            if file == @file and @state == 'unknown'
              if @file.isImage
                @__setState 'image'
              else
                @__setState 'regular'
          .fail (error, file) =>
            if file == @file
              @__setState 'error'

      # error
      # unknown
      # image
      # regular
      # TODO: crop
      __setState: (@state) ->
        @content.empty().append tpl("tab-preview-#{state}", {@file})
