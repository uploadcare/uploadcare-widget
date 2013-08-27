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

      # If set to `true` "-/resize/%preferedSize%/" will be added
      # if selected area bigger than `preferedSize`. Default false.
      scale: false

      # If set to `true` "-/resize/%preferedSize%/" will be added
      # if selected area smaller than `preferedSize`. Default false.
      upscale: false

      # Restrict selection to preferedSize area. Default false.
      notLess: false

      # Defines widget size. if set to `null` widget size will be equal
      # to the `container` size. Array: [123, 123]. (optional)
      widgetSize: null

      # Defines image size you want to get at the end.
      # If `scale` option is set to `false`, it defines only
      # the prefered aspect ratio.
      # If set to `null` any aspect ratio will be acceptable.
      # Array: [123, 123]. (optional)
      preferedSize: null

    LOADING_ERROR = 'loadingerror'
    IMAGE_CLEARED = 'imagecleared'

    prepareOptions = (options) ->
      unless options.container
        throw new Error("options.container must be specified")

      unless options.preferedSize
        options.scale = false
        options.upscale = false
        options.notLess = false

      if options.scale
        fited = utils.fitSizeInCdnLimit options.preferedSize
        if fited[0] isnt options.preferedSize[0]
          willBe = "#{fited.join 'x'}#{if options.upscale then '' else ' or smaller'}"
          utils.warnOnce """
            Specified preferred crop size is bigger than our CDN allows.
            Resulting image size will be #{willBe}.
          """
          options.preferedSize = fited

    # Example:
    #   new CropWidget
    #     container: '.crop-widget-home'
    #     upscale: true
    #     widgetSize: [500, 300]
    #     preferedSize: [100, 100]
    constructor: (options) ->
      @__options = $.extend {}, defaultOptions, options
      prepareOptions @__options
      @onStateChange = $.Callbacks()
      @__buildWidget()

    croppedImageUrl: (previewUrl, size) ->
      @croppedImageModifiers(previewUrl, size).then (opts) =>
        @__url + opts.modifiers

    cropModifierRegExp = /-\/crop\/([0-9]+)x([0-9]+)(\/(center|([0-9]+),([0-9]+)))?\//i

    __parseModifiers: (modifiers) ->
      if raw = modifiers?.match(cropModifierRegExp)
        width: parseInt(raw[1], 10)
        height: parseInt(raw[2], 10)
        center: raw[4] == 'center'
        left: parseInt(raw[5], 10) or undefined
        top: parseInt(raw[6], 10) or undefined

    croppedImageModifiers: (previewUrl, size, modifiers) ->
      @croppedImageCoords(previewUrl, size, @__parseModifiers modifiers)
        .then (coords) =>
          size = "#{coords.width}x#{coords.height}"
          topLeft = "#{coords.left},#{coords.top}"

          opts =
            crop: $.extend({}, coords)
            modifiers: "-/crop/#{size}/#{topLeft}/"

          notTouched = coords.width is @__originalSize[0] and coords.height is @__originalSize[1]
          if notTouched and not @__options.scale
            opts.modifiers = ''
          else
            downscale = @__options.scale and coords.width > @__options.preferedSize[0]
            upscale = @__options.upscale and coords.width < @__options.preferedSize[0]
            if downscale or upscale
              resized = @__options.preferedSize
            else
              resized = utils.fitSizeInCdnLimit [coords.width, coords.height]

            if resized[0] isnt coords.width or resized[1] isnt coords.height
              [opts.crop.sw, opts.crop.sh] = resized
              resized[0 + (resized[0] > resized[1])] = ''
              opts.modifiers += "-/resize/#{resized.join 'x'}/"
          opts

    croppedImageCoords: (previewUrl, size, coords) ->
      @__clearImage()
      @__calcSizes size
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
      [scaleX, scaleY] = @__resizedScale
      left: Math.round @__currentCoords.left / scaleX
      top: Math.round @__currentCoords.top / scaleY
      width: Math.round @__currentCoords.width / scaleX
      height: Math.round @__currentCoords.height / scaleY

    # Destroys widget completly
    destroy: ->
      @__clearImage()
      @__widgetElement.remove()
      @__widgetElement = null

    __buildWidget: ->
      @container = $ @__options.container
      @__widgetElement = $(tpl('crop-widget')).appendTo @container
      @__setState 'waiting'

    __clearImage: ->
      @__jCropApi?.destroy()
      @__img?.off().remove()
      @__deferred?.reject(IMAGE_CLEARED)
      @__deferred = $.Deferred()
      @__setState 'waiting'

    __setImage: (@__url) ->
      @__img = $('<img/>')
        .css
          margin: '0 auto'
        .on 'error', =>
          @__setState 'error'
          @__deferred.reject LOADING_ERROR
          @__img.remove()
        .attr
          src: @__url
          width: @__resizedSize[0]
          height: @__resizedSize[1]
        .appendTo @__widgetElement

    __calcSizes: (originalSize) ->
      widgetSize = @__options.widgetSize or [@container.width(), @container.height()]
      resizedSize = utils.fitSize originalSize, widgetSize
      @__originalSize = originalSize
      @__resizedSize = resizedSize
      @__resizedScale = [
        resizedSize[0] / originalSize[0],
        resizedSize[1] / originalSize[1],
      ]

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

    __initJcrop: (previousCoords) ->
      jCropOptions =
        onSelect: (coords) =>
          @__currentCoords =
            height: coords.h
            width: coords.w
            left: coords.x
            top: coords.y

      if @__options.preferedSize
        jCropOptions.aspectRatio =  @__options.preferedSize[0] / @__options.preferedSize[1]

      unless previousCoords
        previousCoords = {center: true}
        if @__options.preferedSize
          [
            previousCoords.width
            previousCoords.height
          ] = utils.fitSize(@__options.preferedSize, @__originalSize, true)
        else
          [previousCoords.width, previousCoords.height] = @__originalSize

      if previousCoords.center
        left = (@__originalSize[0] - previousCoords.width) / 2
        top = (@__originalSize[1] - previousCoords.height) / 2
      else
        left = previousCoords.left or 0
        top = previousCoords.top or 0

      [scaleX, scaleY] = @__resizedScale

      if @__options.notLess
        preferedSize = utils.fitSize @__options.preferedSize, @__originalSize
        jCropOptions.minSize = [Math.ceil preferedSize[0] * scaleX,
                                Math.ceil preferedSize[1] * scaleY]

      jCropOptions.setSelect = [
        left * scaleX,
        top * scaleY,
        (previousCoords.width + left) * scaleX,
        (previousCoords.height + top) * scaleY,
      ]

      @__setState 'loading'
      done = (api) =>
        @__jCropApi = api
        @__setState 'loaded'
      @__img.Jcrop jCropOptions, -> done this
