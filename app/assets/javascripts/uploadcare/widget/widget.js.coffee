# = require ./uploaders/event-uploader
# = require ./uploaders/url-uploader

# = require ./files/event-file
# = require ./files/url-file

# = require ./dragdrop
# = require ./template
# = require ./dialog

# = require ./adapters/base-adapter
# = require ./adapters/file-adapter
# = require ./adapters/url-adapter
# = require ./adapters/remote-adapter
# = require ./adapters/facebook-adapter
# = require ./adapters/instagram-adapter

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
        registered = ns.adapters.registered
        tabs = if @settings.tabs then @settings.tabs.split(' ') else []
        @tabs = (tab for tab in tabs when registered.hasOwnProperty(tab))

        # Initialize tab adapters
        @dialog = ns.dialog.defaultDialog if @tabs.length > 0
        @adapters = {}
        for adapter in tabs # FIXME
          @adapters[adapter] = new registered[adapter](this)

        # Initialize the file browse button
        @fileButton = @template.addButton('file')
        @__setupFileButton()

        # Add the dialog button if dialog is used
        if @dialog
          @dialog.switchTo(@tabs[0])
          dialogButton = @template.addButton('dialog')
          dialogButton.on 'click', => @dialog.open()

        # Enable drag and drop
        @template.dropArea
          .receiveDrop(@upload)
          .watchDrag()
          .on 'uploadcare.drag', (e, active) =>
            unless active && @dialog.isVisible()
              @template.dropArea.toggleClass('uploadcare-dragging', active)

      __setupFileButton: ->
        utils.fileInput(@fileButton, (e) => @upload('event', e))

      fileTypes =
        event: ns.files.EventFile
        url: ns.files.UrlFile

      upload: (file, arg) =>
        # Allow two types of calls:
        #
        #     widget.upload(new ns.FooFile(arg))
        #     widget.upload('foo', arg)
        if arg?
          file = new fileTypes[file](arg)

        # Proceed with upload
        @__resetUpload()
        @uploader = file.uploader(@settings)
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

    initialize
      name: 'widget'
      class: ns.Widget
      elements: '@uploadcare-uploader'
