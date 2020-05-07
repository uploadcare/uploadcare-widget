import escape from 'escape-html'
import { html } from '../utils/html'
import locale from '../locale'

const tabPreviewImage = ({ src, name = '', crop }) => html`
  <div class="uploadcare--tab__header">
    <div
      class="uploadcare--text uploadcare--text_size_large uploadcare--tab__title uploadcare--preview__title"
    >
      ${locale.t('dialog.tabs.preview.image.title')}
    </div>
  </div>

  <div class="uploadcare--tab__content uploadcare--preview__content">
    <div class="uploadcare--media">
      <!--
      1162x684 is 1.5 size of conteiner
      TODO Use picture and srcset for create responsive image
    -->
      <img
        src="${src}"
        title="${escape(name)}"
        alt="${escape(name)}"
        class="uploadcare--media__image uploadcare--preview__image"
      />
    </div>
  </div>

  <div class="uploadcare--footer uploadcare--tab__footer">
    <div class="uploadcare--footer__additions">
      ${crop
        ? html`
            <div class="uploadcare--crop-sizes">
              <div
                role="button"
                tabindex="0"
                class="uploadcare--button uploadcare--button_icon uploadcare--crop-sizes__item"
                data-caption="free"
              >
                <div class="uploadcare--crop-sizes__icon"></div>
              </div>
            </div>
          `
        : ''}
    </div>

    <!-- TODO Change Cancel to Remove -->
    <button
      type="button"
      class="uploadcare--button uploadcare--footer__button uploadcare--preview__back"
    >
      ${locale.t('dialog.tabs.preview.image.change')}
    </button>

    <button
      type="button"
      class="uploadcare--button uploadcare--button_primary uploadcare--footer__button uploadcare--preview__done"
    >
      ${locale.t('dialog.tabs.preview.done')}
    </button>
  </div>
`

export { tabPreviewImage }
