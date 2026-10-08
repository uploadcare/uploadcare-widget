import escape from 'escape-html'
import { html } from '../utils/html'
import locale from '../locale'

// escape-html stringifies undefined, which would short-circuit the fallbacks
const escapedMessage = (error) => error?.message && escape(error.message)

const tabPreviewError = ({ debugUploads, errorType, error }) => html`
  <div
    class="uploadcare--tab__content uploadcare--preview__content uploadcare--error"
  >
    <div
      class="uploadcare--text uploadcare--text_size_large uploadcare--tab__title uploadcare--preview__title"
    >
      ${locale.t('dialog.tabs.preview.error.' + errorType + '.title') ||
      locale.t('dialog.tabs.preview.error.default.title')}
    </div>

    <div class="uploadcare--text">
      ${(debugUploads && escapedMessage(error)) ||
      locale.t(`serverErrors.${error?.code}`) ||
      escapedMessage(error) ||
      locale.t('dialog.tabs.preview.error.' + errorType + '.text') ||
      locale.t('dialog.tabs.preview.error.default.text')}
    </div>

    <button type="button" class="uploadcare--button uploadcare--preview__back">
      ${locale.t('dialog.tabs.preview.error.' + errorType + '.back') ||
      locale.t('dialog.tabs.preview.error.default.back')}
    </button>
  </div>
`

export { tabPreviewError }
