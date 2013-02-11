uploadcare.whenReady ->
  {
    jQuery: $
  } = uploadcare

  dataAttr = 'uploadcareWidget'

  uploadcare.initialize = (targets) ->
    for target in $(targets || '@uploadcare-uploader')
      el = $(target)
      initializeWidget(el)
    return

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

  if uploadcare.defaults.live
    live = ->
      uploadcare.initialize()
      setTimeout(live, 500)
    $(live)
  else
    $ -> uploadcare.initialize()
