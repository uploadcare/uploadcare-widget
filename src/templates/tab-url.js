import { html } from '../utils/html'
import locale from '../locale'

const tabUrl = () => html`
  <div class="uploadcare--tab__content">
    <div
      class="uploadcare--text uploadcare--text_size_large uploadcare--tab__title"
    >
      ${locale.t('dialog.tabs.url.title')}
    </div>

    <div class="uploadcare--text">${locale.t('dialog.tabs.url.line1')}</div>
    <div class="uploadcare--text">${locale.t('dialog.tabs.url.line2')}</div>

    <form class="uploadcare--form">
      <input
        type="text"
        class="uploadcare--input"
        placeholder="${locale.t('dialog.tabs.url.input')}"
      />

      <button
        type="submit"
        class="uploadcare--button uploadcare--button_primary uploadcare--tab__action-button"
        type="submit"
      >
        ${locale.t('dialog.tabs.url.button')}
      </button>
    </form>
  </div>
`

export { tabUrl }
