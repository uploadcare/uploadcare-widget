uploadcare.whenReady ->
  uploadcare.namespace 'uploadcare.widget', (ns) ->
    fileWith = (uploader) ->
      (args...) ->
        (settings) -> new uploader(settings, args...)

    ns.files =
      event: fileWith ns.uploaders.EventUploader
      url: fileWith ns.uploaders.UrlUploader
