uploadcare.whenReady ->
  {
    namespace,
    utils,
    jQuery: $
  } = uploadcare

  namespace 'uploadcare.widget.tabs', (ns) ->
    class ns.FileTab
      constructor: (@widget) ->

      setContent: (@content) ->
        @__setupFileButton()
        $(@widget).on 'uploadcare.widget.cancel', => @__setupFileButton()

        @content.find('@uploadcare-dialog-drop-file')
          .receiveDrop(@widget.upload)
          .on 'uploadcare.drop', => @widget.dialog.close()

      __setupFileButton: ->
        fileButton = @content.find('@uploadcare-dialog-browse-file')
        utils.fileInput fileButton, (e) =>
          @widget.dialog.close()
          @widget.upload('event', e)
