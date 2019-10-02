import uploadcare from '../namespace'
import { warn } from '../utils/warnings'
import { once } from '../utils'

var $, settings

({
  settings,
  jQuery: $
} = uploadcare)

uploadcare.namespace('', function (ns) {
  const dataAttr = 'uploadcareWidget'
  const selector = '[role~="uploadcare-uploader"]'

  ns.initialize = function (container = ':root') {
    var el, i, len, ref, res, widgets
    res = []
    ref = $(container)
    for (i = 0, len = ref.length; i < len; i++) {
      el = ref[i]
      widgets = initialize(el.querySelectorAll(selector))
      res = res.concat(widgets)
    }
    return res
  }

  const initialize = function (targets) {
    var i, len, results, target, widget
    results = []
    for (i = 0, len = targets.length; i < len; i++) {
      target = targets[i]
      widget = $(target).data(dataAttr)
      if (widget && widget.inputElement === target) {
        // widget already exists
        continue
      }
      results.push(initializeWidget(target))
    }
    return results
  }

  ns.SingleWidget = function (el) {
    return initializeWidget(el, ns.widget.Widget)
  }

  ns.MultipleWidget = function (el) {
    return initializeWidget(el, ns.widget.MultipleWidget)
  }

  ns.Widget = function (el) {
    return initializeWidget(el)
  }

  const initializeWidget = function (input, targetClass) {
    var Widget, api, inputArr, s, widget
    inputArr = $(input)
    if (inputArr.length === 0) {
      throw new Error('No DOM elements found matching selector')
    } else if (inputArr.length > 1) {
      warn('There are multiple DOM elements matching selector')
    }
    input = inputArr.eq(0)
    s = settings.build(input.data())
    Widget = s.multiple ? ns.widget.MultipleWidget : ns.widget.Widget
    if (targetClass && Widget !== targetClass) {
      throw new Error(`This element should be processed using ${Widget._name}`)
    }
    api = input.data(dataAttr)
    if (!api || api.inputElement !== input[0]) {
      cleanup(input)
      widget = new Widget(input, s)
      api = widget.api()
      input.data(dataAttr, api)
      widget.template.content.data(dataAttr, api)
    }
    return api
  }

  const cleanup = function (input) {
    return input.off('.uploadcare').each(function () {
      var widget, widgetElement
      widgetElement = $(this).next('.uploadcare--widget')
      widget = widgetElement.data(dataAttr)
      if (widget && widget.inputElement === this) {
        return widgetElement.remove()
      }
    })
  }

  ns.start = once(function (s, isolated) {
    // when isolated, call settings.common(s) only
    s = settings.common(s, isolated)
    if (isolated) {
      return
    }
    if (s.live) {
      setInterval(ns.initialize, 100)
    }
    // should be after settings.common(s) call
    return ns.initialize()
  })

  return $(function () {
    if (!window.UPLOADCARE_MANUAL_START) {
      return ns.start()
    }
  })
})
