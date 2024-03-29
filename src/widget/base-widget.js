import $ from 'jquery'

import locale from '../locale'
import { defer, bindAll, publicCallbacks, fileSelectDialog } from '../utils'
import { valueToFile } from '../utils/files'
import { receiveDrop } from './dragdrop'
import { Template } from './template'
import { openDialog } from './dialog'

class BaseWidget {
  constructor(element, settings) {
    this.element = element
    this.settings = settings
    this.validators = this.settings.validators = []
    this.currentObject = null
    this.__onDialogOpen = $.Callbacks()
    this.__onUploadComplete = $.Callbacks()
    this.__onChange = $.Callbacks().add((object) => {
      return object != null
        ? object.promise().done((info) => {
            return this.__onUploadComplete.fire(info)
          })
        : undefined
    })
    this.__setupWidget()
    this.element.on('change.uploadcare', this.reloadInfo.bind(this))
    // Delay loading info to allow set custom validators on page load.
    this.__hasValue = false
    defer(() => {
      // Do not reload info if user call uc.Widget().value(uuid) manual.
      if (!this.__hasValue) {
        return this.reloadInfo()
      }
    })
  }

  __setupWidget() {
    var path
    this.template = new Template(this.settings, this.element)
    path = ['buttons.choose']
    path.push(this.settings.imagesOnly ? 'images' : 'files')
    path.push(this.settings.multiple ? 'other' : 'one')
    this.template
      .addButton('open', locale.t(path.join('.')))
      .toggleClass('needsclick', this.settings.systemDialog)
      .on('click', () => {
        return this.openDialog()
      })
    this.template
      .addButton('cancel', locale.t('buttons.cancel'))
      .on('click', () => {
        return this.__setObject(null)
      })
    this.template
      .addButton('remove', locale.t('buttons.remove'))
      .on('click', () => {
        return this.__setObject(null)
      })
    this.template.content.on('click', '.uploadcare--widget__file-name', () => {
      return this.openDialog()
    })
    // Enable drag and drop
    receiveDrop(this.template.content, this.__handleDirectSelection.bind(this))
    return this.template.reset()
  }

  __infoToValue(info) {
    if (info.cdnUrlModifiers || this.settings.pathValue) {
      return info.cdnUrl
    } else {
      return info.uuid
    }
  }

  __reset() {
    var object
    // low-level primitive. @__setObject(null) could be better.
    object = this.currentObject
    this.currentObject = null
    if (object != null) {
      if (typeof object.cancel === 'function') {
        object.cancel()
      }
    }
    return this.template.reset()
  }

  __setObject(newFile) {
    if (newFile === this.currentObject) {
      return
    }
    this.__reset()
    if (newFile) {
      this.currentObject = newFile
      this.__watchCurrentObject()
    } else {
      this.element.val('')
    }
    return this.__onChange.fire(this.currentObject)
  }

  __watchCurrentObject() {
    var object
    object = this.__currentFile()
    if (object) {
      this.template.listen(object)
      return object
        .done((info) => {
          if (object === this.__currentFile()) {
            return this.__onUploadingDone(info)
          }
        })
        .fail((errorType, fileInfo, error) => {
          if (object === this.__currentFile()) {
            return this.__onUploadingFailed(errorType, error)
          }
        })
    }
  }

  __onUploadingDone(info) {
    this.element.val(this.__infoToValue(info))
    this.template.setFileInfo(info)
    return this.template.loaded()
  }

  __onUploadingFailed(errorType, error) {
    this.template.reset()
    return this.template.error(errorType, error)
  }

  __setExternalValue(value) {
    return this.__setObject(valueToFile(value, this.settings))
  }

  value(value) {
    if (value !== undefined) {
      this.__hasValue = true
      this.__setExternalValue(value)
      return this
    } else {
      return this.currentObject
    }
  }

  reloadInfo() {
    return this.value(this.element.val())
  }

  openDialog(tab) {
    if (this.settings.systemDialog) {
      return fileSelectDialog(this.template.content, this.settings, (input) => {
        return this.__handleDirectSelection('object', input.files)
      })
    } else {
      return this.__openDialog(tab)
    }
  }

  __openDialog(tab) {
    var dialogApi
    dialogApi = openDialog(this.currentObject, tab, this.settings)
    this.__onDialogOpen.fire(dialogApi)
    return dialogApi.done(this.__setObject.bind(this))
  }

  api() {
    if (!this.__api) {
      this.__api = bindAll(this, [
        'openDialog',
        'reloadInfo',
        'value',
        'validators'
      ])
      this.__api.onChange = publicCallbacks(this.__onChange)
      this.__api.onUploadComplete = publicCallbacks(this.__onUploadComplete)
      this.__api.onDialogOpen = publicCallbacks(this.__onDialogOpen)
      this.__api.inputElement = this.element.get(0)
    }
    return this.__api
  }
}

export { BaseWidget }
