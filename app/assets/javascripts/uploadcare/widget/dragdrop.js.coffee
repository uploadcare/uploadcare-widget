uploadcare.whenReady ->
  {
    namespace,
    utils,
    jQuery: $
  } = uploadcare

  {t} = uploadcare.locale

  namespace 'uploadcare.widget.dragdrop', (ns) ->
    canFileAPI = utils.abilities.canFileAPI()

    ns.uploadDrop = (upload, el) ->
      return unless canFileAPI
      $(el)
        .on 'dragover', (e) ->
          e.stopPropagation() # Prevent redirect
          e.preventDefault()
          e.originalEvent.dataTransfer.dropEffect = 'copy'
        .on 'drop', (e) ->
          $(el).trigger('uploadcare.drop')
          dt = e.originalEvent.dataTransfer
          if dt.files.length
            upload.fromFileEvent(e)
          else
            uris = dt.getData('text/uri-list')
            if uris
              upload.fromUrl(uris.split('\n')[0])

    dragArea = $()
    ns.uploadDrag = (el) -> dragArea.add(el)

    return unless canFileAPI

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
        if active
          dragArea.addClass('uploadcare-dragging')
        else
          dragArea.removeClass('uploadcare-dragging')
