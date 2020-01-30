import { BaseWidget } from './base-widget'
import WidgetFile from '../file'
// import { fileFrom } from '../files'

class Widget extends BaseWidget {
  __currentFile() {
    return this.currentObject
  }

  __handleDirectSelection(type, data) {
    const file = new WidgetFile(data[0], this.settings)
    if (this.settings.systemDialog || !this.settings.previewStep) {
      return this.__setObject(file)
    } else {
      return this.__openDialog('preview').addFiles([file])
    }
  }
}

Widget._name = 'SingleWidget'

export { Widget }
