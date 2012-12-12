uploadcare.whenReady ->
  {
    namespace,
    utils,
    jQuery: $
  } = uploadcare

  {dialog, dragdrop, files} = uploadcare.widget

  namespace 'uploadcare.widget.tabs', (ns) ->
    class ns.FileTab
      constructor: (@widget) ->

      setContent: (@content) ->
        @__setupFileButton()
        $(@widget).on 'uploadcare.widget.cancel', => @__setupFileButton()

        dropArea = @content.find('@uploadcare-drop-area')
        dropArea.on 'uploadcare.drop', => dialog.close()
        dragdrop.receiveDrop(@widget.upload, dropArea)

      __setupFileButton: ->
        fileButton = @content.find('@uploadcare-dialog-browse-file')
        utils.fileInput fileButton, (e) =>
          dialog.close(files.event(e))
