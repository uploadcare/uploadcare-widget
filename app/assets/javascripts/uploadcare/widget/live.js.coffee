{
  utils,
  namespace,
  settings,
  jQuery: $
} = uploadcare

namespace 'uploadcare', (ns) ->
  dataAttr = 'uploadcareWidget'

  ns.initialize = (container = 'body') ->
    initialize($(container).find('@uploadcare-uploader'))

  initialize = (targets) ->
    for target in targets
      widget = $(target).data(dataAttr)
      if widget && target == widget.element[0]
        # widget already exists
        continue
      initializeWidget(target)

  ns.SingleWidget = (el) ->
    initializeWidget(el, ns.widget.Widget)

  ns.MultipleWidget = (el) ->
    initializeWidget(el, ns.widget.MultipleWidget)

  ns.Widget = (el) ->
    initializeWidget(el)

  initializeWidget = (el, targetClass) ->
    el = $(el).eq(0)
    s = settings.build(el.data())

    Widget = if s.multiple then ns.widget.MultipleWidget else ns.widget.Widget
    if targetClass and Widget isnt targetClass
      throw new Error "This element should be processed using #{targetClass.name}"

    widget = el.data(dataAttr)
    if !widget || el[0] != widget.element[0]
      cleanup(el)
      widget = new Widget(el, s)
      # TODO: Store widget api, not raw object
      el.data(dataAttr, widget)
      widget.template.content.data(dataAttr, widget.template)
    widget.api()

  cleanup = (el) ->
    el.off('.uploadcare')
    el = el.next('.uploadcare-widget')
    template = el.data(dataAttr)
    if el.length && (!template || el[0] != template.content[0])
      el.remove()

  ns.start = (s) ->
    if settings.common(s).live
      setInterval(live, 100)
    do live = ->
      initialize($('@uploadcare-uploader'))

  $ ->
    if not window["UPLOADCARE_MANUAL_START"]
      ns.start()
