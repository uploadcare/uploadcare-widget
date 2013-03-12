# = require ./files/base
# = require ./files/event
# = require ./files/input
# = require ./files/url
# = require ./files/uploaded

uploadcare.whenReady ->
  {
    namespace,
    utils,
    jQuery: $,
    files: f
  } = uploadcare

  namespace 'uploadcare', (ns) ->

    ns.fileFrom = (settings, type, data) ->
      return converters[type](settings, data)

    converters =
      event: (settings, e) ->
        if utils.abilities.canFileAPI
          files = if e.type == 'drop'
            e.originalEvent.dataTransfer.files
          else
            e.target.files
          new f.EventFile settings, files[0]
        else
          @input settings, e.target
      input: (settings, input) ->
        new f.InputFile settings, input
      url: (settings, url) ->
        # We also accept plain UUIDs here for an internally used shortcut.
        # Typically, you should use the `uploaded` converter for clarity.
        cdn = new RegExp("^#{settings.cdnBase}/#{utils.uuidRegex.source}", 'i')
        if utils.fullUuidRegex.test(url) || cdn.test(url)
          new f.UploadedFile settings, url
        else
          new f.UrlFile settings, url
      uploaded: (settings, uuid) ->
        new f.UploadedFile settings, uuid
