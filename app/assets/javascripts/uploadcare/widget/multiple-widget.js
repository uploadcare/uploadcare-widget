import uploadcare from '../namespace'

var boundMethodCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding') } }

const {
  utils,
  locale: { t }
} = uploadcare

uploadcare.namespace('widget', function (ns) {
  var ref
  ref = ns.MultipleWidget = class MultipleWidget extends ns.BaseWidget {
    constructor () {
      super(...arguments)
      this.__setObject = this.__setObject.bind(this)
      this.__handleDirectSelection = this.__handleDirectSelection.bind(this)
    }

    __currentFile () {
      var ref1
      return (ref1 = this.currentObject) != null ? ref1.promise() : undefined
    }

    __setObject (group) {
      boundMethodCheck(this, ref)
      if (!utils.isFileGroupsEqual(this.currentObject, group)) {
        return super.__setObject(group)
      // special case, when multiple widget is used with clearable
      // and user or some external code clears the value after
      // group loading error.
      } else if (!group) {
        this.__reset()
        return this.element.val('')
      }
    }

    __setExternalValue (value) {
      var groupPr
      this.__lastGroupPr = groupPr = utils.valueToGroup(value, this.settings)
      if (value) {
        this.template.setStatus('started')
        this.template.statusText.text(t('loadingInfo'))
      }
      return groupPr.done((group) => {
        if (this.__lastGroupPr === groupPr) {
          return this.__setObject(group)
        }
      }).fail(() => {
        if (this.__lastGroupPr === groupPr) {
          return this.__onUploadingFailed('createGroup')
        }
      })
    }

    __handleDirectSelection (type, data) {
      var files
      boundMethodCheck(this, ref)
      files = uploadcare.filesFrom(type, data, this.settings)
      if (this.settings.systemDialog) {
        return this.__setObject(uploadcare.FileGroup(files, this.settings))
      } else {
        return this.__openDialog('preview').addFiles(files)
      }
    }
  }

  ns.MultipleWidget._name = 'MultipleWidget'
})
