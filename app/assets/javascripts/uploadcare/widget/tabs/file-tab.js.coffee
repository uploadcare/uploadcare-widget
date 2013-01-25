uploadcare.whenReady ->
  {
    namespace,
    utils,
    jQuery: $
  } = uploadcare

  {dragdrop} = uploadcare.widget

  namespace 'uploadcare.widget.tabs', (ns) ->
    class ns.FileTab
      constructor: (@dialog, @settings, @callback) ->

      setContent: (@content) ->
        @__setupFileButton()
        dragdrop.receiveDrop @callback, @content.find('@uploadcare-drop-area')

      __setupFileButton: ->
        fileButton = @content.find('@uploadcare-dialog-browse-file')
        utils.fileInput fileButton, @settings.multiple, (e) =>
          @callback('event', e)
