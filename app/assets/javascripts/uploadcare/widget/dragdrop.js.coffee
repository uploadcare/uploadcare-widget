uploadcare.whenReady ->
  {
    namespace,
    utils,
    jQuery: $
  } = uploadcare

  {t} = uploadcare.locale

  namespace 'uploadcare.widget', (ns) ->
    class ns.DragDrop
      constructor: (@upload) ->
        @active = false
        $(window).on 'mouseenter dragend', => @switch off
        $('body').on 'dragenter', (e) => @switch on
        $('body').on 'dragleave', (e) =>
          return unless e.target == e.currentTarget
          @switch off

      uploadDrop: (el, callback) ->
        return unless utils.abilities.canFileAPI()
        $(el)
          .on('dragover', (e) =>
            e.stopPropagation() # Prevent redirect
            e.preventDefault()
            e.originalEvent.dataTransfer.dropEffect = 'copy'
          .on 'drop', (e) =>
            callback(e)
            dt = e.originalEvent.dataTransfer
            if dt.files.length
              @upload.fromFileEvent(e)
            else
              uris = dt.getData('text/uri-list')
              if uris
                @upload.fromUrl(uris.split('\n')[0])

      switch: (active) ->
        if @active != active
          @active = active
          if @active
            $(this).trigger('uploadcare.dragdrop.active')
          else
            $(this).trigger('uploadcare.dragdrop.inactive')
