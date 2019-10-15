import { BaseWidget } from './base-widget'
import { t } from '../locale'
import { filesFrom } from '../files'
import { FileGroup } from '../files/group-creator'
import { isFileGroupsEqual, valueToGroup } from '../utils/groups'

class MultipleWidget extends BaseWidget {
  __currentFile() {
    var ref1
    return (ref1 = this.currentObject) != null ? ref1.promise() : undefined
  }

  __setObject(group) {
    if (!isFileGroupsEqual(this.currentObject, group)) {
      return super.__setObject(group)
      // special case, when multiple widget is used with clearable
      // and user or some external code clears the value after
      // group loading error.
    } else if (!group) {
      this.__reset()
      return this.element.val('')
    }
  }

  __setExternalValue(value) {
    var groupPr
    this.__lastGroupPr = groupPr = valueToGroup(value, this.settings)
    if (value) {
      this.template.setStatus('started')
      this.template.statusText.text(t('loadingInfo'))
    }
    return groupPr
      .done(group => {
        if (this.__lastGroupPr === groupPr) {
          return this.__setObject(group)
        }
      })
      .fail(() => {
        if (this.__lastGroupPr === groupPr) {
          return this.__onUploadingFailed('createGroup')
        }
      })
  }

  __handleDirectSelection(type, data) {
    var files = filesFrom(type, data, this.settings)
    if (this.settings.systemDialog) {
      return this.__setObject(FileGroup(files, this.settings))
    } else {
      return this.__openDialog('preview').addFiles(files)
    }
  }
}

MultipleWidget._name = 'MultipleWidget'

export { MultipleWidget }
