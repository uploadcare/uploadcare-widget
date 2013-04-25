# = require ./dragresize

{
  namespace,
  utils,
  templates: {tpl},
  jQuery: $
} = uploadcare

namespace 'uploadcare.ui.image', (ns) ->
  ns.resizableImage = (cdnUrl, options = {}) ->
    defaults =
      scaleCrop: false
      minWidth: 10
      minHeight: 10
      fitWidth: null
      fitHeight: null
    options = $.extend({}, defaults, options)

    el = $(tpl('resizable-image'))
    dr = new DragResize 'dragresize',
      minWidth: options.minWidth
      minHeight: options.minHeight
    dr.isElement = (el) -> $(el).hasClass('uploadcare-resizable-image')
    dr.isHandle = -> false
    dr.apply(el[0])

    dr.ondragend = reload = ->
      img.src = "#{cdnUrl}-/#{op}/#{el.width()}x#{el.height()}/#{suffix}"

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

      reload() if dims.width != img.width || dims.height != img.height
      df.resolve(el)

    img.onerror = ->
      df.reject()

    op = if options.scaleCrop then 'scale_crop' else 'resize'
    suffix = if options.scaleCrop then 'center/' else ''

    df.promise()
