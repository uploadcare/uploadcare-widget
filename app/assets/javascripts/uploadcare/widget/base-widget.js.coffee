# = require ../files
# = require ./dragdrop
# = require ./template
# = require ./dialog
# = require_self
# = require ./widget
# = require ./multiple-widget

{
  utils,
  jQuery: $,
  dragdrop,
  locale: {t}
} = uploadcare

uploadcare.namespace 'widget', (ns) ->
  class ns.BaseWidget

    constructor: (@element, @settings) ->
      @validators = @settings.validators = []
      @currentObject = null

      @__onDialogOpen = $.Callbacks()
      @__onUploadComplete = $.Callbacks()
      @__onChange = $.Callbacks().add (object) =>
        object?.promise().done (info) =>
          @__onUploadComplete.fire(info)

      @__setupWidget()

      @element.on('change.uploadcare', @reloadInfo)
      # Delay loading info to allow set custom validators on page load.
      @__hasValue = false
      utils.defer =>
        # Do not reload info if user call uc.Widget().value(uuid) manual.
        if not @__hasValue
          @reloadInfo()

    __setupWidget: ->
      @template = new ns.Template(@settings, @element)

      path = ['buttons.choose']
      path.push(if @settings.imagesOnly then 'images' else 'files')
      path.push(if @settings.multiple then 'other' else 'one')

      @template.addButton('open', t(path.join('.')))
        .toggleClass('needsclick', @settings.systemDialog)
        .on 'click', =>
          @openDialog()

      @template.addButton('cancel', t('buttons.cancel')).on 'click', =>
        @__setObject(null)

      @template.addButton('remove', t('buttons.remove')).on 'click', =>
        @__setObject(null)

      @template.content.on 'click', '.uploadcare-widget-file-name', =>
        @openDialog()

      # Enable drag and drop
      dragdrop.receiveDrop(@template.content, @__handleDirectSelection)

      @template.reset()

    __infoToValue: (info) ->
      if info.cdnUrlModifiers || @settings.pathValue
        info.cdnUrl
      else
        info.uuid

    __reset: =>
      # low-level primitive. @__setObject(null) could be better.
      object = @currentObject
      @currentObject = null
      object?.cancel?()
      @template.reset()

    __setObject: (newFile) =>
      if newFile == @currentObject
        return
      @__reset()
      if newFile
        @currentObject = newFile
        @__watchCurrentObject()
      else
        @element.val('')
      @__onChange.fire(@currentObject)

    __watchCurrentObject: ->
      object = @__currentFile()
      if object
        @template.listen(object)
        object
          .done (info) =>
            if object == @__currentFile()
              @__onUploadingDone(info)
          .fail (error) =>
            if object == @__currentFile()
              @__onUploadingFailed(error)

    __onUploadingDone: (info) ->
      @element.val(@__infoToValue(info))
      @template.setFileInfo(info)
      @template.loaded()

    __onUploadingFailed: (error) ->
      @template.reset()
      @template.error(error)

    __setExternalValue: (value) ->
      @__setObject(utils.valueToFile(value, @settings))

    value: (value) ->
      if value isnt undefined
        @__hasValue = true
        @__setExternalValue(value)
        this
      else
        @currentObject

    reloadInfo: =>
      @value(@element.val())

    openDialog: (tab) ->
      if @settings.systemDialog
        utils.fileSelectDialog @template.content, @settings, (input) =>
          @__handleDirectSelection('object', input.files)
      else
        return @__openDialog(@currentObject, tab)

    __openDialog: (files, tab) ->
        dialogApi = uploadcare.openDialog(files, tab, @settings)
        @__onDialogOpen.fire(dialogApi)
        return dialogApi.done(@__setObject)

    api: ->
      if not @__api
        @__api = utils.bindAll(this, [
          'openDialog'
          'reloadInfo'
          'value'
          'validators'
        ])
        @__api.onChange = utils.publicCallbacks(@__onChange)
        @__api.onUploadComplete = utils.publicCallbacks(@__onUploadComplete)
        @__api.onDialogOpen = utils.publicCallbacks(@__onDialogOpen)
        @__api.inputElement = @element.get(0)
      @__api
