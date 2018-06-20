/* @flow */
/* @jsx h */

import {h, app} from 'hyperapp'
import {Input} from './components/Input/Input'
import {i18n, hyperi18n} from './i18n'
import {ru} from './i18n/locales'

i18n.addLocale(ru)

const state = {...hyperi18n.state}
const actions = {...hyperi18n.actions}

const view = () => (
  <div>
    Uploadcare Widget will be here.
    <Input type='search' />
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

    app(state, actions, view, $wrapper)
  })
}

export default {uploader: {init}}
