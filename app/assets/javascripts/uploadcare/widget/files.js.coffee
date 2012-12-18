uploadcare.whenReady ->
  {utils} = uploadcare
  uploadcare.namespace 'uploadcare.widget', (ns) ->

    ns.files =
      event: ns.uploaders.EventUploader
      url: ns.uploaders.UrlUploader

    # may be:
    # toUploader(settings, uploader)
    # toUploader(settings, type, args...)
    ns.toUploader = (settings, file, args...) ->
        return file if args.length == 0

        new ns.files[file](settings, args...)

