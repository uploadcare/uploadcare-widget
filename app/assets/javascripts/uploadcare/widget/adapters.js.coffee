uploadcare.whenReady ->
  {
    namespace,
    jQuery
  } = uploadcare

  {t} = uploadcare.locale

  namespace 'uploadcare.widget.adapters', (ns) ->
    ns.registeredAdapters = new Object

    class ns.Base
      @registerAdapter: ->
        ns.registeredAdapters[@name.toLowerCase()] = this

      constructor: (@widget) ->

    class ns.Button extends ns.Base
      constructor: (@widget) ->
        super @widget

        # TODO: fix this for IE. http://matt.scharley.me/2012/03/09/monkey-patch-name-ie.html
        @element = @widget.template.addButton(@constructor.name.toLowerCase())

    class ns.File extends ns.Button
      @registerAdapter()

      constructor: (@widget) ->
        super @widget
        @element.css position: 'relative'
        jQuery(@widget).on 'uploadcare.widget.cancel', @__makeInput
        @__makeInput()

      __makeInput: =>
        @input.remove() if @input?
        @input = jQuery('<input>').attr('type', 'file').css(
          opacity: 0
          position: 'absolute'
          top: 0
          left: 0
          width: '100%'
          height: '100%'
          cursor: 'pointer'
          display: 'block'
          overflow: 'hidden'
        )
        @element.append(@input)
        @input.on 'change', @widget.uploader.listener

    class ns.URL extends ns.Button
      @registerAdapter()
      constructor: (@widget) ->
        super @widget
        @element.on 'click', =>
          @widget.urlUploader.upload(prompt(t('buttons.url.prompt')))
