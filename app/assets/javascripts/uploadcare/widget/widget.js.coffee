# = require ./uploaders/event-uploader
# = require ./uploaders/url-uploader

# = require ./files
# = require ./dragdrop
# = require ./template
# = require ./dialog

uploadcare.whenReady ->
  {
    namespace,
    initialize,
    utils,
    jQuery: $
  } = uploadcare

  namespace 'uploadcare.widget', (ns) ->
    class ns.Widget
      constructor: (@element) ->
        @settings = utils.buildSettings @element.data()

        @template = new ns.Template(@element)
        $(@template).on(
          'uploadcare.widget.template.cancel uploadcare.widget.template.remove',
          @__cancel
        )

        @element.on('change', @__changed)

        @__setupWidget()
        @template.ready()
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

      __setLoaded: (instant, data) ->
        unless data.fileName? && data.fileSize?
          @setValue data.fileId, false
          return
        @template.progress(1.0, instant)
        @template.setFileInfo(data.fileName, data.fileSize)
        @setValue(data.fileId)
        @template.loaded()

      __reset: =>
        @__resetUpload()
        @__setupFileButton()
        @available = true
        @template.ready()
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
        utils.fileInput(@fileButton, (e) => @upload('event', e))

      upload: (file, args...) =>
        # Allow two types of calls:
        #
        #     widget.upload(ns.files.foo(args...))
        #     widget.upload('foo', args...)
        if args.length > 0
          file = ns.files[file](args...)

        # Proceed with upload
        @__resetUpload()
        @uploader = file(@settings)
        $(@uploader)
          .on('uploadcare.api.uploader.start', =>
            @template.started()
            @available = false
          )
          .on('uploadcare.api.uploader.error', =>
            @template.error()
            @available = true
          )
          .on('uploadcare.api.uploader.load', (e) =>
            @__setLoaded(false, e.target)
          )
          .on('uploadcare.api.uploader.progress', (e) =>
            @template.progress(e.target.loaded / e.target.fileSize)
          )
        @uploader.upload()

      __resetUpload: ->
        if @uploader?
          @uploader.cancel()
          @uploader = null

      currentDialog = null

      dialog: -> currentDialog

      openDialog: ->
        @closeDialog()
        currentDialog = new ns.Dialog(@settings, @upload.bind(this))

        $(currentDialog).on 'uploadcare.dialog.close', ->
          currentDialog = null

        currentDialog.open()

      closeDialog: ->
        currentDialog?.close()

    initialize
      name: 'widget'
      class: ns.Widget
      elements: '@uploadcare-uploader'
