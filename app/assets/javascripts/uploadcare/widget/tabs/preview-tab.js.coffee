uploadcare.whenReady ->
  {
    namespace,
    utils,
    jQuery: $
  } = uploadcare

  {dragdrop} = uploadcare.widget

  namespace 'uploadcare.widget.tabs', (ns) ->
    class ns.PreviewTab

      PREFIX = '@uploadcare-dialog-preview-'

      constructor: (@dialog, @settings) ->
        @onDone = $.Callbacks()
        @onBack = $.Callbacks()

      setContent: (@content) ->
        @content.find(PREFIX + 'back').click @onBack.fire
        @content.find(PREFIX + 'done').click @onDone.fire

      setFile: (file) ->
        infoEl = @content.find(PREFIX + 'info')
        infoEl.text JSON.stringify {
          fileId: file.fileId,
          fileName: file.fileName,
          fileSize: file.fileSize,
          isStored: file.isStored,
          cdnUrl: file.cdnUrl,
          cdnUrlModifiers: file.cdnUrlModifiers,
          previewUrl: file.previewUrl,
          isImage: file.isImage
        }
        
