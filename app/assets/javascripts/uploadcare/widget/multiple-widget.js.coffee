{
  namespace,
  utils,
  jQuery: $,
  locale: {t}
} = uploadcare

namespace 'uploadcare.widget', (ns) ->
  class ns.MultipleWidget extends ns.BaseWidget

    constructor: (element) ->
      @currentGroup = null
      super

    __currentObject: ->
      @currentGroup

    __currentFile: ->
      @currentGroup?.promise()

    __setGroup: (group) =>
      unless utils.isFileGroupsEqual @currentGroup, group
        @__reset()
        if group and group.files().length
          @currentGroup = group
          @__watchCurrentObject()

    __setGroupByPromise: (groupPr) ->
      @__lastGroupPr = groupPr
      @__reset()
      @template.setStatus 'started'
      @template.statusText.text t('loadingInfo')
      groupPr
        .done (group) =>
          if @__lastGroupPr == groupPr
            @__reset()
            @__setGroup group
        .fail =>
          if @__lastGroupPr == groupPr
            @template.error 'createGroup'

    __clearCurrentObj: ->
      @currentGroup = null

    __onUploadingFailed: (error) ->
      if error is 'createGroup'
        @__reset()
      super

    value: (value) ->
      if value?
        @__setGroupByPromise utils.valueToGroup(value, @settings)
        this
      else
        @currentGroup

    __handleDirectSelection: (type, data) =>
      files = uploadcare.filesFrom(type, data, @settings)
      if @settings.previewStep
        uploadcare.openDialog(files, @settings).done(@__setGroup)
      else
        @__setGroup uploadcare.FileGroup(files, @settings)

    openDialog: (tab) ->
      uploadcare.openDialog(@currentGroup, tab, @settings)
        .done(@__setGroup)
        .fail (group) =>
          unless utils.isFileGroupsEqual group, @currentGroup
            @__setGroup null
