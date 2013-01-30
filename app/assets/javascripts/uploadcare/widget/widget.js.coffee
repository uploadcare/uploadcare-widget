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

      __reset: =>
        @currentFile?.upload?.reject()
        @currentFile = null
        @template.reset()
        @__setupFileButton()
        @__setValue ''

      __setFile: (newFile) ->
        @__reset()
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
          @__setFileOfType 'uploaded', @element.val()
        else
          @__reset()

      __setEventFile: (e) =>
        @__setFileOfType 'event', e

      __setFileOfType: (type, data) =>
        file = uploadcare.fileFrom(@settings, type, data)
        if file
          @__setFile file
        else
          @__fail('cant-create')

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
        ns.dragdrop.receiveDrop(@__setFileOfType, @template.dropArea)
        @template.dropArea.on 'dragstatechange.uploadcare', (e, active) =>
          unless active && @dialog()?
            @template.dropArea.toggleClass('uploadcare-dragging', active)

      __setupFileButton: ->
        utils.fileInput @fileButton, false, @__setEventFile

      currentDialog = null

      dialog: -> currentDialog

      openDialog: ->
        @closeDialog()
        currentDialog = ns.showDialog(@settings)
          .done(@__setFileOfType)
          .always( -> currentDialog = null)

      closeDialog: ->
        currentDialog?.close()
        

    uploadcare.initialize = ->
      dataAttr = 'uploadcareWidget'
      for el in $ '@uploadcare-uploader' when not $(el).data(dataAttr)
        $(el).data dataAttr, new ns.Widget $(el)
    $(document).on('ready ajaxSuccess htmlInserted', uploadcare.initialize)
