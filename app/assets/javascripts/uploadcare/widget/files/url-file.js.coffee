uploadcare.whenReady ->
  {namespace} = uploadcare
  {uploaders} = uploadcare.widget

  namespace 'uploadcare.widget.files', (ns) ->
    class ns.UrlFile
      constructor: (@url) ->
      uploader: (settings) -> new uploaders.UrlUploader(settings, @url)
