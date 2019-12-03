import $ from 'jquery'

import { Widget as WidgetClass } from './widget'
import { MultipleWidget as MultipleWidgetClass } from './multiple-widget'

import { warn } from '../utils/warnings'
import { once } from '../utils'
import { build, common } from '../settings'
import { isWindowDefined } from '../utils/is-window-defined'

const dataAttr = 'uploadcareWidget'
const selector = '[role~="uploadcare-uploader"]'

const initialize = function(container = ':root') {
  var el, i, len, ref, res, widgets
  res = []
  ref = $(container)
  for (i = 0, len = ref.length; i < len; i++) {
    el = ref[i]
    widgets = _initialize(el.querySelectorAll(selector))
    res = res.concat(widgets)
  }
  return res
}

const _initialize = function(targets) {
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

const SingleWidget = function(el) {
  return initializeWidget(el, WidgetClass)
}

const MultipleWidget = function(el) {
  return initializeWidget(el, MultipleWidgetClass)
}

const Widget = function(el) {
  return initializeWidget(el)
}

const initializeWidget = function(input, targetClass) {
  const inputArr = $(input)

  if (inputArr.length === 0) {
    throw new Error('No DOM elements found matching selector')
  } else if (inputArr.length > 1) {
    warn('There are multiple DOM elements matching selector')
  }

  input = inputArr.eq(0)

  const s = build(input.data())
  const Widget = s.multiple ? MultipleWidgetClass : WidgetClass

  if (targetClass && Widget !== targetClass) {
    throw new Error(`This element should be processed using ${Widget._name}`)
  }

  let api = input.data(dataAttr)
  if (!api || api.inputElement !== input[0]) {
    cleanup(input)
    const widget = new Widget(input, s)

    api = widget.api()
    input.data(dataAttr, api)
    widget.template.content.data(dataAttr, api)
  }

  // ignore clicks received from parent label
  input.parent('label').on('click', e => e.preventDefault())

  return api
}

const cleanup = function(input) {
  return input.off('.uploadcare').each(function() {
    var widget, widgetElement
    widgetElement = $(this).next('.uploadcare--widget')
    widget = widgetElement.data(dataAttr)
    if (widget && widget.inputElement === this) {
      return widgetElement.remove()
    }
  })
}

const start = once(function(s, isolated) {
  // when isolated, call settings.common(s) only
  s = common(s, isolated)
  if (isolated) {
    return
  }
  if (s.live) {
    setInterval(initialize, 100)
  }
  // should be after settings.common(s) call
  return initialize()
})

isWindowDefined() &&
  $(function() {
    if (!window.UPLOADCARE_MANUAL_START) {
      start()
    }
  })

export { initialize, SingleWidget, MultipleWidget, Widget, start }
