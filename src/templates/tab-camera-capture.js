import { html } from '../utils/html'

const tabCameraCapture = () => html`
  <div class="uploadcare--tab__content">
    <div class="uploadcare--text uploadcare--text_size_large uploadcare--tab__title">
      <%- ext.t('dialog.tabs.camera.title') %>
    </div>

    <div class="uploadcare--camera__controls">
      <button type="button"
              class="uploadcare--button uploadcare--button_size_big uploadcare--button_primary uploadcare--camera__button uploadcare--camera__button_type_photo">
        <%- ext.t('dialog.tabs.camera.capture') %>
      </button>
      <button type="button"
              class="uploadcare--button uploadcare--button_size_big uploadcare--button_primary uploadcare--camera__button uploadcare--camera__button_type_video">
        <%- ext.t('dialog.tabs.camera.startRecord') %>
      </button>
    </div>
  </div>
`

export { tabCameraCapture }
