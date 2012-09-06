uploadcare.whenReady ->
  {
    namespace,
    initialize,
    include,
    jQuery
  } = uploadcare

  {t} = uploadcare.locale

  namespace 'uploadcare.widget.adapters', (ns) ->
    ns.registeredAdapters = new Object
    ns.__registeredButtons = new Object
    ns.__registeredFileChoosers = new Object

    ns.Button =
      abc: ->

    class ns.Base
      @registerAdapter: ->
        ns.registeredAdapters[@name.toLowerCase()] = this
      @registerButton: ->
        include this, ns.Button
        ns.__registeredButtons[@name.toLowerCase()] = this

      constructor: (@widget, @element) ->

    class ns.File extends ns.Base
      @registerAdapter()

      constructor: (@widget, @element) ->
        super @widget, @element
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

    class ns.URL extends ns.Base
      @registerAdapter()
      constructor: (@widget, @element) ->
        super @widget, @element
        @element.on 'click', =>
          @widget.urlUploader.upload(prompt(t('buttons.url.prompt')))
