{
  utils,
  settings,
  jQuery: $
} = uploadcare

uploadcare.namespace '', (ns) ->
  dataAttr = 'uploadcareWidget'
  selector = '[role~="uploadcare-uploader"]'

  ns.initialize = (container = ':root') ->
    res = []
    for el in $(container)
      widgets = initialize(el.querySelectorAll(selector))
      res = res.concat(widgets)
    res

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
    inputArr = $(input)
    if inputArr.length == 0
        throw new Error("No DOM elements found matching selector")
    else if inputArr.length > 1
        utils.warn("There are multiple DOM elements matching selector")
    input = inputArr.eq(0)
    s = settings.build(input.data())

    Widget = if s.multiple
        ns.widget.MultipleWidget
      else
        ns.widget.Widget
    if targetClass and Widget isnt targetClass
      throw new Error "This element should be processed using #{Widget._name}"

    api = input.data(dataAttr)
    if ! api or api.inputElement != input[0]
      cleanup(input)
      widget = new Widget(input, s)
      api = widget.api()
      input.data(dataAttr, api)
      widget.template.content.data(dataAttr, api)
    api

  cleanup = (input) ->
    input.off('.uploadcare').each ->
      widgetElement = $(this).next('.uploadcare-widget')
      widget = widgetElement.data(dataAttr)
      if widget and widget.inputElement == this
        widgetElement.remove()

  ns.start = utils.once (s, isolated) ->
    # when isolated, call settings.common(s) only
    s = settings.common(s, isolated)
    if isolated
      return
    if s.live
      setInterval(ns.initialize, 100)
    # should be after settings.common(s) call
    ns.initialize()

  $ ->
    if not window["UPLOADCARE_MANUAL_START"]
      ns.start()
