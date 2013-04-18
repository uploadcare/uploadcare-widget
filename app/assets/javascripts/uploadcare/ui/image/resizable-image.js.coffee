{
  namespace,
  jQuery: $
} = uploadcare

{tpl} = uploadcare.templates

namespace 'uploadcare.ui.image', (ns) ->
  class ns.ResizableImage
    constructor: (@cdnUrl) ->
      throw 'no'
