import { html } from '../utils/html'
import locale from '../locale'

const tabFile = () => html`
  <div class="uploadcare--tab__content uploadcare--draganddrop">
    <div
      class="uploadcare--text uploadcare--text_size_extra-large uploadcare--dragging__show"
    >
      ${locale.t('draghere')}
    </div>

    <div class="uploadcare--draganddrop__title uploadcare--dragging__hide">
      <div class="uploadcare--draganddrop__supported">
        <div class="uploadcare--text uploadcare--text_size_extra-large">
          ${locale.t('dialog.tabs.file.drag')}
        </div>
        <div
          class="uploadcare--text uploadcare--text_size_small uploadcare--text_muted"
        >
          ${locale.t('dialog.tabs.file.or')}
        </div>
      </div>

      <div
        class="uploadcare--text uploadcare--text_size_large uploadcare--draganddrop__not-supported"
      >
        ${locale.t('dialog.tabs.file.nodrop')}
      </div>
    </div>

    <button
      type="button"
      class="uploadcare--button uploadcare--button_size_big uploadcare--button_primary uploadcare--tab__action-button needsclick uploadcare--dragging__hide"
    >
      ${locale.t('dialog.tabs.file.button')}
    </button>

    <div class="uploadcare--file-sources uploadcare--dragging__hide">
      <div
        class="uploadcare--text uploadcare--text_size_small uploadcare--text_muted uploadcare--file-sources__caption"
      >
        ${locale.t('dialog.tabs.file.also')}
      </div>
      <div class="uploadcare--file-sources__items">
        <button
          type="button"
          class="uploadcare--button uploadcare--button_icon uploadcare--file-source uploadcare--file-source_all uploadcare--file-sources_item"
        >
          <svg
            role="presentation"
            width="32"
            height="32"
            class="uploadcare--icon"
          >
            <use xlink:href="#uploadcare--icon-more"></use>
          </svg>
        </button>
      </div>
    </div>
  </div>
`

export { tabFile }
