{
  namespace,
  settings: s,
  jQuery: $
} = uploadcare

namespace 'uploadcare', (ns) ->
  dataAttr = 'uploadcareWidget'

  ns.initialize = (container = 'body') ->
    initialize $(container).find('@uploadcare-uploader')

  initialize = (targets) ->
    ns.Widget(target) for target in targets

  ns.Widget = (target) ->
    el = $(target).eq(0)
    initializeWidget(el)

  initializeWidget = (el) ->
    widget = el.data(dataAttr)
    if !widget || el[0] != widget.element[0]
      cleanup(el)
      widget = new ns.widget.Widget(el)
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
