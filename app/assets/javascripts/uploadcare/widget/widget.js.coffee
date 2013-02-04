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

        @__setupWidget()
        @currentFile = null
        @template.reset()
        @__setupFileButton()

        @__skipChange = 0
        @element.on 'change', =>
          if @__skipChange == 0
            @reloadInfo()
          else
            @__skipChange--

        @reloadInfo()

      __reset: (keepValue=false) =>
        @currentFile?.upload?.reject()
        @currentFile = null
        @template.reset()
        @__setupFileButton()
        unless keepValue
          @__setValue ''

      __setFile: (newFile, keepValue=false) =>
        @__reset(keepValue)
        if newFile
          @currentFile = newFile
          @template.started()
          @currentFile.startUpload()
          @template.listen @currentFile.upload
          @currentFile.info()
            .fail (error, file) =>
              if file == @currentFile
                @__fail error
            .done (file) =>
              if file == @currentFile
                if @settings.imagesOnly && !file.isImage
                  @__fail('image')
                else
                  @template.setFileInfo(file)
                  @template.loaded()
                  unless keepValue
                    if file.cdnUrlModifiers
                      @__setValue file.cdnUrl
                    else
                      @__setValue file.fileId

      __setValue: (value) ->
        @__skipChange++
        @setValue value

      setValue: (value) ->
        @element.val(value).change()

      reloadInfo: =>
        if @element.val()
          file = uploadcare.fileFrom @settings, 'uploaded', @element.val()
          @__setFile file, true
        else
          @__reset()

      __fail: (error) =>
        @__reset()
        @template.error error

      __setupWidget: ->
        @template = new ns.Template(@settings, @element)

        @template.addButton('cancel', t('buttons.cancel')).on('click', @__reset)
        @template.addButton('remove', t('buttons.remove')).on('click',  @__reset)

        # Initialize the file browse button
        @fileButton = @template.addButton('file')
        @__setupFileButton()

        # Create the dialog and its button
        if @settings.tabs.length > 0
          dialogButton = @template.addButton('dialog')
          dialogButton.on 'click', => @openDialog()

        # Enable drag and drop
        ns.dragdrop.receiveDrop(@__openDialogWithFile, @template.dropArea)
        @template.dropArea.on 'dragstatechange.uploadcare', (e, active) =>
          unless active && uploadcare.isDialogOpened()
            @template.dropArea.toggleClass('uploadcare-dragging', active)

      __openDialogWithFile: (type, data) =>
        file = uploadcare.fileFrom @settings, type, data
        uploadcare.openDialog(@settings, file).done(@__setFile)

      __setupFileButton: ->
        utils.fileInput @fileButton, false, (e) => 
          @__openDialogWithFile 'event', e

      openDialog: ->
        uploadcare.openDialog(@settings, @currentFile)
          .done(@__setFile)
          .fail (file) =>
            unless file == @currentFile
              @__setFile null

    uploadcare.initialize = ->
      dataAttr = 'uploadcareWidget'
      for el in $ '@uploadcare-uploader' when not $(el).data(dataAttr)
        $(el).data dataAttr, new ns.Widget $(el)
    $(document).on('ready ajaxSuccess htmlInserted', uploadcare.initialize)
