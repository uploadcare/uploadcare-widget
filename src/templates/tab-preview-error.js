import { html } from '../utils/html'
import locale from '../locale'

const tabPreviewError = ({ debugUploads, source, error }) => html`
  <div
    class="uploadcare--tab__content uploadcare--preview__content uploadcare--error"
  >
    <div
      class="uploadcare--text uploadcare--text_size_large uploadcare--tab__title uploadcare--preview__title"
    >
      ${locale.t('dialog.tabs.preview.error.' + source + '.title') ||
      locale.t('dialog.tabs.preview.error.default.title')}
    </div>

    <div class="uploadcare--text">
      ${locale.t('dialog.tabs.preview.error.' + source + '.text') ||
      (debugUploads && error?.message) ||
      locale.t(`serverErrors.${error?.code}`) ||
      error?.message ||
      locale.t('dialog.tabs.preview.error.default.text')}
    </div>

    <button type="button" class="uploadcare--button uploadcare--preview__back">
      ${locale.t('dialog.tabs.preview.error.' + source + '.back') ||
      locale.t('dialog.tabs.preview.error.default.back')}
    </button>
  </div>
`

export { tabPreviewError }
