uploadcare.whenReady ->
  {
    namespace,
    utils,
    jQuery: $
  } = uploadcare

  {t} = uploadcare.locale

  namespace 'uploadcare.widget.adapters', (ns) ->
    class ns.FileAdapter extends ns.BaseAdapter
      @registerAs 'file'
      constructor: (@widget) ->
        super @widget
        $(@widget).on 'uploadcare.widget.cancel', => @makeInputs()
        @makeInputs()
        @makeDragndrop()

      makeInputs: ->
        @makeInput @button, @widget.upload.fromFileEvent
        @makeInput @tab.find('@uploadcare-dialog-browse-file'), (e) =>
          @widget.dialog.close()
          @widget.upload.fromFileEvent(e)

      makeInput: (container, fn) ->
        container.find('input:file').remove()
        input = $('<input>')
          .attr('type', 'file')
          .on('change', fn)
          .css(
            opacity: 0
            position: 'absolute'
            top: 0
            left: 0
            width: '100%'
            height: '100%'
            cursor: 'pointer'
            display: 'block'
            fontSize: '2em'
          )
        container
          .css(
            position: 'relative'
            overflow: 'hidden'
          )
          .append(input)

      makeDragndrop: ->
        return unless utils.abilities.canFileAPI()

        dragover = (e) ->
          e.stopPropagation() # Prevent redirect
          e.preventDefault()
          e.originalEvent.dataTransfer.dropEffect = 'copy'

        area = $('<div>')
          .addClass('uploadcare-widget-dragndrop-area')
          .text(t('draghere'))
          .appendTo(@widget.template.content)
          .on('dragover', dragover)
          .on 'drop', (e) =>
            @hideDragarea()
            dt = e.originalEvent.dataTransfer
            if dt.files.length
              @widget.upload.fromFileEvent(e)
            else
              uris = dt.getData('text/uri-list')
              if uris && @widget.adapters.url?
                @widget.upload.fromUrl(uris.split('\n')[0])

        dialogArea = @tab
          .find('@uploadcare-dialog-drop-file')
          .on('dragover', dragover)
          .on 'drop', (e) =>
            @widget.dialog.close()
            @widget.upload.fromFileEvent(e)

        $(window).on 'mouseenter dragend', =>
          return unless @widget.available
          @hideDragarea()

        $('body').on 'dragenter', (e) =>
          return unless @widget.available
          return if @notified
          return if @widget.dialog.isVisible()
          @showDragarea()

        $('body').on 'dragleave', (e) =>
          return unless @widget.available
          return unless e.target == e.currentTarget
          @hideDragarea()

      showDragarea: ->
        @widget.template.addState('dragover')
        @notified = true

      hideDragarea: ->
        @widget.template.removeState('dragover')
        @notified = false
