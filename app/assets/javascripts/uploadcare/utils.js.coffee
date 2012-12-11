# = require uploadcare/utils/abilities
# = require uploadcare/utils/pubsub

uploadcare.whenReady ->
  {
    namespace,
    jQuery: $
  } = uploadcare

  namespace 'uploadcare.utils', (ns) ->
    ns.uuid = ->
      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace /[xy]/g, (c) ->
        r = Math.random() * 16 | 0
        v = if c == 'x' then r else r & 3 | 8
        v.toString(16)

    ns.normalizeUrl = (url) ->
      url = "https://#{url}" unless url.match /^([a-z][a-z0-9+\-\.]*:)?\/\//i
      url.replace(/\/+$/, '')

    ns.fitText = (text, max = 16) ->
      if text.length > max
        head = Math.ceil((max - 3) / 2)
        tail = Math.floor((max - 3) / 2)
        text.slice(0, head) + '...' + text.slice(-tail)
      else
        text

    ns.fileInput = (container, fn) ->
      container.find('input:file').remove()
      input = $('<input type="file">')
        .on('change', fn)
        .css(
          opacity: 0
          position: 'absolute'
          top: 0
          left: 0
          width: '100%'
          height: '100%'
          cursor: 'pointer'
          display: 'block'
          fontSize: '2em'
        )
      container
        .css(
          position: 'relative'
          overflow: 'hidden'
        )
        .append(input)
