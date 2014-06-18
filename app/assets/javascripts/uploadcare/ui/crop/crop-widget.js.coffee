# = require ./jquery.Jcrop

{
  namespace,
  jQuery: $,
  templates: {tpl},
  utils
} = uploadcare

namespace 'uploadcare.crop', (ns) ->

  class ns.CropWidget

    constructor: (@element, @originalSize, crop={}) ->
      @__api = $.Jcrop @element[0],
        handleSize: 10
        trueSize: @originalSize
        addClass: 'uploadcare-crop-widget'
        createDragbars: []
        bgColor: 'transparent'
        bgOpacity: .8


      @setCrop(crop)
      @setSelection()

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
    setCrop: (@crop) ->
      @__api.setOptions
        aspectRatio: if crop.preferedSize then crop.preferedSize[0] / crop.preferedSize[1] else 0
        minSize: if crop.notLess then utils.fitSize(crop.preferedSize, @originalSize) else [0, 0]

    setSelection: (selection) ->
      if selection
        center = selection.center
        size = [selection.width, selection.height]
      else
        center = true
        size = @originalSize

      if @crop.preferedSize
        size = utils.fitSize(@crop.preferedSize, size, true)

      if center
        left = (@originalSize[0] - size[0]) / 2
        top = (@originalSize[1] - size[1]) / 2
      else
        left = selection.left or 0
        top = selection.top or 0

      @__api.setSelect [left, top, (size[0] + left), (size[1] + top)]

    cropModifierRegExp = /-\/crop\/([0-9]+)x([0-9]+)(\/(center|([0-9]+),([0-9]+)))?\//i

    __parseModifiers: (modifiers) ->
      if raw = modifiers?.match(cropModifierRegExp)
        width: parseInt(raw[1], 10)
        height: parseInt(raw[2], 10)
        center: raw[4] == 'center'
        left: parseInt(raw[5], 10) or undefined
        top: parseInt(raw[6], 10) or undefined

    setSelectionFromModifiers: (modifiers) ->
      @setSelection @__parseModifiers modifiers

    getSelection: ->
      coords = @__api.tellSelect()
      left = Math.round Math.max(0, coords.x)
      top = Math.round Math.max(0, coords.y)

      left: left
      top: top
      width: Math.round(Math.min(@originalSize[0], coords.x2)) - left
      height: Math.round(Math.min(@originalSize[1], coords.y2)) - top


    getSelectionWithModifiers: ->
      coords = @getSelection()
      {width: w, height: h} = coords
      prefered = @crop.preferedSize
      modifiers = ''

      if w isnt @originalSize[0] or h isnt @originalSize[1]
        modifiers = "-/crop/#{w}x#{h}/#{coords.left},#{coords.top}/"

        downscale = @crop.downscale and (w > prefered[0] or h > prefered[1])
        upscale = @crop.upscale and (w < prefered[0] or h < prefered[1])
        if downscale or upscale
          [coords.sw, coords.sh] = prefered
          modifiers += "-/resize/#{prefered.join 'x'}/"
        else
          modifiers += "-/preview/"

      crop: coords
      modifiers: modifiers
