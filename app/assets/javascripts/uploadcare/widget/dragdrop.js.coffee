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
      $(el)
        .on 'dragover', (e) ->
          e.stopPropagation() # Prevent redirect
          e.preventDefault()
          e.originalEvent.dataTransfer.dropEffect = 'copy'
          false
        .on 'drop', (e) ->
          e.stopPropagation() # Prevent redirect
          e.preventDefault()
          delayedDragState off, 0
          dt = e.originalEvent.dataTransfer
          if dt.files.length
            callback('event', e)
          else
            uris = dt.getData('text/uri-list')
            if uris
              # opera likes to add \n at the end
              uris = uris.replace /\n$/, ''
              callback('url', uris)
          false

    onDelay = 0
    offDelay = 1

    active = false
    $ ->
      # Trigger an event on watched elements when dragging
      $(window).on 'mouseenter dragend', => delayedDragState off, offDelay
      $('body').on 'dragenter', (e) => delayedDragState on, onDelay
      $('body').on 'dragleave', (e) =>
        return unless e.target == e.currentTarget
        delayedDragState off, offDelay

    # Delayed set state fixes:
    #   1) Drop area blinking in Opera
    #   2) Disappearance of drop area before drop event
    delayedDragState = (newActive, delay) ->
      if delayedDragState.timeout?
        clearTimeout delayedDragState.timeout
        delayedDragState.timeout = null
      if delay > 0
        delayedDragState.timeout = setTimeout (-> __dragState newActive), delay
      else
        __dragState newActive

    __dragState = (newActive) ->
      if active != newActive
        active = newActive
        $('@uploadcare-drop-area').trigger('dragstatechange.uploadcare', active)
        $('body').toggleClass('uploadcare-draging', active)
