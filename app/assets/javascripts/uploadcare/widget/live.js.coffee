uploadcare.whenReady ->
  {
    jQuery: $
  } = uploadcare

  dataAttr = 'uploadcareWidget'

  uploadcare.initialize = (targets) ->
    for target in $(targets || '@uploadcare-uploader')
      el = $(target)
      widget = el.data(dataAttr)
      if widget
        reinitialize(el, widget).api()
      else
        createWidget(el).api()

  reinitialize = (el, widget) ->
    if el[0] != widget.element[0]
      cleanup(el, widget.template)
      createWidget(el)
    else
      widget

  cleanup = (el, template) ->
    el.off('.uploadcare')
    el.next('.uploadcare-widget').remove()

  createWidget = (el) ->
    widget = new uploadcare.widget.Widget(el)
    el.data(dataAttr, widget)
    widget

  if uploadcare.defaults.live
    live = ->
      uploadcare.initialize()
      setTimeout(live, 500)
    $(live)
  else
    $ -> uploadcare.initialize()
