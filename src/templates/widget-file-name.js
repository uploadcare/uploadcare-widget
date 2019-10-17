import { fitText, readableFileSize } from '../utils'
import { html } from '../utils/html'

const widgetFileName = ({ name, size }) => html`
  <div
    class="uploadcare--link uploadcare--widget__file-name"
    tabindex="0"
    role="link"
  >
    ${fitText(name, 20)}
  </div>

  <div class="uploadcare--widget__file-size">, ${readableFileSize(size)}</div>
`

export { widgetFileName }
