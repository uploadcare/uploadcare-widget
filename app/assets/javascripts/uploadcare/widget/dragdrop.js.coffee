uploadcare.whenReady ->
  {
    namespace,
    utils,
    jQuery: $
  } = uploadcare

  {t} = uploadcare.locale

  namespace 'uploadcare.widget.dragdrop', (ns) ->
    noFileAPI = if utils.abilities.canFileAPI() then false else ->

    ns.receiveDrop = noFileAPI or (upload, el) ->
      $(el)
        .on 'dragover', (e) ->
          e.stopPropagation() # Prevent redirect
          e.preventDefault()
          e.originalEvent.dataTransfer.dropEffect = 'copy'
          return
        .on 'drop', (e) ->
          e.stopPropagation() # Prevent redirect
          e.preventDefault()
          dragMarker off
          $(this).trigger('uploadcare.drop')
          dt = e.originalEvent.dataTransfer
          if dt.files.length
            upload('event', e)
          else
            uris = dt.getData('text/uri-list')
            if uris
              url = uris.split('\n')[0]
              upload('url', url)

    dragArea = $()
    ns.markOnDrag = noFileAPI or (el) -> dragArea = dragArea.add(el)

    # Mark body with our class when dragging
    active = false
    $(window).on 'mouseenter dragend', => dragMarker off
    $('body').on 'dragenter', (e) => dragMarker on
    $('body').on 'dragleave', (e) =>
      return unless e.target == e.currentTarget
      dragMarker off

    dragMarker = (newActive) ->
      if active != newActive
        active = newActive
        dragArea.toggleClass('uploadcare-dragging', active)
