{
  namespace,
  utils,
  files,
  jQuery: $
} = uploadcare

namespace 'uploadcare.widget', (ns) ->
  class ns.Widget extends ns.BaseWidget

    __currentFile: ->
      @currentObject

    __setObject: (newFile) =>
      unless newFile == @currentObject
        @__reset()
        if newFile
          @currentObject = newFile
          @__watchCurrentObject()

    __onUploadingFailed: ->
      @__reset()
      super

    value: (value) ->
      if value?
        @__setObject utils.valueToFile(value, @settings)
        this
      else
        @currentObject

    __handleDirectSelection: (type, data) =>
      file = uploadcare.fileFrom(type, data, @settings)
      if @settings.previewStep
        uploadcare.openDialog(file, @settings).done(@__setObject)
      else
        @__setObject file
