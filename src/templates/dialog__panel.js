import { html } from '../utils/html'
import { t } from '../locale'
import { version } from '../../package.json'

const dialogPanel = () => html`
  <div class="uploadcare--panel">
    <div class="uploadcare--menu uploadcare--panel__menu">
      <button
        type="button"
        title="${t('dialog.openMenu')}"
        aria-label="${t('dialog.openMenu')}"
        class="uploadcare--button uploadcare--button_icon uploadcare--button_muted uploadcare--menu__toggle"
      >
        <svg
          role="presentation"
          width="32"
          height="32"
          class="uploadcare--icon uploadcare--menu__toggle-icon uploadcare--menu__toggle-icon_menu"
        >
          <use xlink:href="#uploadcare--icon-menu"></use>
        </svg>

        <svg
          role="presentation"
          width="32"
          height="32"
          class="uploadcare--icon uploadcare--menu__toggle-icon uploadcare--menu__toggle-icon_back"
        >
          <use xlink:href="#uploadcare--icon-back"></use>
        </svg>
      </button>

      <div class="uploadcare--menu__items"></div>
    </div>

    <div class="uploadcare--panel__content">
      <div class="uploadcare--footer uploadcare--panel__footer">
        <div class="uploadcare--footer__additions uploadcare--panel__message"></div>

        <button
          type="button"
          class="uploadcare--button uploadcare--footer__button uploadcare--panel__show-files"
        >
          ${t('dialog.showFiles')}

          <div class="uploadcare--panel__file-counter"></div>
        </button>

        <button
          type="button"
          class="uploadcare--button uploadcare--button_primary uploadcare--footer__button uploadcare--panel__done"
        >
          ${t('dialog.done')}
        </button>
      </div>

      <div class="uploadcare--powered-by uploadcare--panel__powered-by">
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
  </div>
`

export { dialogPanel }
