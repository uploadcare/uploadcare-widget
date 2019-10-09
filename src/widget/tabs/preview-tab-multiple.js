import $ from 'jquery'
import '../../vendor/jquery-ordering'

import { BasePreviewTab } from './base-preview-tab'

import { openPreviewDialog } from '../dialog'

import { boundMethodCheck } from '../../utils/bound-method-check'
import { readableFileSize } from '../../utils'
import { t } from '../../locale'
import { tpl } from '../../templates'

class PreviewTabMultiple extends BasePreviewTab {
  constructor () {
    super(...arguments)
    this.__updateContainerView = this.__updateContainerView.bind(this)
    this.__fileProgress = this.__fileProgress.bind(this)
    this.__fileDone = this.__fileDone.bind(this)
    this.__fileFailed = this.__fileFailed.bind(this)
    this.__fileAdded = this.__fileAdded.bind(this)
    this.__fileRemoved = this.__fileRemoved.bind(this)
    this.__fileReplaced = this.__fileReplaced.bind(this)
    this.container.append(tpl('tab-preview-multiple'))
    this.__fileTpl = $(tpl('tab-preview-multiple-file'))
    this.fileListEl = this.container.find('.uploadcare--files')
    this.doneBtnEl = this.container.find('.uploadcare--preview__done')
    $.each(this.dialogApi.fileColl.get(), (i, file) => {
      return this.__fileAdded(file)
    })
    this.__updateContainerView()
    this.dialogApi.fileColl.onAdd.add(this.__fileAdded, this.__updateContainerView)
    this.dialogApi.fileColl.onRemove.add(this.__fileRemoved, this.__updateContainerView)
    this.dialogApi.fileColl.onReplace.add(this.__fileReplaced, this.__updateContainerView)
    this.dialogApi.fileColl.onAnyProgress(this.__fileProgress)
    this.dialogApi.fileColl.onAnyDone(this.__fileDone)
    this.dialogApi.fileColl.onAnyFail(this.__fileFailed)
    this.fileListEl.addClass(this.settings.imagesOnly ? 'uploadcare--files_type_tiles' : 'uploadcare--files_type_table')
    this.__setupSorting()
  }

  __setupSorting () {
    return this.fileListEl.uploadcareSortable({
      touch: false,
      axis: this.settings.imagesOnly ? 'xy' : 'y',
      start: function (info) {
        return info.dragged.css('visibility', 'hidden')
      },
      finish: (info) => {
        var elements, index
        info.dragged.css('visibility', 'visible')
        elements = this.container.find('.uploadcare--file')
        index = (file) => {
          return elements.index(this.__fileToEl(file))
        }
        return this.dialogApi.fileColl.sort(function (a, b) {
          return index(a) - index(b)
        })
      }
    })
  }

  __updateContainerView () {
    var errorContainer, files, hasWrongNumberFiles, title, tooFewFiles, tooManyFiles, wrongNumberFilesMessage
    boundMethodCheck(this, PreviewTabMultiple)
    files = this.dialogApi.fileColl.length()
    tooManyFiles = files > this.settings.multipleMax
    tooFewFiles = files < this.settings.multipleMin
    hasWrongNumberFiles = tooManyFiles || tooFewFiles
    this.doneBtnEl
      .attr('disabled', hasWrongNumberFiles)
      .attr('aria-disabled', hasWrongNumberFiles)
    title = t('dialog.tabs.preview.multiple.question').replace('%files%', t('file', files))
    this.container.find('.uploadcare--preview__title').text(title)
    errorContainer = this.container.find('.uploadcare--preview__message')
    errorContainer.empty()
    if (hasWrongNumberFiles) {
      wrongNumberFilesMessage = tooManyFiles ? t('dialog.tabs.preview.multiple.tooManyFiles').replace('%max%', this.settings.multipleMax) : files && tooFewFiles ? t('dialog.tabs.preview.multiple.tooFewFiles').replace('%min%', this.settings.multipleMin).replace('%files%', t('file', files)) : undefined
      return errorContainer.addClass('uploadcare--error').text(wrongNumberFilesMessage)
    }
  }

  __updateFileInfo (fileEl, info) {
    var filename
    filename = info.name || t('dialog.tabs.preview.unknownName')
    fileEl.find('.uploadcare--file__name').text(filename)
    fileEl.find('.uploadcare--file__description').attr('title', t('dialog.tabs.preview.multiple.file.preview').replace('%file%', filename))
    fileEl.find('.uploadcare--file__remove').attr('title', t('dialog.tabs.preview.multiple.file.remove').replace('%file%', filename))
    return fileEl.find('.uploadcare--file__size').text(readableFileSize(info.size, '–'))
  }

  __fileProgress (file, progressInfo) {
    var fileEl
    boundMethodCheck(this, PreviewTabMultiple)
    fileEl = this.__fileToEl(file)
    fileEl.find('.uploadcare--progressbar__value').css('width', Math.round(progressInfo.progress * 100) + '%')
    return this.__updateFileInfo(fileEl, progressInfo.incompleteFileInfo)
  }

  __fileDone (file, info) {
    var cdnURL, fileEl, filePreview
    boundMethodCheck(this, PreviewTabMultiple)
    fileEl = this.__fileToEl(file).removeClass('uploadcare--file_status_uploading').addClass('uploadcare--file_status_uploaded')
    fileEl.find('.uploadcare--progressbar__value').css('width', '100%')
    this.__updateFileInfo(fileEl, info)
    if (info.isImage) {
      cdnURL = `${info.cdnUrl}-/quality/lightest/-/preview/108x108/`
      if (this.settings.previewUrlCallback) {
        cdnURL = this.settings.previewUrlCallback(cdnURL, info)
      }
      filePreview = $('<img>').attr('src', cdnURL).addClass('uploadcare--file__icon')
    } else {
      filePreview = $("<svg width='32' height='32'><use xlink:hPreviewTabMultiple='#uploadcare--icon-file'/></svg>").attr('role', 'presentation').attr('class', 'uploadcare--icon uploadcare--file__icon')
    }
    fileEl.find('.uploadcare--file__preview').html(filePreview)
    return fileEl.find('.uploadcare--file__description').on('click', () => {
      return openPreviewDialog(file, this.settings).done((newFile) => {
        return this.dialogApi.fileColl.replace(file, newFile)
      })
    })
  }

  __fileFailed (file, error, info) {
    var fileEl, filePreview
    boundMethodCheck(this, PreviewTabMultiple)
    fileEl = this.__fileToEl(file).removeClass('uploadcare--file_status_uploading').addClass('uploadcare--file_status_error')
    fileEl.find('.uploadcare--file__error').text(t(`errors.${error}`))
    filePreview = $("<svg width='32' height='32'><use xlink:hPreviewTabMultiple='#uploadcare--icon-error'/></svg>").attr('role', 'presentation').attr('class', 'uploadcare--icon uploadcare--file__icon')
    return fileEl.find('.uploadcare--file__preview').html(filePreview)
  }

  __fileAdded (file) {
    var fileEl
    boundMethodCheck(this, PreviewTabMultiple)
    fileEl = this.__createFileEl(file)
    return fileEl.appendTo(this.fileListEl)
  }

  __fileRemoved (file) {
    boundMethodCheck(this, PreviewTabMultiple)
    this.__fileToEl(file).remove()
    return $(file).removeData()
  }

  __fileReplaced (oldFile, newFile) {
    var fileEl
    boundMethodCheck(this, PreviewTabMultiple)
    fileEl = this.__createFileEl(newFile)
    fileEl.insertAfter(this.__fileToEl(oldFile))
    return this.__fileRemoved(oldFile)
  }

  __fileToEl (file) {
    // File can be removed before.
    return $(file).data('dpm-el') || $()
  }

  __createFileEl (file) {
    var fileEl
    fileEl = this.__fileTpl.clone().on('click', '.uploadcare--file__remove', () => {
      return this.dialogApi.fileColl.remove(file)
    })
    $(file).data('dpm-el', fileEl)
    return fileEl
  }

  displayed () {
    this.container.find('.uploadcare--preview__done').focus()
  }
}

export { PreviewTabMultiple }
