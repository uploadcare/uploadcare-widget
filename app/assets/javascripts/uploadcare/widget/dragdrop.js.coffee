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
          dragState off
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
    ns.watchDrag = noFileAPI or (el) -> dragArea = dragArea.add(el)

    # Trigger an event on watched elements when dragging
    active = false
    $(window).on 'mouseenter dragend', => dragState off
    $('body').on 'dragenter', (e) => dragState on
    $('body').on 'dragleave', (e) =>
      return unless e.target == e.currentTarget
      dragState off

    dragState = (newActive) ->
      if active != newActive
        active = newActive
        $(dragArea).trigger('uploadcare.drag', active)
