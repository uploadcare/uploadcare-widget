/* @flow */
/* @jsx h */

import {h, app} from 'hyperapp'
import {Input} from './components/Input/Input'
import {build as buildSettings} from './modules/settings'

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

    const settings = buildSettings($widgetInput)

    app({}, {}, view, $wrapper)
  })
}

export default {uploader: {init}}
