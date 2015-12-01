{
  utils,
  jQuery: $,
  locale: {t}
} = uploadcare

uploadcare.namespace 'widget', (ns) ->
  class ns.MultipleWidget extends ns.BaseWidget

    __currentFile: ->
      @currentObject?.promise()

    __setObject: (group) =>
      if not utils.isFileGroupsEqual(@currentObject, group)
        super

      # special case, when multiple widget is used with clearable
      # and user or some external code clears the value after
      # group loading error.
      else if not group
        @__reset()
        @element.val('')

    __setExternalValue: (value) ->
      @__lastGroupPr = groupPr = utils.valueToGroup(value, @settings)
      if value
        @template.setStatus('started')
        @template.statusText.text(t('loadingInfo'))
      groupPr
        .done (group) =>
          if @__lastGroupPr == groupPr
            @__setObject(group)
        .fail =>
          if @__lastGroupPr == groupPr
            @__onUploadingFailed('createGroup')

    __handleDirectSelection: (type, data) =>
      files = uploadcare.filesFrom(type, data, @settings)
      if @settings.systemDialog
        @__setObject(uploadcare.FileGroup(files, @settings))
      else
        @__openDialog(files)
