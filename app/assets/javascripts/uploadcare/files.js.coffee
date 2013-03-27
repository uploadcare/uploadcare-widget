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
  files: f
} = uploadcare

namespace 'uploadcare', (ns) ->

  # backwards compatibility
  ns.fileFrom = (type, data, settings) ->
    converters[type](settings, data)[0].promise()

  ns.filesFrom = (type, data, settings = {}) ->
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
      unless $.isArray(urls)
        urls = [urls]
      for url in urls
        # We also accept plain UUIDs here for an internally used shortcut.
        # Typically, you should use the `uploaded` converter for clarity.
        cdn = new RegExp("^#{settings.cdnBase}/#{utils.uuidRegex.source}", 'i')
        if utils.fullUuidRegex.test(url) || cdn.test(url)
          new f.UploadedFile settings, url
        else
          new f.UrlFile settings, url
    uploaded: (settings, uuids) ->
      unless $.isArray(uuids)
        uuids = [uuids]
      new f.UploadedFile(settings, uuid) for uuid in uuids
