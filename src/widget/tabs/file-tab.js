import { fileDragAndDrop } from '../../utils/abilities'
import { fileSelectDialog, parseHTML } from '../../utils'
import { html } from '../../utils/html'
import locale from '../../locale'
import { tpl } from '../../templates'
import { receiveDrop } from '../dragdrop'

class FileTab {
  constructor(container, tabButton, dialogApi, settings, name) {
    this.__initTabsList = this.__initTabsList.bind(this)
    this.container = container
    this.tabButton = tabButton
    this.dialogApi = dialogApi
    this.settings = settings
    this.name = name
    this.container.append(parseHTML(tpl('tab-file')))
    this.__setupFileButton()
    this.__initDragNDrop()
    this.__initTabsList()
  }

  __initDragNDrop() {
    var dropArea = this.container.querySelector('.uploadcare--draganddrop')
    if (fileDragAndDrop) {
      receiveDrop(dropArea, files => {
        this.dialogApi.addFiles('object', files)
        this.dialogApi.switchTab('preview')
      })

      dropArea.classList.add('uploadcare--draganddrop_supported')
    }
  }

  __setupFileButton() {
    var fileButton = this.container.querySelector(
      '.uploadcare--tab__action-button'
    )

    fileButton.addEventListener('click', () => {
      fileSelectDialog(this.container, this.settings, input => {
        this.dialogApi.addFiles('object', input.files)
        return this.dialogApi.switchTab('preview')
      })
    })
  }

  __initTabsList() {
    const list = this.container.querySelector(
      '.uploadcare--file-sources__items'
    )

    while (list.childElementCount > 1) {
      list.removeChild(list.lastChild);
    }

    let n = 0
    for (let i = 0, len = this.settings.tabs.length; i < len; i++) {
      const tab = this.settings.tabs[i]
      if (tab === 'file' || tab === 'url' || tab === 'camera') {
        continue
      }
      if (!this.dialogApi.isTabVisible(tab)) {
        continue
      }
      n += 1
      if (n > 5) {
        break
      }
      list.appendChild(this.__tabButton(tab), document.createTextNode(' '))
    }

    list
      .querySelector('.uploadcare--file-source_all')
      .addEventListener('click', () => {
        return this.dialogApi.openMenu()
      })

    if (n > 5) {
      list.classList.add('uploadcare--file-sources__items_many')
    }
    return this.container
      .querySelector('.uploadcare--file-sources')
      .setAttribute('hidden', n === 0)
  }

  __tabButton(name) {
    const button = parseHTML(
      html`
        <button
          type="button"
          title="${locale.t(`dialog.tabs.names.${name}`)}"
          class="uploadcare--button uploadcare--button_icon uploadcare--file-source uploadcare--file-source_${name} uploadcare--file-sources__item"
          data-tab="${name}"
        >
          <svg
            role="presentation"
            class="uploadcare--icon uploadcare--file-source__icon"
            width="32"
            height="32"
          >
            <use xlink:href="#uploadcare--icon-${name}" />
          </svg>
        </button>
      `
    )

    button.addEventListener('click', () => {
      return this.dialogApi.switchTab(name)
    })

    return button
  }

  displayed() {
    this.container.querySelector('.uploadcare--tab__action-button').focus()
  }
}

export { FileTab }
