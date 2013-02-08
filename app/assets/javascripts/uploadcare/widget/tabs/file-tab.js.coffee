uploadcare.whenReady ->
  {
    namespace,
    utils,
    jQuery: $
  } = uploadcare

  {dragdrop} = uploadcare.widget

  namespace 'uploadcare.widget.tabs', (ns) ->
    class ns.FileTab extends ns.BaseFileTab

      setContent: (@content) ->
        @__setupFileButton()
        dragdrop.receiveDrop @onSelected.fire, @content.find('@uploadcare-drop-area')

      __setupFileButton: ->
        fileButton = @content.find('@uploadcare-dialog-browse-file')
        utils.fileInput fileButton, @settings.multiple, (e) =>
          @onSelected.fire uploadcare.fileFrom(@settings, 'event', e)
