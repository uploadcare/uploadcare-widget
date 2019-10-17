import { html } from '../utils/html'
import { t } from '../locale'

const tabPreviewMultipleFile = () => html`
  <div
    class="uploadcare--file uploadcare--files__item uploadcare--file_status_uploading"
  >
    <div class="uploadcare--file__description" tabindex="0">
      <div class="uploadcare--file__preview"></div>
      <div class="uploadcare--file__name">
        ${t('dialog.tabs.preview.unknownName')}
      </div>
      <div class="uploadcare--file__size"></div>
      <div class="uploadcare--file__error"></div>
    </div>

    <div class="uploadcare--file__progressbar">
      <div class="uploadcare--progressbar">
        <div class="uploadcare--progressbar__value"></div>
      </div>
    </div>

    <button
      type="button"
      class="uploadcare--button uploadcare--button_icon uploadcare--button_muted uploadcare--file__remove"
    >
      <svg role="presentation" width="32" height="32" class="uploadcare--icon">
        <use xlink:href="#uploadcare--icon-remove"></use>
      </svg>
    </button>
  </div>
`

export { tabPreviewMultipleFile }
