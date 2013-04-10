{
  utils,
  namespace,
  settings: s,
  jQuery: $
} = uploadcare

namespace 'uploadcare', (ns) ->
  dataAttr = 'uploadcareWidget'

  ns.initialize = (container = 'body') ->
    initialize $(container).find('@uploadcare-uploader')

  getSettings = (el) ->
    s.build $(el).data()

  initialize = (targets) ->
    for target in targets
      method = if getSettings(target).multiple
        'MultipleWidget' 
      else
        'Widget'
      uploadcare[method](target) 

  ns.Widget = (target) ->
    el = $(target).eq(0)
    unless getSettings(el).multiple
      initializeWidget(el, ns.widget.Widget)
    else
      throw new Error 'Widget can\'t be initialized on this element'

  ns.MultipleWidget = (target) ->
    el = $(target).eq(0)
    if getSettings(el).multiple
      initializeWidget(el, ns.widget.MultipleWidget)
    else
      throw new Error 'MultipleWidget can\'t be initialized on this element'

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

  ns.start = (settings) ->
    s.defaults(settings)
    live = -> initialize $('@uploadcare-uploader')
    if s.build().live
      setInterval(live, 100)
    else
      live()

  $ ->
    ns.start() unless s.globals().manualStart
