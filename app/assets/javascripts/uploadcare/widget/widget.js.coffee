# = require ./upload-manager
# = require ./template
# = require ./dialog

# = require ./adapters/base-adapter
# = require ./adapters/file-adapter
# = require ./adapters/url-adapter
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

        @upload = new ns.UploadManager(this)
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
        @available = true
        @template.ready()
        $(this).trigger('uploadcare.widget.cancel')

      __cancel: =>
        @__reset()
        @setValue('')

      __setupWidget: ->
        @tabs = if @settings.tabs then @settings.tabs.split(' ') else []
        @buttons = ['file']
        allowed = ['file', 'url', 'instagram']

        adapters = (tab for tab in @tabs when tab in allowed)
        for btn in @buttons
          adapters.push(btn) if btn in allowed && btn not in adapters

        # Initialize adapters for buttons and tabs
        @dialog = ns.dialog.defaultDialog if @tabs.length > 0
        @adapters = {}
        for adapter in adapters
          if ns.adapters.registered.hasOwnProperty(adapter)
            @adapters[adapter] = new ns.adapters.registered[adapter](this)

        # Add the dialog button if dialog is used
        if @dialog
          @dialog.switchTo(@tabs[0])
          dialogButton = @template.addButton('dialog')
          dialogButton.on 'click', => @dialog.open()

      addUploader: (uploader) ->
        $(uploader)
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

    initialize
      name: 'widget'
      class: ns.Widget
      elements: '@uploadcare-uploader'
