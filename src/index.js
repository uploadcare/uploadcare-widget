import {h, app} from 'hyperapp'

const view = () => (
  <div>
    Uploadcare Widget will be here.
  </div>
)

const init = (targetElement = document.body) => {
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
