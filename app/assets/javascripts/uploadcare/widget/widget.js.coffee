# = require ../files
# = require ./dragdrop
# = require ./template
# = require ./dialog

uploadcare.whenReady ->
  {
    namespace,
    initialize,
    utils,
    uploads,
    files,
    jQuery: $
  } = uploadcare

  {t} = uploadcare.locale

  namespace 'uploadcare.widget', (ns) ->
    class ns.Widget
      constructor: (element) ->
        @element = $(element)
        @settings = utils.buildSettings @element.data()
        @uploader = new uploads.Uploader(@settings)

        @currentId = null

        @template = new ns.Template(@settings, @element)

        cancel = => @setValue('')
        @template.addButton('cancel', t('buttons.cancel')).on('click', cancel)
        @template.addButton('remove', t('buttons.remove')).on('click', cancel)

        @element.on('change', @__changed)

        @__setupWidget()
        @template.reset()
        @available = true

        @reloadInfo()

      setValue: (value) ->
        @element.val(value).change()

      reloadInfo: ->
        id = utils.uuidRegex.exec @element.val()
        id = if id then id[0] else null

        if @currentId != id
          @currentId = id
          if id
            info = uploads.fileInfo(id, @settings)
            @__setLoaded(info)

        if !id
          @__reset()

      __changed: (e) =>
        @reloadInfo()

      __setLoaded: (infoPr) ->
        $.when(infoPr)
          .fail(@__fail)
          .done (info) =>
            if @settings.imagesOnly && !uploads.isImage(info)
              return @__fail('image')
            @template.setFileInfo(info)
            @template.loaded()
            @element.val(info.fileId)

      __fail: (type) =>
        @setValue('')
        @template.error(type)
        @available = true

      __reset: =>
        @__resetUpload()
        @__setupFileButton()
        @available = true
        @template.reset()

      __setupWidget: ->
        # Initialize the file browse button
        @fileButton = @template.addButton('file')
        @__setupFileButton()

        # Create the dialog and its button
        if @settings.tabs.length > 0
          dialogButton = @template.addButton('dialog')
          dialogButton.on 'click', => @openDialog()

        # Enable drag and drop
        ns.dragdrop.receiveDrop(@upload, @template.dropArea)
        @template.dropArea.on 'dragstatechange.uploadcare', (e, active) =>
          unless active && @dialog()?
            @template.dropArea.toggleClass('uploadcare-dragging', active)

      __setupFileButton: ->
        utils.fileInput @fileButton, false, (e) =>
          @upload('event', e)

      upload: (args...) =>
        # Allow two types of calls:
        #
        #     widget.upload(ns.files.foo(args...))
        #     widget.upload('foo', args...)
        @__resetUpload()

        @template.started()
        @available = false

        currentUpload = @uploader.upload(args...)
        @template.listen(currentUpload)

        currentUpload
          .fail (error) =>
            @__fail() if error
          .done (infos) =>
            info = infos[0] # FIXME
            @__setLoaded(info)
            info.done => @element.change()

      __resetUpload: ->
        @uploader.reset()

      currentDialog = null

      dialog: -> currentDialog

      openDialog: ->
        @closeDialog()
        currentDialog = ns.showDialog(@settings)
          .done(@upload)
          .always( -> currentDialog = null)


      closeDialog: ->
        currentDialog?.close()

    initialize
      name: 'widget'
      class: ns.Widget
      elements: '@uploadcare-uploader'
