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
        @__setFile utils.valueToFile(value, @settings)
        this
      else
        @currentFile

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
