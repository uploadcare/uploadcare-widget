# = require ./jquery.Jcrop

uploadcare.whenReady ->
  {
    namespace,
    jQuery: $
  } = uploadcare
  {tpl} = uploadcare.templates

  namespace 'uploadcare.crop', (ns) ->

    class ns.CropWidget

      defaultOptions =

        # DOM element or selector or jQuery object to which widget 
        # will be appended (required)
        container: null

        # If set to `true` the resize method will be appended to result URL
        # like "-/resize/%preferedSize%/". (optional)
        scale: true

        # If set to `true` image in widget will be scaled up 
        # to widget size if necessary. (optional)
        upscale: false

        # Defines widget size. if set to `null` widget size will be equal 
        # to the `container` size. Syntax: '123x123'. (optional)
        widgetSize: null

        # Defines image size you want to get at the end.
        # If `scale` option is set to `false`, it defines only 
        # the prefered aspect ratio.
        # If set to `null` any aspect ratio will be acceptable.
        # Syntax: '123x123'. (optional)
        preferedSize: null

        # Specifies whether to show done button in widget or not. (optional)
        controls: true

      LOADING_ERROR = 'loadingerror'
      IMAGE_CLEARED = 'imagecleared'
      CONTROLS_HEIGHT = 30

      checkOptions = (options) ->
        throw "options.container must be specified" unless options.container
        for option in ['widgetSize', 'preferedSize']
          value = options[option]
          unless !value or (typeof value is 'string' and value.match /^\d+x\d+$/i)
            throw "options.#{option} must follow pattern '123x456' or be falsy"

      fitSize = (objWidth, objHeight, boxWidth, boxHeight, upscale=false) ->
        if objWidth > boxWidth or objHeight > boxHeight or upscale
          if boxWidth / boxHeight < objWidth / objHeight
            [boxWidth, Math.floor(objHeight / objWidth * boxWidth)]
          else
            [Math.floor(objWidth / objHeight * boxHeight), boxHeight]
        else
          [objWidth, objHeight]

      # Example:
      #   new CropWidget
      #     container: '.crop-widget-home'
      #     upscale: true
      #     widgetSize: '500x300'
      #     preferedSize: '100x100'
      constructor: (options) ->
        @__options = $.extend {}, defaultOptions, options
        option.scale = false unless options.preferedSize
        checkOptions @__options
        @__buildWidget()
        
      # Example:
      #   cropWidget = new CropWidget( ... )
      #   cropWidget.croppedImageUrl('http://ucarecdn.com/%something%/')
      #     .done (url) ->
      #       # ...
      #     .fail (error) ->
      #       # ...
      croppedImageUrl: (originalUrl) ->
        @__clearImage()
        @__setImage originalUrl
        @__deferred.promise()

      # This method could be usefull if you want to make your own done button.
      forceDone: ->
        if @__state is 'loaded'
          @__deferred.resolve @__buildUrl @getCurrentCoords()
        else
          throw "not ready"

      # Returns last selected area coords
      getCurrentCoords: ->
        scaleRatio = @__resizedWidth / @__originalWidth
        fixedCoords = {}
        for key, value of @__currentCoords
          fixedCoords[key] = Math.round value / scaleRatio
        fixedCoords

      # Destroys widget completly
      destroy: ->
        @__clearImage()
        @__widgetElement.remove()
        @__widgetElement = @__imageWrap = @__doneButton = null

      __buildUrl: (coords) ->
        size = "#{coords.w}x#{coords.h}"
        topLeft = "#{coords.x},#{coords.y}"
        url = "#{@__url}-/crop/#{size}/#{topLeft}/"
        if @__options.scale
          pWidth = @__options.preferedSize.split('x')[0]
          if coords.w > pWidth or @__options.upscale
            url += "-/resize/#{@__options.preferedSize}/"
        url

      __buildWidget: ->
        @container = $ @__options.container
        @__widgetElement = $ tpl('crop-widget')
        @__imageWrap = @__widgetElement.find '@uploadcare-crop-widget-image-wrap'
        @__doneButton = @__widgetElement.find '@uploadcare-crop-widget-done-button'
        unless @__options.controls
          @__widgetElement.addClass 'uploadcare-crop-widget--no-controls'

        [@__wrapWidth, @__wrapHeight] = [@__widgetWidth, @__widgetHeight] = @__widgetSize()
        @__wrapHeight -= CONTROLS_HEIGHT if @__options.controls
        @__imageWrap.css {width: @__wrapWidth, height: @__wrapHeight}
        @__widgetElement.css {width: @__widgetWidth, height: @__widgetHeight}

        @__widgetElement.appendTo @container

        @__setState 'waiting'
        @__bind()

      __bind: ->
        @__doneButton.click =>
          @forceDone()

      __clearImage: ->
        @__jCropApi?.destroy()
        if @__deferred and @__deferred.state() is 'pending'
          @__deferred.reject(IMAGE_CLEARED)
          @__deferred = false
        if @__img
          @__img.remove()
          @__img.off() 
          @__img = null
        @__resizedHeight = @__resizedWidth = @__originalHeight = @__originalWidth = null
        @__setState 'waiting'

      __setImage: (@__url) ->
        @__deferred = $.Deferred()
        @__setState 'loading'
        @__img = $ '<img/>'
        @__img.attr 'src', @__url
        @__img.on
          load: =>
            @__setState 'loaded'
            @__calcImgSizes()
            @__img.appendTo @__imageWrap
            @__initJcrop()
          error: =>
            @__setState 'error'
            @__deferred.reject LOADING_ERROR

      __calcImgSizes: ->
        {width: @__originalWidth, height: @__originalHeight} = @__img[0]
        [@__resizedWidth, @__resizedHeight] = 
          fitSize @__originalWidth, @__originalHeight, @__wrapWidth, @__wrapHeight, @__options.upscale
        paddingTop = (@__wrapHeight - @__resizedHeight) / 2
        paddingLeft = (@__wrapWidth - @__resizedWidth) / 2

        @__img.attr {width: @__resizedWidth, height: @__resizedHeight}
        @__imageWrap.css {
          paddingTop, 
          paddingLeft,
          width: @__wrapWidth - paddingLeft,
          height: @__wrapHeight - paddingTop
        }

      __widgetSize: ->
        if !@__options.widgetSize
          [@container.width(), @container.height()]
        else
          @__options.widgetSize.split 'x'

      #             |
      #             v
      #   +----> waiting <-----+
      #   |         |          |
      #   |         v          |
      # error <- loading -> loaded
      __setState: (state) ->
        return if @__state is state
        @__state = state
        prefix = 'uploadcare-crop-widget--'
        @__widgetElement
          .removeClass((prefix + s for s in ['error', 'loading', 'loaded', 'waiting']).join ' ')
          .addClass(prefix + state)
          .trigger('uploadcare.crop.statechange', state)
        @__doneButton.prop 'disabled', state != 'loaded'

      __initJcrop: ->
        jCropOptions =
          onSelect: (coords) => @__currentCoords = coords
        if @__options.preferedSize
          [width, height] = @__options.preferedSize.split 'x'
          jCropOptions.aspectRatio = width / height
          jCropOptions.setSelect = [0, 0, width, height]
        else
          jCropOptions.setSelect = [0, 0, @__resizedWidth, @__resizedHeight]
        setApi = (api) => @__jCropApi = api
        @__img.Jcrop jCropOptions, -> setApi this
