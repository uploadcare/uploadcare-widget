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
        @__reset()

        # @element.on('change', @reloadInfo)
        @reloadInfo()

      __reset: =>
        @currentFile?.__cancel()
        @currentFile = null
        @template.reset()
        @__setupFileButton()

      __setFile: (newFile) ->
        if newFile and @currentFile and newFile.fileId == @currentFile.fileId
          return
        @__reset()
        if !newFile
          return
        @currentFile = newFile
        @template.started()
        @template.listen @currentFile.upload()
        @currentFile.info()
          .fail (error, file) =>
            if file == @currentFile
              @__fail error
          .done (file) =>
            if file == @currentFile
              @template.setFileInfo(file)
              @template.loaded()
              @setValue file.fileId

      setValue: (value) ->
        @element.val(value).change()

      reloadInfo: =>
        @__setFileOfType 'uploaded', @element.val()

      __setEventFile: (e) =>
        @__setFileOfType 'event', e

      __setFileOfType: (type, data) =>
        @__setFile uploadcare.fileFrom(@settings, type, data)

      __fail: (type) =>
        @setValue('')
        @template.error(type)

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
          #unless active && @dialog()?
          @template.dropArea.toggleClass('uploadcare-dragging', active)

      __setupFileButton: ->
        utils.fileInput @fileButton, false, @__setEventFile

      # currentDialog = null

      # dialog: -> currentDialog

      # openDialog: ->
      #   @closeDialog()
      #   currentDialog = ns.showDialog(@settings)
      #     .done(@upload)
      #     .always( -> currentDialog = null)


      # closeDialog: ->
      #   currentDialog?.close()
        

    uploadcare.initialize = ->
      dataAttr = 'uploadcareWidget'
      for el in $ '@uploadcare-uploader' when not $(el).data(dataAttr)
        $(el).data dataAttr, new ns.Widget $(el)
    $(document).on('ready ajaxSuccess htmlInserted', uploadcare.initialize)
