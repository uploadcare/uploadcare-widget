/* @flow */
/* @jsx h */

import {h, app} from 'hyperapp'
import {Input} from './components/Input/Input'
import {build as buildSettings} from './modules/settings'
import {LocalizedDemo} from './components/LocalizedDemo/LocalizedDemo'
import {i18n, withLocales} from './i18n'
import {ru} from './i18n/locales'

i18n.addLocale(ru)

const state = {}
const actions = {}

const view = () => (
  <div>
    Uploadcare Widget will be here.
    <Input type='search' />
    <LocalizedDemo />
  </div>
)

const init = (targetElement: HTMLElement | null = document.body) => {
  if (!targetElement) {
    return
  }

  const $widgetInputs = targetElement.querySelectorAll('.uploadcare-uploader')

  Array.from($widgetInputs).forEach($widgetInput => {
    const $wrapper = document.createElement('div')
    const parentNode = $widgetInput.parentNode

    if (!parentNode) {
      return
    }

    $wrapper.classList.add('uploadcare-uploader--widget')
    parentNode.insertBefore($wrapper, $widgetInput)

    const settings = buildSettings($widgetInput)

    console.log(settings)

    withLocales(app)(state, actions, view, $wrapper)
  })
}

export default {uploader: {init}}
