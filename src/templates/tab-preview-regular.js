import escape from 'escape-html'
import { html } from '../utils/html'
import { readableFileSize } from '../utils'
import locale from '../locale'

const tabPreviewRegular = ({ file }) => html`
  <div class="uploadcare--tab__header">
    <div
      id="tab__title"
      class="uploadcare--text uploadcare--text_size_large uploadcare--tab__title"
      role="status"
      aria-live="assertive"
    >
      ${locale.t('dialog.tabs.preview.regular.title')}
    </div>
  </div>

  <div class="uploadcare--tab__content uploadcare--preview__content">
    <div class="uploadcare--text uploadcare--preview__file-name">
      ${escape(file.name) || locale.t('dialog.tabs.preview.unknownName')}
      ${readableFileSize(file.size, '', ', ')}
    </div>
  </div>

  <div class="uploadcare--footer uploadcare--tab__footer">
    <button
      type="button"
      class="uploadcare--button uploadcare--footer__button uploadcare--preview__back"
    >
      ${locale.t('dialog.tabs.preview.change')}
    </button>

    <button
      type="button"
      class="uploadcare--button uploadcare--button_primary uploadcare--footer__button uploadcare--preview__done"
      aria-describedby="tab__title"
    >
      ${locale.t('dialog.tabs.preview.done')}
    </button>
  </div>
`

export { tabPreviewRegular }
