import { html } from '../utils/html'
import { t } from '../locale'
import { version } from '../../package.json'

const dialog = () => html`
  <div class="uploadcare--dialog">
    <div class="uploadcare--dialog__container">
      <button
        type="button"
        title="${t('dialog.close')}"
        aria-label="${t('dialog.close')}"
        class="uploadcare--button uploadcare--button_icon uploadcare--button_muted uploadcare--dialog__close"
      >
        <svg
          role="presentation"
          width="32"
          height="32"
          class="uploadcare--icon"
        >
          <use xlink:href="#uploadcare--icon-close"></use>
        </svg>
      </button>

      <div class="uploadcare--dialog__placeholder"></div>
    </div>

    <div class="uploadcare--powered-by uploadcare--dialog__powered-by">
      ${t('dialog.footer.text')}
      <a
        class="uploadcare--link uploadcare--powered-by__link"
        href="https://uploadcare.com/uploader/${version}/"
        target="_blank"
      >
        <svg
          width="32"
          height="32"
          role="presentation"
          class="uploadcare--icon uploadcare--powered-by__logo"
        >
          <use xlink:href="#uploadcare--icon-uploadcare"></use>
        </svg>

        ${t('dialog.footer.link')}
      </a>
    </div>
  </div>
`

export { dialog }
