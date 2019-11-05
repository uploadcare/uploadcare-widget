import { html } from '../utils/html'
import locale from '../locale'

const tabCamera = () => html`
  <div class="uploadcare--tab__content">
    <div
      class="uploadcare--text uploadcare--text_size_large uploadcare--tab__title"
    >
      ${locale.t('dialog.tabs.camera.title')}
    </div>

    <div class="uploadcare--media uploadcare--camera__video-container">
      <video
        muted
        class="uploadcare--media__video uploadcare--camera__video uploadcare--camera__video_mirrored"
      ></video>

      <button
        type="button"
        class="uploadcare--button uploadcare--button_size_small uploadcare--button_overlay uploadcare--camera__button uploadcare--camera__button_type_mirror"
      >
        ${locale.t('dialog.tabs.camera.mirror')}
      </button>
    </div>

    <div class="uploadcare--camera__controls">
      <button
        type="button"
        class="uploadcare--button uploadcare--button_primary uploadcare--camera__button uploadcare--camera__button_type_start-record"
      >
        ${locale.t('dialog.tabs.camera.startRecord')}
      </button>

      <button
        type="button"
        class="uploadcare--button uploadcare--button_primary uploadcare--camera__button uploadcare--camera__button_type_capture"
      >
        ${locale.t('dialog.tabs.camera.capture')}
      </button>

      <button
        type="button"
        class="uploadcare--button uploadcare--camera__button uploadcare--camera__button_type_cancel-record"
      >
        ${locale.t('dialog.tabs.camera.cancelRecord')}
      </button>

      <button
        type="button"
        class="uploadcare--button uploadcare--button_primary uploadcare--camera__button uploadcare--camera__button_type_stop-record"
      >
        ${locale.t('dialog.tabs.camera.stopRecord')}
      </button>
    </div>

    <div class="uploadcare--camera__please-allow">
      <div class="uploadcare--text uploadcare--text_size_medium">
        ${locale.t('dialog.tabs.camera.pleaseAllow.title')}
      </div>

      <div class="uploadcare--text">
        ${locale.t('dialog.tabs.camera.pleaseAllow.text')}
      </div>
    </div>

    <div class="uploadcare--camera__not-found">
      <div class="uploadcare--text uploadcare--text_size_medium">
        ${locale.t('dialog.tabs.camera.notFound.title')}
      </div>

      <div class="uploadcare--text">
        ${locale.t('dialog.tabs.camera.notFound.text')}
      </div>
    </div>

    <button
      type="button"
      class="uploadcare--button uploadcare--camera__button uploadcare--camera__button_type_retry"
    >
      ${locale.t('dialog.tabs.camera.retry')}
    </button>
  </div>
`

export { tabCamera }
