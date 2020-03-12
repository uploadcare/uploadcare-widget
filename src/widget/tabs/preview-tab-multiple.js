// import '../../vendor/jquery-ordering'

import { BasePreviewTab } from './base-preview-tab'
import { openPreviewDialog } from '../dialog'

import { readableFileSize, parseHTML, matches } from '../../utils'
import locale from '../../locale'
import { tpl } from '../../templates'
import { html } from '../../utils/html'

class PreviewTabMultiple extends BasePreviewTab {
  constructor() {
    super(...arguments)
    this._mapadelegatov = new WeakMap()
    this.container.appendChild(parseHTML(tpl('tab-preview-multiple')))
    this.__fileTpl = parseHTML(tpl('tab-preview-multiple-file'))
    this.fileListEl = this.container.querySelector('.uploadcare--files')
    this.doneBtnEl = this.container.querySelector('.uploadcare--preview__done')

    this.dialogApi.fileColl.get().forEach(file => {
      this.__fileAdded(file)
    })

    this.__updateContainerView()

    this.dialogApi.fileColl.onAdd.add(this.__fileAdded.bind(this), () =>
      this.__updateContainerView()
    )
    this.dialogApi.fileColl.onRemove.add(this.__fileRemoved.bind(this), () =>
      this.__updateContainerView()
    )
    this.dialogApi.fileColl.onReplace.add(this.__fileReplaced.bind(this), () =>
      this.__updateContainerView()
    )
    this.dialogApi.fileColl.onAnyProgress(this.__fileProgress.bind(this))
    this.dialogApi.fileColl.onAnyDone(this.__fileDone.bind(this))
    this.dialogApi.fileColl.onAnyFail(this.__fileFailed.bind(this))
    this.fileListEl.classList.add(
      this.settings.imagesOnly
        ? 'uploadcare--files_type_tiles'
        : 'uploadcare--files_type_table'
    )
    // this.__setupSorting()
  }

  // __setupSorting() {
  //   return this.fileListEl.uploadcareSortable({
  //     touch: false,
  //     axis: this.settings.imagesOnly ? 'xy' : 'y',
  //     start: function(info) {
  //       return info.dragged.css('visibility', 'hidden')
  //     },
  //     finish: info => {
  //       var elements, index
  //       info.dragged.css('visibility', 'visible')
  //       elements = this.container.find('.uploadcare--file')
  //       index = file => {
  //         return elements.index(this.__fileToEl(file))
  //       }
  //       return this.dialogApi.fileColl.sort(function(a, b) {
  //         return index(a) - index(b)
  //       })
  //     }
  //   })
  // }

  __updateContainerView() {
    const files = this.dialogApi.fileColl.length()
    const tooManyFiles = files > this.settings.multipleMax
    const tooFewFiles = files < this.settings.multipleMin
    const hasWrongNumberFiles = tooManyFiles || tooFewFiles

    if (hasWrongNumberFiles) {
      this.doneBtnEl.setAttribute('disabled', true)
      this.doneBtnEl.setAttribute('aria-disabled', true)
    } else {
      this.doneBtnEl.removeAttribute('disabled')
      this.doneBtnEl.removeAttribute('aria-disabled')
    }

    const title = locale
      .t('dialog.tabs.preview.multiple.question')
      .replace('%files%', locale.t('file', files))

    this.container.querySelector(
      '.uploadcare--preview__title'
    ).textContent = title
    const errorContainer = this.container.querySelector(
      '.uploadcare--preview__message'
    )

    while (errorContainer.firstChild)
      errorContainer.removeChild(errorContainer.firstChild)

    if (hasWrongNumberFiles) {
      const wrongNumberFilesMessage = tooManyFiles
        ? locale
            .t('dialog.tabs.preview.multiple.tooManyFiles')
            .replace('%max%', this.settings.multipleMax)
        : files && tooFewFiles
        ? locale
            .t('dialog.tabs.preview.multiple.tooFewFiles')
            .replace('%min%', this.settings.multipleMin)
            .replace('%files%', locale.t('file', files))
        : undefined

      errorContainer.classList.add('uploadcare--error')
      errorContainer.textContent = wrongNumberFilesMessage
    }
  }

  __updateFileInfo(fileEl, info) {
    var filename = info.name || locale.t('dialog.tabs.preview.unknownName')
    fileEl.querySelector('.uploadcare--file__name').textContent = filename
    fileEl
      .querySelector('.uploadcare--file__description')
      .setAttribute(
        'aria-label',
        locale
          .t('dialog.tabs.preview.multiple.file.preview')
          .replace('%file%', filename)
      )

    const removeButton = fileEl.querySelector('.uploadcare--file__remove')
    removeButton.setAttribute(
      'title',
      locale
        .t('dialog.tabs.preview.multiple.file.remove')
        .replace('%file%', filename)
    )
    removeButton.setAttribute(
      'aria-label',
      locale
        .t('dialog.tabs.preview.multiple.file.remove')
        .replace('%file%', filename)
    )

    fileEl.querySelector(
      '.uploadcare--file__size'
    ).textContent = readableFileSize(info.size, '–')
  }

  __fileProgress(file, progressInfo) {
    var fileEl = this.__fileToEl(file)
    const progress = fileEl.querySelector('.uploadcare--progressbar__value')

    progress.style.width = Math.round(progressInfo.progress * 100) + '%'

    return this.__updateFileInfo(fileEl, progressInfo.incompleteFileInfo || {})
  }

  __fileDone(file, info) {
    const fileEl = this.__fileToEl(file)
    fileEl.classList.remove('uploadcare--file_status_uploading')
    fileEl.classList.add('uploadcare--file_status_uploaded')

    fileEl.querySelector('.uploadcare--progressbar__value').style.width = '100%'

    this.__updateFileInfo(fileEl, info)

    let filePreview
    if (info.isImage) {
      let cdnURL = `${info.cdnUrl}-/quality/lightest/-/preview/108x108/`
      if (this.settings.previewUrlCallback) {
        cdnURL = this.settings.previewUrlCallback(cdnURL, info)
      }
      const filename = (fileEl.querySelector(
        '.uploadcare--file__name'
      ).textContent = '')
      filePreview = html`
        <img src="${cdnURL}" alt="${filename}" class="uploadcare--file__icon"></img>
      `
    } else {
      filePreview = html`
        <svg
          width="32"
          height="32"
          role="presentation"
          class="uploadcare--icon uploadcare--file__icon"
        >
          <use xlink:href="#uploadcare--icon-file" />
        </svg>
      `
    }
    fileEl.querySelector('.uploadcare--file__preview').innerHTML = filePreview

    return fileEl
      .querySelector('.uploadcare--file__description')
      .addEventListener('click', () => {
        return openPreviewDialog(file, this.settings).done(newFile => {
          return this.dialogApi.fileColl.replace(file, newFile)
        })
      })
  }

  __fileFailed(file, error, info) {
    const fileEl = this.__fileToEl(file)
    fileEl.classList.remove('uploadcare--file_status_uploading')
    fileEl.classList.add('uploadcare--file_status_error')
    fileEl.querySelector('.uploadcare--file__error').textContent = locale.t(
      `errors.${error}`
    )

    const filePreview = html`
      <svg
        width="32"
        height="32"
        role="presentation"
        class="uploadcare--icon uploadcare--file__icon"
      >
        <use xlink:href="#uploadcare--icon-error" />
      </svg>
    `

    fileEl.querySelector('.uploadcare--file__preview').innerHTML = filePreview
  }

  __fileAdded(file) {
    this.fileListEl.appendChild(this.__createFileEl(file))
  }

  __fileRemoved(file) {
    const node = this.__fileToEl(file)
    node.parentNode.removeChild(node)
    this._mapadelegatov.delete(file)
  }

  __fileReplaced(oldFile, newFile) {
    const oldNode = this.__fileToEl(oldFile)

    oldNode.parentNode.insertBefore(this.__createFileEl(newFile), oldNode.nextSibling)
    this.__fileRemoved(oldFile)
  }

  __fileToEl(file) {
    // File can be removed before.
    if (this._mapadelegatov.has(file)) {
      return this._mapadelegatov.get(file)
    } else {
      return this.__createFileEl(file)
    }
  }

  __createFileEl(file) {
    const fileEl = this.__fileTpl.cloneNode(true)

    fileEl.addEventListener('click', e => {
      if (matches(e.target, '.uploadcare--file__remove')) {
        this.dialogApi.fileColl.remove(file)
      }
    })

    this._mapadelegatov.set(file, fileEl)

    return fileEl
  }

  displayed() {
    this.container.querySelector('.uploadcare--preview__done').focus()
  }
}

export { PreviewTabMultiple }
