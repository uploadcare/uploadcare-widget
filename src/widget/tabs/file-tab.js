import uploadcare from '../../namespace'
import { fileDragAndDrop, sendFileAPI } from '../../utils/abilities'

const {
  utils,
  dragdrop,
  locale: { t },
  jQuery: $,
  templates: { tpl }
} = uploadcare

uploadcare.namespace('widget.tabs', function (ns) {
  ns.FileTab = class FileTab {
    constructor (container, tabButton1, dialogApi, settings, name1) {
      this.__initTabsList = this.__initTabsList.bind(this)
      this.container = container
      this.tabButton = tabButton1
      this.dialogApi = dialogApi
      this.settings = settings
      this.name = name1
      this.container.append(tpl('tab-file'))
      this.__setupFileButton()
      this.__initDragNDrop()
      this.__initTabsList()
    }

    __initDragNDrop () {
      var dropArea
      dropArea = this.container.find('.uploadcare--draganddrop')
      if (fileDragAndDrop) {
        dragdrop.receiveDrop(dropArea, (type, files) => {
          this.dialogApi.addFiles(type, files)
          return this.dialogApi.switchTab('preview')
        })
        return dropArea.addClass('uploadcare--draganddrop_supported')
      }
    }

    __setupFileButton () {
      var fileButton
      fileButton = this.container.find('.uploadcare--tab__action-button')
      if (sendFileAPI) {
        return fileButton.on('click', () => {
          utils.fileSelectDialog(this.container, this.settings, (input) => {
            this.dialogApi.addFiles('object', input.files)
            return this.dialogApi.switchTab('preview')
          })
          return false
        })
      } else {
        return utils.fileInput(fileButton, this.settings, (input) => {
          this.dialogApi.addFiles('input', [input])
          return this.dialogApi.switchTab('preview')
        })
      }
    }

    __initTabsList () {
      var i, len, list, n, ref, tab
      list = this.container.find('.uploadcare--file-sources__items')
      list.remove('.uploadcare--file-sources__item:not(.uploadcare--file-source_all)')
      n = 0
      ref = this.settings.tabs
      for (i = 0, len = ref.length; i < len; i++) {
        tab = ref[i]
        if (tab === 'file' || tab === 'url' || tab === 'camera') {
          continue
        }
        if (!this.dialogApi.isTabVisible(tab)) {
          continue
        }
        n += 1
        if (n > 5) {
          continue
        }
        list.append([this.__tabButton(tab), ' '])
      }

      list.find('.uploadcare--file-source_all').on('click', () => {
        return this.dialogApi.openMenu()
      })

      if (n > 5) {
        list.addClass('uploadcare--file-sources__items_many')
      }
      return this.container.find('.uploadcare--file-sources').attr('hidden', n === 0)
    }

    __tabButton (name) {
      var tabIcon
      tabIcon = $(`<svg width='32' height='32'><use xlink:href='#uploadcare--icon-${name}'/></svg>`).attr('role', 'presentation').attr('class', 'uploadcare--icon uploadcare--file-source__icon')
      return $('<button>').addClass('uploadcare--button').addClass('uploadcare--button_icon').addClass('uploadcare--file-source').addClass(`uploadcare--file-source_${name}`).addClass('uploadcare--file-sources__item').attr('type', 'button').attr('title', t(`dialog.tabs.names.${name}`)).attr('data-tab', name).append(tabIcon).on('click', () => {
        return this.dialogApi.switchTab(name)
      })
    }

    displayed () {
      this.container.find('.uploadcare--tab__action-button').focus()
    }
  }
})
