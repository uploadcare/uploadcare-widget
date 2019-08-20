import uploadcare from './namespace.coffee'

{
  utils,
  settings: s,
  jQuery: $
} = uploadcare

uploadcare.namespace 'dragdrop', (ns) ->
  ns.support = utils.abilities.fileDragAndDrop

  ns.uploadDrop = (el, callback, settings) ->
    settings = s.build(settings)
    ns.receiveDrop el, (type, data) ->
      callback(
        if settings.multiple
          uploadcare.filesFrom(type, data, settings)
        else
          uploadcare.fileFrom(type, data[0], settings)
      )

  if not ns.support
    ns.receiveDrop = ->
  else
    ns.receiveDrop = (el, callback) ->
      ns.watchDragging(el)
      $(el).on(
        dragover: (e) ->
          e.preventDefault() # Prevent opening files.
          # This is way to change cursor.
          e.originalEvent.dataTransfer.dropEffect = 'copy'

        drop: (e) ->
          e.preventDefault() # Prevent opening files.

          dt = e.originalEvent.dataTransfer
          if not dt
            return

          if dt.files.length
            callback('object', dt.files)

          else
            uris = []
            for uri in dt.getData('text/uri-list').split()
              uri = $.trim(uri)
              if uri && uri[0] != '#'
                uris.push(uri)

            if uris
              callback('url', uris)
      )

    ns.watchDragging = (el, receiver) ->
      lastActive = false
      counter = 0

      changeState = (active) ->
        if lastActive != active
          $(el).toggleClass('uploadcare--dragging', lastActive = active)

      $(receiver || el).on(
        dragenter: ->
          counter += 1
          changeState(on)

        dragleave: ->
          counter -= 1
          if counter == 0
            changeState(off)

        'drop mouseenter': ->
          counter = 0
          changeState(off)
      )

    ns.watchDragging('body', document)
