import { html } from '../utils/html'
import { t } from '../locale'

const tabPreviewError = ({ error }) => html`
  <div
    class="uploadcare--tab__content uploadcare--preview__content uploadcare--error"
  >
    <div
      class="uploadcare--text uploadcare--text_size_large uploadcare--tab__title uploadcare--preview__title"
    >
      ${t('dialog.tabs.preview.error.' + error + '.title') ||
        t('dialog.tabs.preview.error.default.title')}
    </div>

    <div class="uploadcare--text">
      ${t('dialog.tabs.preview.error.' + error + '.text') ||
        t('dialog.tabs.preview.error.default.text')}
    </div>

    <button type="button" class="uploadcare--button uploadcare--preview__back">
      ${t('dialog.tabs.preview.error.' + error + '.back') ||
        t('dialog.tabs.preview.error.default.back')}
    </button>
  </div>
`

export { tabPreviewError }
