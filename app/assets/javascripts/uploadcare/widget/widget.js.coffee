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
        @settings = $.extend({}, uploadcare.defaults, @element.data())
        @settings.urlBase = utils.normalizeUrl(@settings.urlBase)
        @settings.socialBase = utils.normalizeUrl(@settings.socialBase)

        @template = new ns.Template(@element)
        $(@template).on('uploadcare-cancel', @__cancel)

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
        $(this).trigger('uploadcare-widgetcancel')

      __cancel: =>
        @__reset()
        @setValue('')

      __setupWidget: ->
        # Initialize the file browse button
        @fileButton = @template.addButton('file')
        @__setupFileButton()

        # Create the dialog and its button
        @tabs = if @settings.tabs then @settings.tabs.split(' ') else []
        if @tabs.length > 0
          dialogButton = @template.addButton('dialog')
          dialogButton.on 'click', => @openDialog()

        # Enable drag and drop
        ns.dragdrop.receiveDrop(@upload, @template.dropArea)
        @template.dropArea.on 'uploadcare-dragstatechange', (e, active) =>
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
          .on('uploadcare-uploadstart', =>
            @template.started()
            @available = false
          )
          .on('uploadcare-uploaderror', =>
            @template.error()
            @available = true
          )
          .on('uploadcare-uploadload', (e) =>
            @__setLoaded(false, e.target)
          )
          .on('uploadcare-uploadprogress', (e) =>
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
        currentDialog = new ns.Dialog(this)
        currentDialog.open()

      closeDialog: ->
        currentDialog?.close()
        currentDialog = null

    initialize
      name: 'widget'
      class: ns.Widget
      elements: '@uploadcare-uploader'
