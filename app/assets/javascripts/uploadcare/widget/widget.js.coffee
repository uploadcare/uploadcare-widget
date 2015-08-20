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

    __handleDirectSelection: (type, data) =>
      file = uploadcare.fileFrom(type, data[0], @settings)
      if @settings.systemDialog or not @settings.previewStep
        @__setObject(file)
      else
        @__openDialog(file)
