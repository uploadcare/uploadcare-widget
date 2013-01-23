uploadcare.whenReady ->
  {
    namespace,
    utils,
    jQuery: $
  } = uploadcare

  namespace 'uploadcare.widget.dragdrop', (ns) ->
    # Without File API all drag and drop functions fallback to noop
    noFileAPI = if utils.abilities.canFileAPI() then false else ->

    ns.receiveDrop = noFileAPI or (upload, el) ->
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
          $(this).trigger('uploadcare.drop')
          dt = e.originalEvent.dataTransfer
          if dt.files.length
            upload('event', e)
          else
            uris = dt.getData('text/uri-list')
            if uris
              # opera likes to add \n at the end
              uris = uris.replace /\n$/, ''
              upload('url', uris) 
          false

    onDelay = 0
    offDelay = if $.browser.opera then 200 else 1

    # Trigger an event on watched elements when dragging
    active = false
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
        $('@uploadcare-drop-area').trigger('uploadcare.dragstatechange', active)
