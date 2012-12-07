uploadcare.whenReady ->
  {namespace} = uploadcare
  {uploaders} = uploadcare.widget

  namespace 'uploadcare.widget.files', (ns) ->
    class ns.EventFile
      constructor: (@event) ->
      uploader: (settings) -> new uploaders.EventUploader(settings, @event)
