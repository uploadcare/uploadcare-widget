{
  utils,
  namespace,
  settings: s,
  jQuery: $
} = uploadcare

namespace 'uploadcare', (ns) ->
  dataAttr = 'uploadcareWidget'

  ns.initialize = (container = 'body') ->
    initialize($(container).find('@uploadcare-uploader'))

  getSettings = (el) ->
    s.build($(el).data())

  initialize = (targets) ->
    for target in targets
      widget = $(target).data(dataAttr)
      if widget && target == widget.element[0]
        # widget already exists
        continue

      ns.Widget(target)

  ns.SingleWidget = (target) ->
    el = $(target).eq(0)
    unless getSettings(el).multiple
      initializeWidget(el, ns.widget.Widget)
    else
      throw new Error 'This element should be processed using MultipleWidget'

  ns.MultipleWidget = (target) ->
    el = $(target).eq(0)
    if getSettings(el).multiple
      initializeWidget(el, ns.widget.MultipleWidget)
    else
      throw new Error 'This element should be processed using Widget'

  ns.Widget = (target) ->
    el = $(target).eq(0)
    widgetClass = if getSettings(el).multiple
      ns.widget.MultipleWidget
    else
      ns.widget.Widget
    initializeWidget(el, widgetClass)

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
    # TODO: call live() immediately even if settings.live
    live = ->
      initialize($('@uploadcare-uploader'))
    if s.common(settings).live
      setInterval(live, 100)
    else
      live()

  $ ->
    if not window["UPLOADCARE_MANUAL_START"]
      ns.start()
