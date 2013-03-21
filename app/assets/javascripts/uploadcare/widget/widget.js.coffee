# = require ../files
# = require ./dragdrop
# = require ./template
# = require ./dialog

{
  namespace,
  utils,
  uploads,
  jQuery: $
} = uploadcare

{t} = uploadcare.locale

namespace 'uploadcare.widget', (ns) ->
  class ns.Widget

    constructor: (element) ->
      @element = $(element)
      @settings = utils.buildSettings @element.data()
      @__onChange = $.Callbacks()
      @onChange = utils.publicCallbacks @__onChange

      @__setupWidget()
      @currentFile = null
      @template.reset()

      @element.on 'change.uploadcare', => @reloadInfo()
      @reloadInfo()

    __reset: (keepValue=false) =>
      @currentFile?.cancel()
      @currentFile = null
      @template.reset()
      unless keepValue
        @__setValue ''

    __setFile: (newFile, keepValue=false) =>
      if newFile == @currentFile
        if newFile
          @__updateValue() unless keepValue
        return
      @__reset(keepValue)
      if newFile
        @currentFile = newFile
        @template.listen @currentFile
        @currentFile
          .fail (error) =>
            if newFile == @currentFile
              @__fail error
          .done (info) =>
            if newFile == @currentFile
              @template.setFileInfo(info)
              @template.loaded()
        @__updateValue() unless keepValue

    __updateValue: ->
      file = @currentFile
      @currentFile.done (info) =>
        if file == @currentFile
          if info.cdnUrlModifiers
            @__setValue info.cdnUrl
          else
            @__setValue info.fileId

    __setValue: (value) ->
      if @element.val() != value
        @element.val(value)
        @__onChange.fire @currentFile

    value: (value) ->
      if value?
        if @element.val() != value
          @__setFile(
            if value.done && value.fail
              value
            else
              uploadcare.fileFrom('url', value, @settings)
          )
        this
      else
        @currentFile

    reloadInfo: =>
      if @element.val()
        file = uploadcare.fileFrom('url', @element.val(), @settings)
        @__setFile file, true
      else
        @__reset()
      this

    __fail: (error) =>
      @__reset()
      @template.error error

    __setupWidget: ->
      @template = new ns.Template(@settings, @element)

      @template.addButton('cancel', t('buttons.cancel')).on('click', => @__reset())
      @template.addButton('remove', t('buttons.remove')).on('click', => @__reset())

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
      file = uploadcare.fileFrom(type, data, @settings)
      uploadcare.openDialog(file, @settings).done(@__setFile)

    openDialog: (tab) ->
      uploadcare.openDialog(@currentFile, tab, @settings)
        .done(@__setFile)
        .fail (file) =>
          unless file == @currentFile
            @__setFile null

    api: ->
      unless @__api
        @__api = utils.bindAll this, [
          'openDialog'
          'reloadInfo'
          'value'
        ]
        @__api.onChange = @onChange
      @__api
