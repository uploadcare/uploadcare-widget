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
          dragState off
          $(this).trigger('uploadcare.drop')
          dt = e.originalEvent.dataTransfer
          if dt.files.length
            upload(e)
          else
            uris = dt.getData('text/uri-list')
            upload(uris) if uris
          false

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
        $('@uploadcare-drop-area').trigger('uploadcare.dragstatechange', active)
