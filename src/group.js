import { CancelController, uploadFileGroup } from '@uploadcare/upload-client'
import { callbacks } from './utils'
import { build } from './settings'

class WidgetGroup {
  constructor(files, settings) {
    this.fail = this.fail.bind(this)
    this.done = this.done.bind(this)
    this.progress = this.progress.bind(this)
    this.callback = callbacks('memory')
    this.ctrl = new CancelController()
    this.group = uploadFileGroup(files, {
      ...build(settings || {}),
      onProgress: info => this.callback.fire(info),
      cancel: this.ctrl
    })
  }

  fail(callback) {
    return this.group.catch(error => {
      if (!error.isCancel) {
        return callback(error)
      }
    })
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

export default WidgetGroup
