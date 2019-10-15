import { html } from '../utils/html'
import { t } from '../locale'

const tabCamera = () => html`
  <div class="uploadcare--tab__content">
    <div class="uploadcare--text uploadcare--text_size_large uploadcare--tab__title">
      ${t('dialog.tabs.camera.title')}
    </div>

    <div class="uploadcare--media uploadcare--camera__video-container">
      <video
        muted
        class="uploadcare--media__video uploadcare--camera__video uploadcare--camera__video_mirrored"
      ></video>

      <button type="button" class="uploadcare--button uploadcare--button_size_small uploadcare--button_overlay uploadcare--camera__button uploadcare--camera__button_type_mirror">
        ${t('dialog.tabs.camera.mirror')}
      </button>
    </div>

    <div class="uploadcare--camera__controls">
      <button type="button" class="uploadcare--button uploadcare--button_primary uploadcare--camera__button uploadcare--camera__button_type_start-record">
        ${t('dialog.tabs.camera.startRecord')}
      </button>
  
      <button type="button" class="uploadcare--button uploadcare--button_primary uploadcare--camera__button uploadcare--camera__button_type_capture">
        ${t('dialog.tabs.camera.capture')}
      </button>
    
      <button type="button" class="uploadcare--button uploadcare--camera__button uploadcare--camera__button_type_cancel-record">
        ${t('dialog.tabs.camera.cancelRecord')}
      </button>
    
      <button type="button" class="uploadcare--button uploadcare--button_primary uploadcare--camera__button uploadcare--camera__button_type_stop-record">
        ${t('dialog.tabs.camera.stopRecord')}
      </button>
    </div>

    <div class="uploadcare--camera__please-allow">
      <div class="uploadcare--text uploadcare--text_size_medium">
        ${t('dialog.tabs.camera.pleaseAllow.title')}
      </div>

      <div class="uploadcare--text">
        ${t('dialog.tabs.camera.pleaseAllow.text')}
      </div>
    </div>

    <div class="uploadcare--camera__not-found">
      <div class="uploadcare--text uploadcare--text_size_medium">
        ${t('dialog.tabs.camera.notFound.title')}
      </div>

      <div class="uploadcare--text">
        ${t('dialog.tabs.camera.notFound.text')}
      </div>
    </div>

    <button
      type="button"
      class="uploadcare--button uploadcare--camera__button uploadcare--camera__button_type_retry"
    >
      ${t('dialog.tabs.camera.retry')}
    </button>
  </div>
`

export { tabCamera }
