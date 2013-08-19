# = require ./jquery.Jcrop

{
  namespace,
  jQuery: $,
  utils
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

      # If set to `true` "-/resize/%preferedSize%/" will be added
      # even if selected area smaller than `preferedSize` (optional)
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
      throw new Error("options.container must be specified") unless options.container
      for option in ['widgetSize', 'preferedSize']
        value = options[option]
        unless !value or (typeof value is 'string' and value.match /^\d+x\d+$/i)
          throw new Error("options.#{option} must follow pattern '123x456' or be falsy")

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
      @__options.scale = false unless @__options.preferedSize
      checkOptions @__options

      if @__options.scale
        s = @__options.preferedSize.split('x')
        width = +s[0]
        height = +s[1]
        fited = utils.fitDimensionsWithCdnLimit {width, height}
        if fited.width isnt width
          willBe = "#{fited.width}x#{fited.height}#{if @__options.upscale then '' else ' or smaller'}"
          utils.warnOnce """
            You specified #{@__options.preferedSize} as preferred size in crop options.
            It's bigger than our CDN allows.
            Resulting image size will be #{willBe}.
          """
          @__options.preferedSize = "#{fited.width}x#{fited.height}"

      @onStateChange = $.Callbacks()
      @__buildWidget()

    croppedImageUrl: (originalUrl, size) ->
      @croppedImageCoords(originalUrl, size).then (opts) =>
        @__url + opts.modifiers

    cropModifierRegExp = /-\/crop\/([0-9]+)x([0-9]+)(\/(center|([0-9]+),([0-9]+)))?\//i

    __parseModifiers: (modifiers) ->
      if raw = modifiers?.match(cropModifierRegExp)
        width: parseInt(raw[1], 10)
        height: parseInt(raw[2], 10)
        center: raw[4] == 'center'
        top: parseInt(raw[5], 10) or undefined
        left: parseInt(raw[6], 10) or undefined

    croppedImageModifiers: (previewUrl, size, modifiers) ->
      @croppedImageCoords(previewUrl, size, @__parseModifiers modifiers)
        .pipe (coords) =>
          size = "#{coords.width}x#{coords.height}"
          topLeft = "#{coords.x},#{coords.y}"

          opts =
            crop: $.extend({}, coords)
            modifiers: "-/crop/#{size}/#{topLeft}/"

          notTouched = coords.width is @__originalWidth and coords.height is @__originalHeight
          if notTouched and not @__options.scale
            opts.modifiers = ''
          else
            resized =
              width: coords.width
              height: coords.height

            if @__options.scale
              scale = @__options.preferedSize.split('x')
              sw = scale[0] - 0 if scale[0]
              sh = scale[1] - 0 if scale[1]
              if coords.width > sw or @__options.upscale
                resized.width = sw
                resized.height = sh

            resized = utils.fitDimensionsWithCdnLimit resized

            if resized.width isnt coords.width or resized.height isnt coords.height
              opts.crop.sw = resized.width
              opts.crop.sh = resized.height

              size = [resized.width, resized.height]
              size[if size[0] > size[1] then 1 else 0] = ''

              opts.modifiers += "-/resize/#{size.join 'x'}/"
          opts

    croppedImageCoords: (previewUrl, size, coords) ->
      @__clearImage()
      @__calcImgSizes size
      @__setImage previewUrl
      @__initJcrop coords
      @__deferred.promise()

    # This method could be usefull if you want to make your own done button.
    forceDone: ->
      if @__state is 'loaded'
        @__deferred.resolve @getCurrentCoords()
      else
        throw new Error("not ready")

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
      @__img = $('<img/>')
        .on 'error', =>
          @__setState 'error'
          @__deferred.reject LOADING_ERROR
        .attr
          src: @__url
          width: @__resizedWidth
          height: @__resizedHeight
        .appendTo @__imageWrap

    __calcImgSizes: (size) ->
      {width: @__originalWidth, height: @__originalHeight} = size
      [@__resizedWidth, @__resizedHeight] =
        fitSize @__originalWidth, @__originalHeight, @__wrapWidth, @__wrapHeight
      paddingTop = (@__wrapHeight - @__resizedHeight) / 2
      paddingLeft = (@__wrapWidth - @__resizedWidth) / 2

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
      @onStateChange.fire state
      @__doneButton.prop 'disabled', state != 'loaded'

    __initJcrop: (previousCoords) ->
      jCropOptions =
        onSelect: (coords) =>
          @__currentCoords =
            height: coords.h
            width: coords.w
            x: coords.x
            x2: coords.x2
            y: coords.y
            y2: coords.y2

      if @__options.preferedSize
        [width, height] = @__options.preferedSize.split 'x'
        jCropOptions.aspectRatio = width / height

      unless previousCoords
        previousCoords = {center: true}
        if @__options.preferedSize
          [
            previousCoords.width
            previousCoords.height
          ] = fitSize(width, height, @__originalWidth, @__originalHeight, true)
        else
          previousCoords.width = @__originalWidth
          previousCoords.height = @__originalHeight

      if previousCoords.center
        top = (@__originalWidth - previousCoords.width) / 2
        left = (@__originalHeight - previousCoords.height) / 2
      else
        top = previousCoords.top or 0
        left = previousCoords.left or 0
      jCropOptions.setSelect = [
        top
        left
        previousCoords.width + top
        previousCoords.height + left
      ]
      scaleRatio = @__resizedWidth / @__originalWidth
      for val, i in jCropOptions.setSelect
        jCropOptions.setSelect[i] = val * scaleRatio

      @__setState 'loading'
      @__img.Jcrop jCropOptions, =>
        @__setState 'loaded'
