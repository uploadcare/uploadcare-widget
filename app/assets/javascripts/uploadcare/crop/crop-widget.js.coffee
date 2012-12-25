# = require ./jquery.Jcrop
# = require ./styles
# = require ./template

uploadcare.whenReady ->
  {
    namespace,
    jQuery: $
  } = uploadcare

  # REFACTOR: remove copypaste
  css = JST['uploadcare/crop/styles']()
  style = document.createElement('style')
  if style.styleSheet?
    style.styleSheet.cssText = css
  else
    style.appendChild(document.createTextNode(css))
  $('head').append(style)

  namespace 'uploadcare.crop', (ns) ->

    class ns.CropWidget

      defaultOptions =
        container: null # required
        url: null # required
        scale: true
        upscale: false
        widgetSize: null # if `null` widget size will be equal the `container` size
        preferedSize: null # `null` means any aspect ratio acceptable
        controls: true

      IMAGE_LOADING_ERROR = 1
      CONTROLS_HEIGTH = 30

      # Example:
      #   new CropWidget
      #     container: '.crop-widget-home'
      #     url: 'http://ucarecdn.com/%something%/'
      #     upscale: true
      #     widgetSize: '500x300'
      #     preferedSize: '100x100'
      constructor: (options) ->
        @_options = $.extend {}, defaultOptions, options
        @_checkOptions()
        @_buildWidget()
        @_deferred = $.Deferred()
        @_setImage @_options.url

      # Example:
      #   cropWidget = new CropWidget( ... )
      #   cropWidget.croppedImageUrl()
      #     .done (url) ->
      #       # ...
      #     .fail (errorCode) ->
      #       # ...
      croppedImageUrl: ->
        @_deferred.promise()

      forceDone: ->
        @_deferred.resolve @_buildUrl @_currentCoords

      destroy: ->
        @_widgetElement.remove()
        # TODO: full destroy somehow

      _buildUrl: (coords) ->
        scaleRatio = @_resizedWidth / @_originalWidth
        for key, value of coords
          coords[key] = Math.round value / scaleRatio
        topLeft = "#{coords.x}x#{coords.y}"
        bottomRight = "#{coords.x2}x#{coords.y2}"
        url = "#{@_options.url}-/custom_crop/#{topLeft}/#{bottomRight}/"
        if @_options.scale
          url += "-/resize/#{@_options.preferedSize}/"
        return url

      _buildWidget: ->
        @container = $ @_options.container
        if @_options.widgetSize == null
          @_widgetWidth = @container.width()
          @_widgetHeight = @container.height()
        else
          [@_widgetWidth, @_widgetHeight] = @_options.widgetSize.split 'x'
        @_widgetElement = $ JST['uploadcare/crop/template']()
        @_imageWrap = @_widgetElement.find '.uploadcare-crop-widget__image-wrap'
        @_doneButton = @_widgetElement.find '.uploadcare-crop-widget__done-button'
        @_doneButton.click =>
          @forceDone() unless @_doneButton.prop 'disabled'
        @_wrapWidth = @_widgetWidth
        @_wrapHeight = @_widgetHeight
        if @_options.controls
          @_wrapHeight -= CONTROLS_HEIGTH
        else
          @_widgetElement.addClass 'uploadcare-crop-widget--no-controls'
        @_imageWrap.css
          width: @_wrapWidth
          height: @_wrapHeight
        @_widgetElement.appendTo @container

      _setImage: (@url) ->
        @_setState 'loading'
        @_img = $ "<img/>"
        @_img.attr
          src: @url
        @_img.on
          load: =>
            @_setState 'loaded'
            @_calcSizes()
            @_img.appendTo @_imageWrap
            @_initJcrop()
          error: =>
            @_setState 'error'
            @_deferred.reject IMAGE_LOADING_ERROR

      _calcSizes: ->
        @_originalWidth = @_img[0].width
        @_originalHeight = @_img[0].height
        @_resizedWidth = Math.min @_originalWidth, @_wrapWidth
        @_resizedHeight = Math.floor @_originalHeight / @_originalWidth * @_resizedWidth
        @_resizedHeight = Math.min @_resizedHeight, @_wrapHeight
        @_resizedWidth = Math.floor @_originalWidth / @_originalHeight * @_resizedHeight
        # TODO: upscale
        @_img.attr
          width: @_resizedWidth
          height: @_resizedHeight
        paddingTop = (@_wrapHeight - @_resizedHeight) / 2
        paddingLeft = (@_wrapWidth - @_resizedWidth) / 2
        @_imageWrap.css {
          paddingTop, 
          paddingLeft,
          width: @_wrapWidth - paddingLeft,
          height: @_wrapHeight - paddingTop
        }

      # error <- loading -> loaded
      _setState: (state) ->
        @_widgetElement
          .removeClass(("uploadcare-crop-widget--#{s}" for s in ['error', 'loading', 'loaded']).join ' ')
          .addClass("uploadcare-crop-widget--#{state}")
        @_doneButton.prop
          disabled: state != 'loaded'

      _checkOptions: ->
        throw "options.container must be specified" unless @_options.container
        throw "options.url must be specified" unless @_options.url
        for option in ['widgetSize', 'preferedSize']
          value = @_options[option]
          unless !value or (typeof value is 'string' and value.match /^\d+x\d+$/i)
            throw "options.#{option} must follow pattern '123x456' or be null"

      _initJcrop: ->
        jCropOptions =
          onSelect: (coords) => @_currentCoords = coords
        if @_options.preferedSize
          [width, height] = @_options.preferedSize.split 'x'
          jCropOptions.aspectRatio = width / height
          jCropOptions.setSelect = [0, 0, width, height]
        else
          jCropOptions.setSelect = [0, 0, @_resizedWidth, @_resizedHeight]
        @_img.Jcrop jCropOptions