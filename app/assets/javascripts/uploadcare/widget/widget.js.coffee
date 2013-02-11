# = require ../files
# = require ./dragdrop
# = require ./template
# = require ./dialog

uploadcare.whenReady ->
  {
    namespace,
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

        @__skipChange = 0
        @element.on 'change.uploadcare', =>
          if @__skipChange == 0
            @reloadInfo()
          else
            @__skipChange--

        @reloadInfo()

      __reset: (keepValue=false) =>
        @currentFile?.upload?.reject()
        @currentFile = null
        @template.reset()
        unless keepValue
          @__setValue ''

      __setFile: (newFile, keepValue=false) =>
        if newFile == @currentFile
          return
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

        # Create the dialog and widget buttons
        if @settings.tabs.length > 0
          if 'file' in @settings.tabs
            fileButton = @template.addButton('file')
            fileButton.on 'click', =>
              @openDialog('file')

          dialogButton = @template.addButton('dialog')
          dialogButton.on 'click', => @openDialog()


        # Enable drag and drop
        ns.dragdrop.receiveDrop(@__openDialogWithFile, @template.dropArea)
        @template.dropArea.on 'dragstatechange.uploadcare', (e, active) =>
          unless active && uploadcare.isDialogOpened()
            @template.dropArea.toggleClass('uploadcare-dragging', active)

        @template.content.on 'click', '@uploadcare-widget-file-name', =>
          @openDialog()

      __openDialogWithFile: (type, data) =>
        file = uploadcare.fileFrom @settings, type, data
        uploadcare.openDialog(@settings, file).done(@__setFile)

      openDialog: (tab) ->
        uploadcare.openDialog(@settings, @currentFile, tab)
          .done(@__setFile)
          .fail (file) =>
            unless file == @currentFile
              @__setFile null
