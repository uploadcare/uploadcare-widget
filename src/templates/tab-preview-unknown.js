import { html } from '../utils/html'
import { t } from '../locale'

const tabPreviewUnknown = () => html`
  <div class="uploadcare--tab__header">
    <div class="uploadcare--text uploadcare--text_size_large uploadcare--tab__title uploadcare--preview__title">
      ${t('dialog.tabs.preview.unknown.title')}
    </div>
  </div>

  <div class="uploadcare--tab__content uploadcare--preview__content">
    <div class="uploadcare--text uploadcare--preview__file-name"></div>
  </div>

  <div class="uploadcare--footer uploadcare--tab__footer">
    <!-- TODO Change Cancel to Remove -->
    
    <button
      type="button"
      class="uploadcare--button uploadcare--footer__button uploadcare--preview__back"
    >
      ${t('dialog.tabs.preview.change')}
    </button>

    <button
      type="button"
      class="uploadcare--button uploadcare--button_primary uploadcare--footer__button uploadcare--preview__done"
    >
      ${t('dialog.tabs.preview.unknown.done')}
    </button>
  </div>
`

export { tabPreviewUnknown }
