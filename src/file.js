import { CancelController, uploadFile } from '@uploadcare/upload-client'
import { callbacks } from './utils'
import { build } from './settings'

class WidgetFile {
  constructor(data, settings) {
    this.fail = this.fail.bind(this)
    this.done = this.done.bind(this)
    this.progress = this.progress.bind(this)
    this.callback = callbacks('memory')
    this.ctrl = new CancelController()
    this.progressState = 'pending'
    this.file = uploadFile(data, {
      ...build(settings || {}),
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

export default WidgetFile
