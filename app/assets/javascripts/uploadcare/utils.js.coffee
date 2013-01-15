# = require uploadcare/utils/abilities
# = require uploadcare/utils/pubsub

uploadcare.whenReady ->
  {
    namespace,
    jQuery: $
  } = uploadcare

  namespace 'uploadcare.utils', (ns) ->
    ns.defer = (fn) ->
      setTimeout fn, 0

    ns.uuid = ->
      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace /[xy]/g, (c) ->
        r = Math.random() * 16 | 0
        v = if c == 'x' then r else r & 3 | 8
        v.toString(16)

    ns.uuidRegex = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i

    ns.normalizeUrl = (url) ->
      url = "https://#{url}" unless url.match /^([a-z][a-z0-9+\-\.]*:)?\/\//i
      url.replace(/\/+$/, '')

    ns.buildSettings = (settings) ->
      settings = $.extend({}, uploadcare.defaults, settings or {})

      if $.type(settings.tabs) == "string"
        settings.tabs = settings.tabs.split(' ')

      settings.tabs = settings.tabs or []

      for key in ['urlBase', 'socialBase']
        settings[key] = ns.normalizeUrl(settings[key])

      for key in ['multiple', 'imagesOnly']
        if settings[key] != false
          settings[key] = settings[key]?

      if settings.multiple
        console.log 'Sorry, the multiupload is not working now'
        settings.multiple = false

      settings

    ns.fitText = (text, max) ->
      if text.length > max
        head = Math.ceil((max - 3) / 2)
        tail = Math.floor((max - 3) / 2)
        text.slice(0, head) + '...' + text.slice(-tail)
      else
        text

    ns.fileInput = (container, multiple, fn) ->
      container.find('input:file').remove()
      input = if multiple
        $('<input type="file" multiple>')
      else
        $('<input type="file">')

      input
        .on('change', fn)
        .css(
          opacity: 0
          position: 'absolute'
          top: 0
          left: 0
          width: '100%'
          height: '100%'
          cursor: 'default'
          display: 'block'
          fontSize: '2em'
        )
      container
        .css(
          position: 'relative'
          overflow: 'hidden'
        )
        .append(input)
