# = require ../files
# = require ./dragdrop
# = require ./template
# = require ./dialog

uploadcare.whenReady ->
  {
    namespace,
    initialize,
    utils,
    files,
    jQuery: $
  } = uploadcare

  namespace 'uploadcare.widget', (ns) ->
    class ns.Widget
      constructor: (@element) ->
        @settings = utils.buildSettings @element.data()
        @uploader = new uploadcare.uploader.Uploader(@settings)

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

      getFileInfo: (id, callback) =>
        $.ajax "#{@settings.urlBase}/info/",
          data:
            file_id: id
            pub_key: @settings.publicKey
          dataType: 'jsonp'
        .done(callback)

      __changed: (e) =>
        if @ignoreChange
          @ignoreChange = false
          return
        id = @element.val()
        if id
          @getFileInfo id, (data) =>
            @__setLoaded true,
              fileId: data.file_id
              fileName: data.original_filename
              fileSize: data.size
        else
          @__reset()

      __setLoaded: (instant, uploadedFile) ->
        unless uploadedFile.fileName? && uploadedFile.fileSize?
          @setValue uploadedFile.fileId, false
          return
        @template.setFileInfo(uploadedFile.fileName, uploadedFile.fileSize)
        @setValue(uploadedFile.fileId)
        @template.loaded()

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

        @currentUpload = @uploader.upload(args...)

        @template.listen @currentUpload

        @currentUpload
          .fail =>
            @template.error()
            @available = true

          .done (uploadedFiles) =>
            # FIXME Report only the first one, for now; should be multiple
            uploadedFile = uploadedFiles[0]
            @__setLoaded(false, uploadedFile)

      __resetUpload: ->
        @currentUpload?.reject()
        @currentUpload = null

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
