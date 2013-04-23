# = require ./dragresize

{
  namespace,
  templates: {tpl},
  jQuery: $
} = uploadcare

namespace 'uploadcare.ui.image', (ns) ->
  ns.resizableImage = (cdnUrl, scaleCrop = false) ->
    el = $(tpl('resizable-image'))
    dr = new DragResize('dragresize', minWidth: 10, minHeight: 10)
    dr.isElement = (el) -> $(el).hasClass('uploadcare-resizable-image')
    dr.isHandle = -> false
    dr.apply(el[0])

    df = $.Deferred()
    img = new Image()
    img.src = cdnUrl
    img.onload = ->
      el
        .width(img.width)
        .height(img.height)
        .append(img)
      df.resolve(el)

    img.onerror = ->
      df.reject()

    op = if scaleCrop then 'scale_crop' else 'resize'
    suffix = if scaleCrop then 'center/' else ''
    dr.ondragend = ->
      img.src = "#{cdnUrl}-/#{op}/#{el.width()}x#{el.height()}/#{suffix}"

    df.promise()
