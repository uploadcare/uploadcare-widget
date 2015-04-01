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
      if widget && widget.inputElement == target
        # widget already exists
        continue
      initializeWidget(target)

  ns.SingleWidget = (el) ->
    initializeWidget(el, ns.widget.Widget)

  ns.MultipleWidget = (el) ->
    initializeWidget(el, ns.widget.MultipleWidget)

  ns.Widget = (el) ->
    initializeWidget(el)

  initializeWidget = (input, targetClass) ->
    input = $(input).eq(0)
    s = settings.build(input.data())

    Widget = if s.multiple then ns.widget.MultipleWidget else ns.widget.Widget
    if targetClass and Widget isnt targetClass
      throw new Error "This element should be processed using #{targetClass.name}"

    api = input.data(dataAttr)
    if ! api or api.inputElement != input[0]
      cleanup(input)
      widget = new Widget(input, s)
      api = widget.api()
      input.data(dataAttr, api)
      widget.template.content.data(dataAttr, widget.template)
    api

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
