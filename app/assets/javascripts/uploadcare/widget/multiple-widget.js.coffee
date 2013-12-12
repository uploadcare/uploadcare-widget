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
      unless utils.isFileGroupsEqual @currentObject, group
        super

    __setGroupByPromise: (groupPr) ->
      @__lastGroupPr = groupPr
      @__reset()
      @template.setStatus 'started'
      @template.statusText.text t('loadingInfo')
      groupPr
        .done (group) =>
          if @__lastGroupPr == groupPr
            @__setObject group
        .fail =>
          if @__lastGroupPr == groupPr
            @template.error 'createGroup'

    __onUploadingFailed: (error) ->
      if error is 'createGroup'
        @__setObject(null)
      @template.error error

    value: (value) ->
      if value?
        @__hasValue = true
        @__setGroupByPromise utils.valueToGroup(value, @settings)
        this
      else
        @currentObject

    __handleDirectSelection: (type, data) =>
      files = uploadcare.filesFrom(type, data, @settings)
      if @settings.previewStep
        uploadcare.openDialog(files, @settings).done(@__setObject)
      else
        @__setObject uploadcare.FileGroup(files, @settings)
