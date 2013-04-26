# = require ./files/base
# = require ./files/event
# = require ./files/input
# = require ./files/url
# = require ./files/uploaded
# = require ./files/group

{
  namespace,
  utils,
  jQuery: $,
  files: f,
  settings: s
} = uploadcare

namespace 'uploadcare', (ns) ->

  ns.rawFileFrom = (type, data, settings = {}) ->
    settings = s.build settings
    converters[type](settings, data)[0]

  ns.fileFrom = ->
    ns.rawFileFrom.apply(null, arguments).promise()

  ns.filesFrom = (type, data, settings = {}) ->
    settings = s.build settings
    file.promise() for file in converters[type](settings, data)

  converters =
    event: (settings, e) ->
      if utils.abilities.canFileAPI
        files = if e.type == 'drop'
          e.originalEvent.dataTransfer.files
        else
          e.target.files
        new f.EventFile(settings, file) for file in files
      else
        @input settings, e.target
    input: (settings, input) ->
      [new f.InputFile(settings, input)]
    url: (settings, urls) ->
      # We also accept plain UUIDs here for an internally used shortcut.
      # Typically, you should use the `uploaded` converter for clarity.
      unless $.isArray(urls)
        urls = [urls]
      for url in urls
        cdnBase = utils.escapeRegExp(settings.cdnBase)
          .replace(/^https?/i, 'https?')
        cdn = new RegExp("^#{cdnBase}/#{utils.uuidRegex.source}", 'i')
        if utils.fullUuidRegex.test(url) || cdn.test(url)
          new f.UploadedFile settings, url
        else
          new f.UrlFile settings, url
    uploaded: (settings, uuids) ->
      unless $.isArray(uuids)
        uuids = [uuids]
      new f.UploadedFile(settings, uuid) for uuid in uuids
    ready: (settings, arrayOfFileData) ->
      unless $.isArray(arrayOfFileData)
        arrayOfFileData = [arrayOfFileData]
      for fileData in arrayOfFileData
        if fileData
          new f.ReadyFile(settings, fileData)
        else
          new f.DeletedFile()
