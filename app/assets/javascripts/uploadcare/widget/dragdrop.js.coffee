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
      method = if settings.multiple then 'filesFrom' else 'fileFrom'
      callback uploadcare[method](type, data, settings)

  unless ns.support
    ns.receiveDrop = ->
  else
    ns.receiveDrop = (el, callback) ->
      $(el).on
        dragover: (e) ->
          e.preventDefault() # Prevent opening files.
          # This is way to change cursor.
          e.originalEvent.dataTransfer.dropEffect = 'copy'

        drop: (e) ->
          e.preventDefault() # Prevent opening files.

          dt = e.originalEvent.dataTransfer
          if dt.files.length
            callback('event', e)
          else
            uris = dt.getData('text/uri-list')
            if uris
              # opera likes to add \n at the end
              uris = uris.replace /\n$/, ''
              callback('url', uris)

    active = false
    changeState = (newActive) ->
      if active != newActive
        active = newActive
        $('body').toggleClass('uploadcare-dragging', active)
                 .trigger('dragstatechange.uploadcare', active)

    $ ->
      delayedEnter = false
      $(document).on
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
