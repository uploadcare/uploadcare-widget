uploadcare.whenReady ->
  {
    namespace,
    jQuery: $
  } = uploadcare

  {t} = uploadcare.locale

  namespace 'uploadcare.widget.adapters', (ns) ->
    class ns.FileAdapter extends ns.BaseAdapter
      @registerAs 'file'
      constructor: (@widget, @uploader) ->
        super @widget
        $(@widget).on 'uploadcare.widget.cancel', => @makeInputs()
        @makeInputs()
        @makeDragndrop()

      makeInputs: ->
        @makeInput @button, @uploader.listener
        @makeInput @tab.find('@uploadcare-dialog-browse-file'), (e) =>
          @widget.dialog.close()
          @uploader.listener(e)

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
        area = $('<div>')
          .addClass('uploadcare-widget-dragndrop-area')
          .text(t('draghere'))
        @widget.template.content.append(area)

        area.on 'drop', (e) =>
          @hideDragarea()
          @uploader.listener(e)

        dialogArea = @tab.find('@uploadcare-dialog-drop-file')
        dialogArea.on 'drop', (e) =>
          @widget.dialog.close()
          @uploader.listener(e)

        $(window).on 'mouseenter', =>
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
