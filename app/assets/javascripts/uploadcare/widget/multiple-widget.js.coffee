{
  namespace,
  utils,
  jQuery: $
} = uploadcare

namespace 'uploadcare.widget', (ns) ->
  class ns.MultipleWidget extends ns.BaseWidget

    constructor: (element) ->
      @currentGroup = null
      super

    __initOnUploadComplete: ->
      __onUploadComplete = $.Callbacks()
      @onUploadComplete = utils.publicCallbacks __onUploadComplete
      @__onChange.add (group) =>
        group?.promise().done (info) =>
          __onUploadComplete.fire info

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

    __clearCurrentObj: ->
      @currentGroup = null

    __onUploadingFailed: (error) ->
      if error is 'createGroup'
        @__reset()
      super

    value: (value) ->
      if value?
        if @element.val() != value
          @__setGroup utils.anyToFileGroup(value, @settings)
        this
      else
        @currentGroup

    reloadInfo: =>
      @__setGroup utils.anyToFileGroup(@element.val(), @settings)
      this

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
    

    
