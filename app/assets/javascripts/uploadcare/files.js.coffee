# = require ./files/event
# = require ./files/url

uploadcare.whenReady ->
  {utils} = uploadcare
  uploadcare.namespace 'uploadcare.files', (ns) ->

    ns.files =
      event: ns.EventFile
      url: ns.UrlFile

    # may be:
    # toFile(settings, uploader)
    # toFile(settings, type, args...)
    ns.toFile = (file, args...) ->
      return file if args.length == 0

      new ns.files[file](args...)

