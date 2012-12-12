# = require ./uploaders/event-uploader
# = require ./uploaders/url-uploader

# = require ./files
# = require ./dragdrop
# = require ./template
# = require ./dialog

# = require ./tabs/file-tab
# = require ./tabs/url-tab
# = require ./tabs/remote-tab

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

      __makeTab: (name) ->
        switch name
          when 'file' then new ns.tabs.FileTab(this)
          when 'url' then new ns.tabs.UrlTab(this)
          when 'facebook' then new ns.tabs.RemoteTab(this, 'facebook')
          when 'instagram' then new ns.tabs.RemoteTab(this, 'instagram')
          else false

      __setupWidget: ->
        tabs = if @settings.tabs then @settings.tabs.split(' ') else []
        @tabOrder = []
        @tabs = {}
        for tabName in tabs
          tab = @__makeTab(tabName)
          if tab
            @tabOrder.push(tabName)
            @tabs[tabName] = tab

        # Initialize the file browse button
        @fileButton = @template.addButton('file')
        @__setupFileButton()

        # Create the dialog and its button
        if @tabOrder.length > 0
          @dialog = ns.dialog.defaultDialog
          dialogButton = @template.addButton('dialog')
          dialogButton.on 'click', => @dialog.open()

          # Creat dialog tabs
          for name, tab of @tabs
            content = @dialog.addTab(name)
            tab.setContent(content)
          @dialog.switchTo(@tabOrder[0])


        # Enable drag and drop
        ns.dragdrop.receiveDrop(@upload, @template.dropArea)
        @template.dropArea.on 'uploadcare.dragstatechange', (e, active) =>
          unless active && @dialog.isVisible()
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

    initialize
      name: 'widget'
      class: ns.Widget
      elements: '@uploadcare-uploader'
