# = require ./files/base
# = require ./files/event

# ≠ require ./files/input
# ≠ require ./files/url

uploadcare.whenReady ->
  {namespace, jQuery: $, utils, files: f} = uploadcare

  namespace 'uploadcare', (ns) ->

    ns.fileFrom = (settings, type, data...) ->
      return converters[type](settings, data...)

    converters =
      event: (settings, e) ->
        if utils.abilities.canFileAPI()
          files = if e.type == 'drop'
            e.originalEvent.dataTransfer.files
          else
            e.target.files
          new f.EventFile settings, files[0]
        else
          new f.InputFile settings, e.target
      input: (settings, input) ->
        new f.InputFile settings, input
      url: (settings, url) ->
        new f.UrlFile settings, url
      uploaded: (settings, uid) ->
        # TODO


###
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
          new ns.InputFile(e.target)

      url: (uris) ->
        urls = uris.split('\n')
        new ns.UrlFile(url) for url in urls
###
