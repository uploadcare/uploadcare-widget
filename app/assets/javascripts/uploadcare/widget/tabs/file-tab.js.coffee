uploadcare.whenReady ->
  {
    namespace,
    utils,
    jQuery: $
  } = uploadcare

  {dragdrop} = uploadcare.widget

  namespace 'uploadcare.widget.tabs', (ns) ->
    class ns.FileTab
      constructor: (@widget) ->

      setContent: (@content) ->
        @__setupFileButton()
        $(@widget).on 'uploadcare.widget.cancel', => @__setupFileButton()

        dropArea = @content.find('@uploadcare-drop-area')
        dropArea.on 'uploadcare.drop', => @widget.dialog.close()
        dragdrop.receiveDrop(@widget.upload, dropArea)

      __setupFileButton: ->
        fileButton = @content.find('@uploadcare-dialog-browse-file')
        utils.fileInput fileButton, (e) =>
          @widget.dialog.close()
          @widget.upload('event', e)
