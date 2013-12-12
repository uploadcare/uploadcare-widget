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

    value: (value) ->
      if value?
        @__hasValue = true
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
