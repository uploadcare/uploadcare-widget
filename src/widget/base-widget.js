import locale from '../locale'
import { defer, bindAll, publicCallbacks, fileSelectDialog, callbacks } from '../utils'
import { receiveDrop } from './dragdrop'
import { Template } from './template'
import { openDialog } from './dialog'
import WidgetFile from '../file'

class BaseWidget {
  constructor(element, settings) {
    this.element = element
    this.settings = settings
    this.validators = this.settings.validators = []
    this.currentObject = null
    this.__onDialogOpen = callbacks()
    this.__onUploadComplete = callbacks()
    this.__onChange = callbacks().add(object => {
      return object != null
        ? object.done(info => {
          return this.__onUploadComplete.fire(info)
        })
        : undefined
    })
    this.__setupWidget()
    // this.element.on('change.uploadcare', this.reloadInfo.bind(this))
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
    this.template = new Template(this.settings, this.element)
    const path = ['buttons.choose']
    path.push(this.settings.imagesOnly ? 'images' : 'files')
    path.push(this.settings.multiple ? 'other' : 'one')

    const openButton = this.template.addButton('open', locale.t(path.join('.')))
    openButton.classList.toggle('needsclick', this.settings.systemDialog)
    openButton.addEventListener('click', () => {
      return this.openDialog()
    })

    const cancelButton = this.template.addButton('cancel', locale.t('buttons.cancel'))
    cancelButton.addEventListener('click', () => {
      return this.__setObject(null)
    })

    const removeButton = this.template.addButton('remove', locale.t('buttons.remove'))
    removeButton.addEventListener('click', () => {
      return this.__setObject(null)
    })

    this.template.content.addEventListener('click', (e) => {
      if (e.target.classList.contains('uploadcare--widget__file-name')) {
        this.openDialog()
      }
    })

    // Enable drag and drop
    receiveDrop(this.template.content, (files) => this.__handleDirectSelection('object', files))
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
    // low-level primitive. @__setObject(null) could be better.
    var object = this.currentObject
    this.currentObject = null
    if (object != null) {
      if (typeof object.cancel === 'function') {
        object.cancel()
      }
    }
    return this.template.reset()
  }

  __setObject(newFile) {
    if (newFile && newFile.obj === this.currentObject) {
      return
    }
    this.__reset()
    if (newFile && newFile.obj) {
      this.currentObject = newFile.obj
      this.__watchCurrentObject()
    } else {
      this.element.value = ''
    }
    return this.__onChange.fire(this.currentObject)
  }

  __watchCurrentObject() {
    var object = this.__currentFile()
    if (object) {
      this.template.listen(object)
      object
        .done(info => {
          if (object === this.__currentFile()) {
            return this.__onUploadingDone(info)
          }
        })

      object.fail(error => {
        if (object === this.__currentFile()) {
          return this.__onUploadingFailed(error)
        }
      })
    }
  }

  __onUploadingDone(info) {
    this.element.value = this.__infoToValue(info)
    this.template.setFileInfo(info)
    return this.template.loaded()
  }

  __onUploadingFailed(error) {
    this.template.reset()
    return this.template.error(error)
  }

  __setExternalValue(value) {
    return this.__setObject(new WidgetFile(value, this.settings))
  }

  value(value) {
    if (value !== undefined && value) {
      this.__hasValue = true
      this.__setExternalValue(value)
      return this
    } else {
      return this.currentObject
    }
  }

  reloadInfo() {
    return this.value(this.element.value)
  }

  openDialog(tab) {
    if (this.settings.systemDialog) {
      return fileSelectDialog(this.template.content, this.settings, input => {
        return this.__handleDirectSelection('object', input.files)
      })
    } else {
      return this.__openDialog(tab)
    }
  }

  __openDialog(tab) {
    var dialogApi = openDialog(this.currentObject, tab, this.settings)
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
      this.__api.inputElement = this.element
    }
    return this.__api
  }
}

export { BaseWidget }
