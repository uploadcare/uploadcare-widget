# = require ./jquery.Jcrop

{
  namespace,
  jQuery: $,
  templates: {tpl},
  utils
} = uploadcare

namespace 'uploadcare.crop', (ns) ->

  class ns.CropWidget

    LOADING_ERROR = 'loadingerror'

    prepareOptions = (options) ->
      fited = utils.fitSizeInCdnLimit options.preferedSize
      if fited[0] isnt options.preferedSize[0]
        utils.warnOnce """
          Specified preferred crop size is bigger than our CDN allows.
          Resulting image size will be #{fited.join 'x'}.
        """
        options.preferedSize = fited

    # Options:
    #   downscale:
    # If set to `true` "-/resize/%preferedSize%/" will be added
    # if selected area bigger than `preferedSize`. Default false.

    #   upscale:
    # If set to `true` "-/resize/%preferedSize%/" will be added
    # if selected area smaller than `preferedSize`. Default false.

    #   notLess:
    # Restrict selection to preferedSize area. Default false.

    #   preferedSize:
    # Defines image size you want to get at the end.
    # If `downscale` option is set to `false`, it defines only
    # the prefered aspect ratio.
    # If set to `null` any aspect ratio will be acceptable.
    # Array: [123, 123]. (optional)
    constructor: (@element, @originalSize, @__options) ->
      prepareOptions @__options

    cropModifierRegExp = /-\/crop\/([0-9]+)x([0-9]+)(\/(center|([0-9]+),([0-9]+)))?\//i

    __parseModifiers: (modifiers) ->
      if raw = modifiers?.match(cropModifierRegExp)
        width: parseInt(raw[1], 10)
        height: parseInt(raw[2], 10)
        center: raw[4] == 'center'
        left: parseInt(raw[5], 10) or undefined
        top: parseInt(raw[6], 10) or undefined

    croppedImageModifiers: (modifiers) ->
      @croppedImageCoords(@__parseModifiers modifiers)
        .then (coords) =>
          {width: w, height: h} = coords
          prefered = @__options.preferedSize

          opts =
            crop: coords
            modifiers: ''

          changed = w isnt @originalSize[0] or h isnt @originalSize[1]
          if changed
            opts.modifiers = "-/crop/#{w}x#{h}/#{coords.left},#{coords.top}/"

            downscale = @__options.downscale and (w > prefered[0] or h > prefered[1])
            upscale = @__options.upscale and (w < prefered[0] or h < prefered[1])
            if downscale or upscale
              [opts.crop.sw, opts.crop.sh] = prefered
              opts.modifiers += "-/resize/#{prefered.join 'x'}/"
            else
              opts.modifiers += "-/preview/"

          opts

    croppedImageCoords: (coords) ->
      @__initJcrop coords
      @__deferred = $.Deferred()
      @__deferred.promise()

    # This method could be usefull if you want to make your own done button.
    forceDone: ->
      @__deferred.resolve @__currentCoords

    __initJcrop: (previousCoords) ->
      jCropOptions =
        handleSize: 10
        trueSize: @originalSize
        addClass: 'uploadcare-crop-widget'
        onSelect: (coords) =>
          left = Math.round Math.max(0, coords.x)
          top = Math.round Math.max(0, coords.y)
          @__currentCoords = {
            left, top
            width: Math.round(Math.min(@originalSize[0], coords.x2)) - left
            height: Math.round(Math.min(@originalSize[1], coords.y2)) - top
          }

      if @__options.preferedSize
        jCropOptions.aspectRatio =  @__options.preferedSize[0] / @__options.preferedSize[1]

      if @__options.notLess
        jCropOptions.minSize = utils.fitSize @__options.preferedSize, @originalSize

      if not previousCoords
        previousCoords = {center: true}
        if @__options.preferedSize
          [
            previousCoords.width
            previousCoords.height
          ] = utils.fitSize(@__options.preferedSize, @originalSize, true)
        else
          [previousCoords.width, previousCoords.height] = @originalSize

      if previousCoords.center
        left = (@originalSize[0] - previousCoords.width) / 2
        top = (@originalSize[1] - previousCoords.height) / 2
      else
        left = previousCoords.left or 0
        top = previousCoords.top or 0

      jCropOptions.setSelect = [
        left,
        top,
        (previousCoords.width + left),
        (previousCoords.height + top),
      ]

      $.Jcrop(@element[0], jCropOptions)
