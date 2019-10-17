import { html } from '../utils/html'

const widgetButton = ({ caption, name }) => html`
  <button
    type="button"
    class="uploadcare--widget__button uploadcare--widget__button_type_${name}"
  >
    ${caption}
  </button>
`

export {
  widgetButton
}
