# = require ../files
# = require ./dragdrop
# = require ./template
# = require ./dialog-frame
# = require ./dialog-contents/choose.js.coffee
# = require ./dialog-contents/preview.js.coffee

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
      constructor: (element) ->
        @element = $(element)
        @settings = utils.buildSettings @element.data()
        @uploader = new uploads.Uploader(@settings)

        @currentId = null

        @template = new ns.Template(@settings, @element)
        $(@template).on(
          'uploadcare.widget.template.cancel uploadcare.widget.template.remove',
          @__cancel
        )

        $(@template).on('uploadcare.widget.template.show-file', @openDialogOnStep2)

        @element.on('change', @__changed)

        @__setupWidget()
        @template.reset()
        @available = true

        @reloadInfo()

      setValue: (value) ->
        @element.val(value)

        @reloadInfo()

      reloadInfo: ->
        id = utils.uuidRegex.exec @element.val()
        id = if id then id[0] else null

        if @currentId != id
          @currentId = id

          if id
            info = uploads.fileInfo(id, @settings)
            @__setLoaded(info)
          else
            @__reset()

      __changed: (e) =>
        @reloadInfo()

      __setLoaded: (infoPr) ->
        $.when(infoPr)
          .fail(@__fail)
          .done (info) =>
            @fileInfo = info
            if @settings.imagesOnly && !uploads.isImage(info)
              return @__fail('image')
            @template.setFileInfo(info)
            @setValue info.fileId
            @template.loaded()

      __fail: (type) =>
        @__cancel()
        @template.error(type)
        @available = true

      __reset: =>
        @__resetUpload()
        @__setupFileButton()
        @available = true
        @template.reset()
        $(this).trigger('uploadcare.widget.cancel')

      __cancel: =>
        @__reset()
        @setValue ''

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
          .fail(@__fail)
          .done (infos) => @__setLoaded(infos[0])

      __resetUpload: ->
        @uploader.reset()

      openDialog: ->
        step1 = @__getStep1Content()
        step2 = ns.showPreviewDialog(@settings, step1, @__getStep1Content)

      openDialogOnStep2: =>
        # alert('hello')
        # debugger
        step1 = $.Deferred().resolve(@fileInfo).promise()
        step2 = ns.showPreviewDialog(@settings, step1, @__getStep1Content)

      __getStep1Content: =>
        ns.showChooseDialog(@settings).done(@upload)

    initialize
      name: 'widget'
      class: ns.Widget
      elements: '@uploadcare-uploader'
