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
        @__initDragNDrop()

      __initDragNDrop: ->
        dropArea = @content.find('@uploadcare-drop-area')
        if utils.abilities.fileDragAndDrop
          dragdrop.receiveDrop @onSelected.fire, dropArea
          className = 'draganddrop'
        else
          className = 'no-draganddrop'
        @content.addClass "uploadcare-#{className}"

      __setupFileButton: ->
        fileButton = @content.find('@uploadcare-dialog-browse-file')
        utils.fileInput fileButton, @settings.multiple, (e) =>
          @onSelected.fire 'event', e
