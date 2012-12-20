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

  namespace 'uploadcare.widget', (ns) ->
    class ns.Widget
      constructor: (@element) ->
        @settings = utils.buildSettings @element.data()
        @uploader = new uploads.Uploader(@settings)

        @template = new ns.Template(@element)
        $(@template).on(
          'uploadcare.widget.template.cancel uploadcare.widget.template.remove',
          @__cancel
        )

        @element.on('change', @__changed)

        @__setupWidget()
        @template.reset()
        @available = true

      setValue: (value, ignore = true) ->
        @ignoreChange = ignore
        @element.val(value).trigger('change')

      __changed: (e) =>
        if @ignoreChange
          @ignoreChange = false
          return
        ids = @element.val()
        if ids
          fis = (new uploads.FileInfo(id) for id in ids.split(','))
          @__setLoaded(fis)
        else
          @__reset()

      __setLoaded: (uploadedFiles...) ->
        infos = (file.info(@settings) for file in uploadedFiles)
        $.when(infos...)
          .fail(@__fail)
          .done (infos...) =>
            @template.setFileInfo(infos[0].fileName, infos[0].fileSize) # FIXME
            @setValue((info.fileId for info in infos).join(','))
            @template.loaded()

      __fail: =>
        @template.error()
        @available = true

      __reset: =>
        @__resetUpload()
        @__setupFileButton()
        @available = true
        @template.reset()
        $(this).trigger('uploadcare.widget.cancel')

      __cancel: =>
        @__reset()
        @setValue('')

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
        @template.dropArea.on 'uploadcare.dragstatechange', (e, active) =>
          unless active && @dialog()?
            @template.dropArea.toggleClass('uploadcare-dragging', active)

      __setupFileButton: ->
        utils.fileInput @fileButton, @settings.multiple, (e) =>
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
          .fail(@__fail)
          .done (uploadedFiles) => @__setLoaded(uploadedFiles...)

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
