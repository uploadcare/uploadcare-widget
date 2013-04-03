{
  namespace,
  utils,
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

    __reset: =>
      @currentFile?.cancel()
      @currentFile = null
      @template.reset()
      @__setValue ''

    __setFile: (newFile) =>
      unless newFile == @currentFile
        @__reset()
        if newFile
          @currentFile = newFile
          @__watchCurrentObject()

    value: (value) ->
      if value?
        if @element.val() != value
          @__setFile @__anyToFile(value)
        this
      else
        @currentFile

    reloadInfo: =>
      @__setFile @__anyToFile @element.val()
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
