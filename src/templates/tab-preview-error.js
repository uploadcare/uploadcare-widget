import { html } from '../utils/html'

const tabPreviewError = () => html`
  <div class="uploadcare--tab__content uploadcare--preview__content uploadcare--error">
      <div class="uploadcare--text uploadcare--text_size_large uploadcare--tab__title uploadcare--preview__title">
        <%-
        ext.t('dialog.tabs.preview.error.' + ext.error + '.title') || ext.t('dialog.tabs.preview.error.default.title')
        %>
      </div>

      <div class="uploadcare--text"><%-
        ext.t('dialog.tabs.preview.error.' + ext.error + '.text') || ext.t('dialog.tabs.preview.error.default.text') 
      %></div>

      <button type="button" class="uploadcare--button uploadcare--preview__back">
          <%- ext.t('dialog.tabs.preview.error.' + ext.error + '.back') || ext.t('dialog.tabs.preview.error.default.back') %>
      </button>
  </div>
`

export { tabPreviewError }
