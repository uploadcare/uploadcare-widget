import { html } from '../utils/html.ts'
import locale from '../locale'

const tabPreviewMultiple = () => html`
  <div class="uploadcare--tab__header">
    <div
      id="preview__title" 
      class="uploadcare--text uploadcare--text_size_large uploadcare--tab__title uploadcare--preview__title"
      role="status" aria-live="assertive"
    ></div>
  </div>

  <div class="uploadcare--tab__content uploadcare--preview__content">
    <div class="uploadcare--files"></div>
  </div>

  <div class="uploadcare--footer uploadcare--tab__footer">
    <div
      class="uploadcare--footer__additions uploadcare--preview__message"
    ></div>

    <button
      type="button"
      class="uploadcare--button uploadcare--footer__button uploadcare--preview__back"
    >
      ${locale.t('dialog.tabs.preview.multiple.clear')}
    </button>

    <button
      type="button"
      class="uploadcare--button uploadcare--button_primary uploadcare--footer__button uploadcare--preview__done"
      aria-describedby="preview_title"
    >
      ${locale.t('dialog.tabs.preview.multiple.done')}
    </button>
  </div>
`

export { tabPreviewMultiple }
