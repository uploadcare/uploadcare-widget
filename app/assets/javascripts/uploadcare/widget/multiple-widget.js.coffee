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
        group?.asSingle().done (info) =>
          __onUploadComplete.fire info

    __currentObject: ->
      @currentGroup

    __currentFile: ->
      @currentGroup?.asSingle()

    __setGroup: (group) =>
      equal = group and @currentGroup and @currentGroup.equal(group)
      bothNull = not group and not @currentGroup
      unless equal or bothNull
        @__clearCurrentObj()
        @__reset()
        if group
          @currentGroup = group
          @__watchCurrentObject()

    __clearCurrentObj: ->
      @currentGroup = null

    # value() - get current group
    # value('') - reset
    # value("group_id" or "group_cdn_url" or groupObject) - set group
    # value(["file1_cdn_url", "file2_url", fileObject, ...]) - set files
    value: (value) ->
      if value?
        if @element.val() != value
          if value isnt ''
            @__setFile @__anyToFile(value)
            __setGroup(
              if $.isArray(value)
                files = @__anyToFile(item) for item in value
                @__filesToGrop files
              else
                if value.asSingle
                  value
                else
                  uploadcare.fileGroupFrom('uploaded', value, @settings)
            )
          else
            @__clearCurrentObj()
            @__reset()
        this
      else
        @currentGroup

    reloadInfo: =>
      @value @element.val()
      this

    __handleDirectSelection: (type, data) =>
      files = uploadcare.filesFrom(type, data, @settings)
      if @settings.previewStep
        uploadcare.openDialog(files, @settings).done(@__setGroup)
      else
        @__setGroup uploadcare.fileGroupFrom('files', files, @settings)

    openDialog: (tab) ->
      uploadcare.openDialog(@currentGroup, tab, @settings)
        .done(@__setGroup)
        .fail (group) =>
          unless group?.equal(@currentGroup)
            @__setGroup null
    

    
