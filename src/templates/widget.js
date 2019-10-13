import { html } from '../utils/html'
import locale from '../locale'

const widget = () => html`
  <div class="uploadcare--widget" aria-describedby="uploadcare--widget__text uploadcare--widget__progress">
    <div class="uploadcare--widget__dragndrop-area">
      ${locale.t('draghere')}
    </div>
    <div id="uploadcare--widget__progress" class="uploadcare--widget__progress" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
    <div id="uploadcare--widget__text" class="uploadcare--widget__text" aria-live="polite"></div>
  </div>
`

export { widget }
