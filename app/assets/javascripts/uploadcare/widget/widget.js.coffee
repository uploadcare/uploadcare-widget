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
          => @setValue('')
        )

        $(@template).on('uploadcare.widget.template.show-file', @openDialog)

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
        @fileInfo = null
        $.when(infoPr)
          .fail(@__fail)
          .done (info) =>
            @fileInfo = info
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
        @fileInfo = null
        @__resetUpload()
        @__setupFileButton()
        @available = true
        @template.reset()
        $(this).trigger('uploadcare.widget.cancel')

      __setupWidget: ->
        # Initialize the file browse button
        @fileButton = @template.addButton('file')
        @__setupFileButton()

        # Create the dialog and its button
        if @settings.tabs.length > 0
          dialogButton = @template.addButton('dialog')
          dialogButton.on 'click', => @openDialog()

        # Enable drag and drop
        ns.dragdrop.receiveDrop(@__uploadAndShowPreview, @template.dropArea)
        @template.dropArea.on 'uploadcare.dragstatechange', (e, active) =>
          unless active && ns.__dialogFrame.isOpened()
            @template.dropArea.toggleClass('uploadcare-dragging', active)

      __uploadAndShowPreview: (args...) =>
        fileToUpload = files.toFiles args...
        rescueFileInfo = @upload fileToUpload
        @__step2Promise $.Deferred().resolve {rescueFileInfo, fileInfo: fileToUpload}

      __setupFileButton: ->
        utils.fileInput @fileButton, false, (e) => 
          @__uploadAndShowPreview 'event', e

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

        fileInfo = $.Deferred()

        currentUpload
          .fail (error) =>
            @__fail() if error
            fileInfo.reject()
          .done (infos) =>
            info = infos[0] # FIXME
            @__setLoaded(info)
            info
              .done (infos) => 
                @element.change()
                fileInfo.resolve(infos)
              .fail ->
                fileInfo.reject()

        return fileInfo

      __resetUpload: ->
        @uploader.reset()

      openDialog: =>
        if @fileInfo
          @__step2Promise @__fileInfoToStep1Pr @fileInfo
        else
          @__step2Promise @__step1Promise()        

      __fileInfoToStep1Pr: (fileInfo) ->
        rescueFileInfo = $.Deferred().resolve(@fileInfo).promise()
        $.Deferred().resolve {fileInfo, rescueFileInfo}

      __step1Promise: =>
        ns.showChooseDialog(@settings).pipe (fileToUpload) => 
          rescueFileInfo = @upload fileToUpload
          {rescueFileInfo, fileInfo: fileToUpload}

      # show step 2 of dialog when step1Pr resolves
      __step2Promise: (step1Pr) ->
        ns.showPreviewDialog(@settings, step1Pr.promise(), @__step1Promise)
          .fail(=> @setValue(''))
          .done (modifiers) ->
            # TODO: implemet it for crop step 2 mode

    initialize
      name: 'widget'
      class: ns.Widget
      elements: '@uploadcare-uploader'
