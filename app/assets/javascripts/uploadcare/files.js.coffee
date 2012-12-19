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
    ns.toFile = (fileable) ->
      if utils.abilities.canFileAPI() && fileable.target?
        fromEvent(fileable)
      else if fileable.target?
        new ns.InputFile(fileable.target)
      else if $.type(fileable) == 'string'
        fromUriList(fileable)
      else
        fileable # Must already be a file

    fromEvent = (event) ->
      files = if event.type == 'drop'
        event.originalEvent.dataTransfer.files
      else
        event.target.files
      fromArray(new ns.EventFile(file) for file in files)

    fromUriList = (uris) ->
      urls = uris.split('\n')
      fromArray(new ns.UrlFile(url) for url in urls)

    fromArray = (array) ->
      if array.length > 1
        new ns.CompositeFile(array)
      else
        array[0]
