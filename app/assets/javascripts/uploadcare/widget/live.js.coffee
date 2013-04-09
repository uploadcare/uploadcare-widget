{
  utils,
  jQuery: $
} = uploadcare

dataAttr = 'uploadcareWidget'

uploadcare.initialize = (container = 'body') ->
  initialize $(container).find('@uploadcare-uploader')

initialize = (targets) ->
  for target in targets
    method = if utils.extractSettings(target).multiple
      'MultipleWidget' 
    else
      'Widget'
    uploadcare[method](target) 

uploadcare.Widget = (target) ->
  el = $(target).eq(0)
  unless utils.extractSettings(el).multiple
    initializeWidget(el, uploadcare.widget.Widget)
  else
    utils.warn 'Widget can\'t be initialized on this element'
    null

uploadcare.MultipleWidget = (target) ->
  el = $(target).eq(0)
  if utils.extractSettings(el).multiple
    initializeWidget(el, uploadcare.widget.MultipleWidget)
  else
    utils.warn 'MultipleWidget can\'t be initialized on this element'
    null

initializeWidget = (el, Widget) ->
  widget = el.data(dataAttr)
  if !widget || el[0] != widget.element[0]
    cleanup(el)
    widget = new Widget(el)
    el.data(dataAttr, widget)
    widget.template.content.data(dataAttr, widget.template)

  widget.api()

cleanup = (el) ->
  el.off('.uploadcare')
  el = el.next('.uploadcare-widget')
  template = el.data(dataAttr)
  if el.length && (!template || el[0] != template.content[0])
    el.remove()

live = -> initialize $('@uploadcare-uploader')
if uploadcare.defaults.live
  $ -> setInterval(live, 100)
else
  $(live)
