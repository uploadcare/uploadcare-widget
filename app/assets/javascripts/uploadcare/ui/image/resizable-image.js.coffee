# = require ./dragresize

{
  namespace,
  utils,
  templates: {tpl},
  jQuery: $
} = uploadcare

namespace 'uploadcare.ui.image', (ns) ->

  MAX_LO = 634
  MAX_HI = 1024

  ns.resizableImage = (cdnUrl, options = {}) ->
    defaults =
      scaleCrop: false
      minWidth: 10
      minHeight: 10
      maxWidth: null
      maxHeight: null
      fitWidth: null
      fitHeight: null
    options = $.extend({}, defaults, options)

    el = $(tpl('resizable-image'))
    dr = new DragResize 'dragresize',
      minWidth: options.minWidth
      minHeight: options.minHeight
      maxWidth: options.maxWidth
      maxHeight: options.maxHeight
    dr.isElement = (el) -> $(el).hasClass('uploadcare-resizable-image')
    dr.isHandle = -> false
    dr.apply(el[0])

    dr.ondragend = reload = ->
      dims =
        width: el.width()
        height: el.height()
      if dims.width > MAX_LO || dims.height > MAX_LO
        dims = if dims.width > dims.height
          utils.fitDimensions(dims, MAX_HI, MAX_LO)
        else
          utils.fitDimensions(dims, MAX_LO, MAX_HI)

      img.src = "#{cdnUrl}-/#{op}/#{dims.width}x#{dims.height}/#{suffix}"

    df = $.Deferred()
    img = new Image()
    img.src = cdnUrl
    img.onload = ->
      img.onload = undefined
      dims = utils.fitDimensions(img, options.fitWidth, options.fitHeight)
      el
        .width(dims.width)
        .height(dims.height)
        .append(img)

      dr.aspectRatio = dims.width / dims.height
      reload() if dims.width != img.width || dims.height != img.height
      df.resolve(el)

    img.onerror = ->
      df.reject()

    op = if options.scaleCrop then 'scale_crop' else 'resize'
    suffix = if options.scaleCrop then 'center/' else ''

    df.promise()
