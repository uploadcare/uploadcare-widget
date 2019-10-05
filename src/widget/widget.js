import { BaseWidget } from './base-widget'
import { fileFrom } from '../files'
import { boundMethodCheck } from '../utils/bound-method-check'

class Widget extends BaseWidget {
  constructor () {
    super(...arguments)
    this.__handleDirectSelection = this.__handleDirectSelection.bind(this)
  }

  __currentFile () {
    return this.currentObject
  }

  __handleDirectSelection (type, data) {
    var file
    boundMethodCheck(this, Widget)
    file = fileFrom(type, data[0], this.settings)
    if (this.settings.systemDialog || !this.settings.previewStep) {
      return this.__setObject(file)
    } else {
      return this.__openDialog('preview').addFiles([file])
    }
  }
}

Widget._name = 'SingleWidget'

export { Widget }
