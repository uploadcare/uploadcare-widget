import { Widget as WidgetClass } from './widget'
import { MultipleWidget as MultipleWidgetClass } from './multiple-widget'

import { once } from '../utils'
import { build, common } from '../settings'
import { isWindowDefined } from '../utils/is-window-defined'
import ready from '../utils/ready'

const dataAttr = 'uploadcareWidget'
const selector = '[role~="uploadcare-uploader"]'
const cache = new WeakMap()

const initialize = function(containerSelector = ':root') {
  const result = []
  const containers = document.querySelectorAll(containerSelector)
  for (let i = 0, len = containers.length; i < len; i++) {
    const el = containers[i]
    const targets = el.querySelectorAll(selector)

    for (let j = 0, len = targets.length; j < len; j++) {
      const target = targets[j]

      if (cache.has(target)) {
        // widget already exists
        continue
      }

      const widget = initializeWidget(target)
      cache.set(target, widget)
      result.push(widget)
    }
  }

  return result
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
  const s = build(input.dataset)
  const Widget = s.multiple ? MultipleWidgetClass : WidgetClass

  if (targetClass && Widget !== targetClass) {
    throw new Error(`This element should be processed using ${Widget._name}`)
  }

  let api = cache.get(input)
  if (!api || api.inputElement !== input) {
    cache.delete(input)
    cleanup(input)
    const widget = new Widget(input, s)

    api = widget.api()
    input.dataset[dataAttr] = api
    widget.template.content.data(dataAttr, api)
  }

  return api
}

const cleanup = function(input) {
  const widgetElement = input.nextElementSibling
  const widget = widgetElement && widgetElement.dataset[dataAttr]
  if (widget && widget.inputElement === input) {
    return widgetElement.parentNode.removeChild(widgetElement)
  }
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
  initialize()
})

isWindowDefined() &&
  ready(function() {
    if (!window.UPLOADCARE_MANUAL_START) {
      start()
    }
  })

export { initialize, SingleWidget, MultipleWidget, Widget, start }
