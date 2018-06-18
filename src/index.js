/* @flow */
/* @jsx h */

import {h, app} from 'hyperapp'
import './config.css'
import {Input} from './components/Input/Input'

const view = () => (
  <div>
    Uploadcare Widget will be here.
    <Input type='search' />
  </div>
)

const init = (targetElement: HTMLElement = document.body) => {
  const $widgetInputs = targetElement.querySelectorAll('.uploadcare-uploader')

  Array.from($widgetInputs)
    .forEach($widgetInput => {
      const $wrapper = document.createElement('div')

      $wrapper.classList.add('uploadcare-uploader--widget')

      $widgetInput.parentNode.insertBefore($wrapper, $widgetInput)

      app({}, {}, view, $wrapper)
    })
}

export default {uploader: {init}}
