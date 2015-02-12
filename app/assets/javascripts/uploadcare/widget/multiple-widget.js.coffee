{
  namespace,
  utils,
  jQuery: $,
  locale: {t}
} = uploadcare

namespace 'uploadcare.widget', (ns) ->
  class ns.MultipleWidget extends ns.BaseWidget

    __currentFile: ->
      @currentObject?.promise()

    __setObject: (group) =>
      unless utils.isFileGroupsEqual(@currentObject, group)
        super

    __setExternalValue: (value) ->
      @__lastGroupPr = groupPr = utils.valueToGroup(value, @settings)
      @__reset()
      @template.setStatus('started')
      @template.statusText.text(t('loadingInfo'))
      groupPr
        .done (group) =>
          if @__lastGroupPr == groupPr
            @__setObject(group)
        .fail =>
          if @__lastGroupPr == groupPr
            @template.error('createGroup')

    __onUploadingFailed: (error) ->
      if error is 'createGroup'
        @__setObject(null)
      @template.error error

    __handleDirectSelection: (type, data) =>
      files = uploadcare.filesFrom(type, data, @settings)
      if @settings.systemDialog
        @__setObject(uploadcare.FileGroup(files, @settings))
      else
        uploadcare.openDialog(files, @settings).done(@__setObject)
