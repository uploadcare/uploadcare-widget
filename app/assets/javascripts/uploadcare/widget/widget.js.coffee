{
  namespace,
  utils,
  settings: s,
  files,
  jQuery: $
} = uploadcare

namespace 'uploadcare.widget', (ns) ->
  class ns.Widget extends ns.BaseWidget

    constructor: (element) ->
      @currentFile = null
      super

    __initOnUploadComplete: ->
      __onUploadComplete = $.Callbacks()
      @onUploadComplete = utils.publicCallbacks __onUploadComplete
      @__onChange.add (file) =>
        file?.done (info) =>
          __onUploadComplete.fire info

    __currentObject: ->
      @currentFile

    __currentFile: ->
      @currentFile

    __clearCurrentObj: ->
      @currentFile?.cancel()
      @currentFile = null

    __setFile: (newFile) =>
      unless newFile == @currentFile
        @__reset()
        if newFile
          @currentFile = newFile
          @__watchCurrentObject()

    __onUploadingFailed: ->
      @__reset()
      super

    value: (value) ->
      if value?
        if @element.val() != value
          @__setFile utils.anyToFile(value, @settings)
        this
      else
        @currentFile

    reloadInfo: =>
      @__setFile utils.anyToFile(@element.val(), @settings)
      this

    __handleDirectSelection: (type, data) =>
      file = uploadcare.fileFrom(type, data, @settings)
      if @settings.previewStep
        uploadcare.openDialog(file, @settings).done(@__setFile)
      else
        @__setFile file

    openDialog: (tab) ->
      uploadcare.openDialog(@currentFile, tab, @settings)
        .done(@__setFile)
        .fail (file) =>
          unless file == @currentFile
            @__setFile null
