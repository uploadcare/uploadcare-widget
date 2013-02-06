uploadcare.whenReady ->
  {
    jQuery: $
  } = uploadcare

  dataAttr = 'uploadcareWidget'

  uploadcare.initialize = (target) ->
    $(target || '@uploadcare-uploader').each ->
      el = $(this)
      widget = el.data(dataAttr)
      if widget
        reinitialize(el, widget)
      else
        createWidget(el)

  reinitialize = (el, widget) ->
    if el[0] != widget.element[0]
      el.off('.uploadcare')
      el.next('.uploadcare-widget').remove()
      createWidget(el)

  createWidget = (el) ->
    el.data(dataAttr, new uploadcare.widget.Widget(el))

  $ -> uploadcare.initialize()
