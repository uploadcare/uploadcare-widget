uploadcare.whenReady ->
  {
    namespace,
    utils,
    jQuery: $
  } = uploadcare

  namespace 'uploadcare.widget.adapters', (ns) ->
    class ns.FileAdapter extends ns.BaseAdapter
      @registerAs 'file'
      constructor: (@widget) ->
        super @widget

        @__setupFileButton()
        $(@widget).on 'uploadcare.widget.cancel', => @__setupFileButton()

        @tab.find('@uploadcare-dialog-drop-file')
          .receiveDrop(@widget.upload)
          .on 'uploadcare.drop', => @widget.dialog.close()

      __setupFileButton: ->
        fileButton = @tab.find('@uploadcare-dialog-browse-file')
        utils.fileInput fileButton, (e) =>
          @widget.dialog.close()
          @widget.upload('event', e)
