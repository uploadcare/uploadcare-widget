import { html } from '../utils/html'

const tabPreviewRegular = () => html`
<div class="uploadcare--tab__header">
  <div class="uploadcare--text uploadcare--text_size_large uploadcare--tab__title"><%- ext.t('dialog.tabs.preview.regular.title') %></div>
</div>

<div class="uploadcare--tab__content uploadcare--preview__content">
  <div class="uploadcare--text uploadcare--preview__file-name">
    <%- (ext.file.name || ext.t('dialog.tabs.preview.unknownName')) %><%-
    ext.utils.readableFileSize(ext.file.size, '', ', ') %>
  </div>
</div>

<div class="uploadcare--footer uploadcare--tab__footer">
  <button type="button" class="uploadcare--button uploadcare--footer__button uploadcare--preview__back">
      <%- ext.t('dialog.tabs.preview.change') %>
  </button>
  <button type="button" class="uploadcare--button uploadcare--button_primary uploadcare--footer__button uploadcare--preview__done">
      <%- ext.t('dialog.tabs.preview.done') %>
  </button>
</div>
`

export { tabPreviewRegular }
