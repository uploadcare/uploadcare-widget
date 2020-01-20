import { html } from '../utils/html.ts'
import locale from '../locale'

const tabPreviewVideo = () => html`
  <div class="uploadcare--tab__header">
    <div
      class="uploadcare--text uploadcare--text_size_large uploadcare--tab__title uploadcare--preview__title"
    >
      ${locale.t('dialog.tabs.preview.video.title')}
    </div>
  </div>

  <div class="uploadcare--tab__content uploadcare--preview__content">
    <div class="uploadcare--media">
      <video
        controls
        class="uploadcare--media__video uploadcare--preview__video"
      ></video>
    </div>
  </div>

  <div class="uploadcare--footer uploadcare--tab__footer">
    <button
      type="button"
      class="uploadcare--button uploadcare--footer__button uploadcare--preview__back"
    >
      ${locale.t('dialog.tabs.preview.video.change')}
    </button>

    <button
      type="button"
      class="uploadcare--button uploadcare--button_primary uploadcare--footer__button uploadcare--preview__done"
    >
      ${locale.t('dialog.tabs.preview.done')}
    </button>
  </div>
`

export { tabPreviewVideo }
