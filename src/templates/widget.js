import { html } from '../utils/html'
import { t } from '../locale'

const widget = () => html`
  <div class="uploadcare--widget">
    <div class="uploadcare--widget__dragndrop-area">${t('draghere')}</div>
    <div class="uploadcare--widget__progress"></div>
    <div class="uploadcare--widget__text"></div>
  </div>
`

export { widget }
