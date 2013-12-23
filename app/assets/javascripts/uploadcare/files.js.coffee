# = require ./files/base
# = require ./files/object
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

  ns.fileFrom = ->
    ns.filesFrom.apply(null, arguments)[0]

  ns.filesFrom = (type, data, settings) ->
    settings = s.build(settings or {})
    for file in converters[type](settings, data)
      file.promise()

  converters =
    event: (settings, e) ->
      if utils.abilities.fileAPI
        files = if e.type == 'drop'
          e.originalEvent.dataTransfer.files
        else
          e.target.files
        for file in files
          new f.ObjectFile(settings, file)
      else
        @input settings, e.target

    input: (settings, input) ->
      [new f.InputFile(settings, input)]

    url: (settings, urls) ->
      unless $.isArray(urls)
        urls = [urls]
      for url in urls
        new f.UrlFile(settings, url)

    uploaded: (settings, uuids) ->
      unless $.isArray(uuids)
        uuids = [uuids]
      for uuid in uuids
        new f.UploadedFile(settings, uuid)

    ready: (settings, arrayOfFileData) ->
      unless $.isArray(arrayOfFileData)
        arrayOfFileData = [arrayOfFileData]
      for fileData in arrayOfFileData
        if fileData
          new f.ReadyFile(settings, fileData)
        else
          new f.DeletedFile(settings)
