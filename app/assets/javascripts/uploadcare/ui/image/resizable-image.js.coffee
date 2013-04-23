# = require ./dragresize

{
  namespace,
  templates: tpl,
  jQuery: $
} = uploadcare

{tpl} = uploadcare.templates

namespace 'uploadcare.ui.image', (ns) ->
  class ns.ResizableImage
    constructor: (cdnUrl) ->
      el = $(tpl('resizable-image'))
      dr = new DragResize('dragresize', minWidth: 10, minHeight: 10)
      dr.isElement = (el) -> $(el).hasClass('uploadcare-resizable-image')
      dr.isHandle = -> false
      dr.apply(el[0])

      @__df = $.Deferred()
      img = new Image()
      img.src = cdnUrl
      img.onload = =>
        el
          .width(img.width)
          .height(img.height)
          .append(img)
        @__df.resolve(el)

      dr.ondragend = ->
        img.src = "#{cdnUrl}-/resize/#{el.width()}x#{el.height()}/"

    element: ->
      @__df.promise()
