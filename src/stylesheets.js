import $ from 'jquery'

import { tpl } from './templates'
import { waitForSettings } from './settings'

waitForSettings.add(function (settings) {
  const css = tpl('styles', { settings })
  const style = document.createElement('style')

  style.setAttribute('type', 'text/css')

  if (style.styleSheet != null) {
    style.styleSheet.cssText = css
  } else {
    style.appendChild(document.createTextNode(css))
  }

  return $('head').prepend(style)
})
