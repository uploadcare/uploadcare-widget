uploadcare.whenReady ->
  {
    jQuery: $
  } = uploadcare

  dataAttr = 'uploadcareWidget'

  uploadcare.initialize = (container) ->
    for target in $(container).find('@uploadcare-uploader')
      uploadcare.widget(target)

  uploadcare.widget = (target) ->
    el = $(target)
    initializeWidget(el)

  initializeWidget = (el) ->
    widget = el.data(dataAttr)
    if !widget || el[0] != widget.element[0]
      cleanup(el)
      widget = new uploadcare.widget.Widget(el)
      el.data(dataAttr, widget)
      widget.template.content.data(dataAttr, widget.template)

    widget # FIXME Supposed to be API wrapper


  cleanup = (el) ->
    el.off('.uploadcare')
    el = el.next('.uploadcare-widget')
    template = el.data(dataAttr)
    if el.length && (!template || el[0] != template.content[0])
      el.remove()

  live = -> uploadcare.initialize()
  if uploadcare.defaults.live
    $ -> setInterval(live, 100)
  else
    $(live)
