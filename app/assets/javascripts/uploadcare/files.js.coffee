# = require ./files/event
# = require ./files/input
# = require ./files/url

uploadcare.whenReady ->
  {
    namespace,
    utils,
    jQuery: $
  } = uploadcare

  namespace 'uploadcare.files', (ns) ->
    # Usage:
    #
    #     toFiles(file)
    #     toFiles(files)
    #     toFiles(type, args...)
    ns.toFiles = (file, args...) ->
      if args.length > 0
        file = converters[file](args...)
      if $.isArray(file) then file else [file]

    converters =
      event: (e) ->
        if utils.abilities.canFileAPI()
          files = if e.type == 'drop'
            e.originalEvent.dataTransfer.files
          else
            e.target.files
          new ns.EventFile(file) for file in files
        else
          new ns.InputFile(fileable.target)

      url: (uris) ->
        urls = uris.split('\n')
        new ns.UrlFile(url) for url in urls
