import { CancelController, uploadFile } from '@uploadcare/upload-client'
import { callbacks } from './utils'

class WidgetFile {
  constructor(data, settings) {
    this.fail = this.fail.bind(this)
    this.done = this.done.bind(this)
    this.progress = this.progress.bind(this)

    this.callback = callbacks()
    this.ctrl = new CancelController()
    this.file = uploadFile(data, {
      ...settings,
      onProgress: info => this.callback.fire(info),
      cancel: this.ctrl
    })
  }

  fail(callback) {
    return this.file.catch(error => {
      if (!error.isCancel) {
        return callback(error)
      }
    })
  }

  done(callback) {
    return this.file.then(callback)
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

export default WidgetFile
