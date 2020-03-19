import { CancelController, uploadFile, group } from '@uploadcare/upload-client'
import { callbacks } from './utils'
import { build } from './settings'
import locale from './locale'

class WidgetFile {
  constructor(data, settings) {
    this.settings = build(settings || {})
    this.fail = this.fail.bind(this)
    this.done = this.done.bind(this)
    this.progress = this.progress.bind(this)
    this.callback = callbacks('memory')
    this.ctrl = new CancelController()
    this.progressState = 'pending'
    this.file = uploadFile(data, {
      ...this.settings,
      onProgress: info => this.callback.fire(info, data),
      cancel: this.ctrl
    })
  }

  state() {
    return this.progressState
  }

  fail(callback) {
    this.progressState = 'error'

    return this.file.catch(error => {
      if (!error.isCancel) {
        return callback(error)
      }
    })
  }

  promise() {
    return this.file
  }

  done(callback) {
    this.progressState = 'ready'

    return this.file.then(callback)
  }

  progress(callback) {
    this.progressState = 'uploading'

    this.callback.add(callback)
  }

  then(callback) {
    return this.done(callback)
  }

  cancel() {
    this.progressState = 'cancelled'

    this.ctrl.cancel()
  }
}

const sum = arr => arr.reduce((sum, next) => next + sum, 0)

class WidgetGroup {
  constructor(files, settings) {
    this.settings = build(settings || {})
    this._files = files
    this.callback = callbacks('memory')
    this.ctrl = new CancelController()

    this.ctrl.onCancel(() => {
      this._files.forEach(file => {
        file.cancel()
      })
    })

    this.group = Promise.all(this._files.map(file => file.promise()))
      .then(uploads => uploads.map(uploaded => uploaded.uuid))
      .then(uuids =>
        group(uuids, {
          ...this.settings,
          onProgress: info => this.callback.fire(info),
          cancel: this.ctrl
        })
      )
      .then(groupInfo => {
        const files = Array.from(
          Object.assign(groupInfo.files, {
            length: Object.keys(groupInfo.files).length
          })
        )

        return {
          uuid: groupInfo.id,
          cdnUrl: groupInfo.id
            ? `${this.settings.cdnBase}/${groupInfo.id}/`
            : null,
          name: locale.t('file', 1),
          count: files.length,
          files,
          size: sum(files.map(file => file.size)),
          isImage: files.map(file => file.isImage).every(Boolean),
          isStored: files.map(file => file.isStored).every(Boolean)
        }
      })

    this.fail = this.fail.bind(this)
    this.done = this.done.bind(this)
    this.progress = this.progress.bind(this)
  }

  files() {
    return this._files
  }

  fail(callback) {
    return this.group.catch(error => {
      if (!error.isCancel) {
        return callback(error)
      }
    })
  }

  promise() {
    return this.group
  }

  done(callback) {
    return this.group.then(callback)
  }

  progress(callback) {
    this.callback.add(callback)
  }

  then(callback) {
    return this.done(callback)
  }

  cancel() {
    this.ctrl.cancel()
  }
}

export { WidgetGroup, WidgetFile }
