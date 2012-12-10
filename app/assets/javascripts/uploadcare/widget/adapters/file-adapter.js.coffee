uploadcare.whenReady ->
  {
    namespace,
    utils,
    jQuery: $
  } = uploadcare

  {dragdrop} = uploadcare.widget

  namespace 'uploadcare.widget.adapters', (ns) ->
    class ns.FileAdapter extends ns.BaseAdapter
      @registerAs 'file'
      constructor: (@widget) ->
        super @widget

        @__setupFileButton()
        $(@widget).on 'uploadcare.widget.cancel', => @__setupFileButton()

        dropArea = @tab.find('@uploadcare-dialog-drop-file')
        dragdrop.receiveDrop(@widget.upload, dropArea)
        dropArea.on 'uploadcare.drop', => @widget.dialog.close()

      __setupFileButton: ->
        fileButton = @tab.find('@uploadcare-dialog-browse-file')
        utils.fileInput fileButton, (e) =>
          @widget.dialog.close()
          @widget.upload('event', e)
