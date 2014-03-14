{
  namespace,
  utils,
  settings: s,
  jQuery: $
} = uploadcare

namespace 'uploadcare.dragdrop', (ns) ->
  ns.support = utils.abilities.fileDragAndDrop

  ns.uploadDrop = (el, callback, settings) ->
    settings = s.build settings
    ns.receiveDrop el, (type, data) ->
      callback(
        if settings.multiple
          uploadcare.filesFrom(type, data, settings)
        else
          uploadcare.fileFrom(type, data[0], settings)
      )

  unless ns.support
    ns.receiveDrop = ->
  else
    ns.receiveDrop = (el, callback) ->
      ns.watchDragging el
      $(el).on
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

    ns.watchDragging = (el, receiver) ->
      delayedEnter = false
      active = false

      changeState = (newActive) ->
        if active != newActive
          $(el).toggleClass('uploadcare-dragging', active = newActive)

      $(receiver || el).on
        dragenter: ->
          delayedEnter = setTimeout(->
            delayedEnter = false
            changeState on
          , 0)

        dragleave: ->
          if not delayedEnter
            changeState off

        'drop mouseenter': ->
          if delayedEnter
            clearTimeout delayedEnter
          setTimeout(->
            changeState off
          , 0)

    ns.watchDragging 'body', document
