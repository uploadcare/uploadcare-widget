# = require ../files
# = require ./dragdrop
# = require ./template
# = require ./dialog
# = require_self
# = require ./widget
# = require ./multiple-widget

{
  namespace,
  utils,
  jQuery: $,
  locale: {t}
} = uploadcare

namespace 'uploadcare.widget', (ns) ->
  class ns.BaseWidget

    constructor: (element) ->
      @element = $(element)
      @settings = utils.buildSettings @element.data()

      @__onChange = $.Callbacks()
      @onChange = utils.publicCallbacks @__onChange
      @__initOnUploadComplete()

      @__setupWidget()
      @template.reset()

      @element.on 'change.uploadcare', => @reloadInfo()
      @reloadInfo()

    __setupWidget: ->
      @template = new ns.Template(@settings, @element)

      clear = =>
        @__clearCurrentObj()
        @__reset()

      @template.addButton('cancel', t('buttons.cancel')).on('click', clear)
      @template.addButton('remove', t('buttons.remove')).on('click', clear)

      # Create the dialog and widget buttons
      if @settings.tabs.length > 0
        if 'file' in @settings.tabs
          fileButton = @template.addButton('file')
          fileButton.on 'click', =>
            @openDialog('file')

        dialogButton = @template.addButton('dialog')
        dialogButton.on 'click', => @openDialog()

      # Enable drag and drop
      ns.dragdrop.receiveDrop(@__handleDirectSelection, @template.dropArea)
      @template.dropArea.on 'dragstatechange.uploadcare', (e, active) =>
        unless active && uploadcare.isDialogOpened()
          @template.dropArea.toggleClass('uploadcare-dragging', active)

      @template.content.on 'click', '@uploadcare-widget-file-name', =>
        @openDialog()

    __infoToValue: (info) ->
      if info.cdnUrlModifiers || @settings.pathValue
        info.cdnUrl
      else
        info.uuid

    __setValue: (value) ->
      if @element.val() != value
        @element.val(value)
        @__onChange.fire @__currentObject()

    __reset: =>
      @template.reset()
      @__setValue ''

    __watchCurrentObject: ->
      object = @__currentFile()
      if object
        @template.listen object
        object
          .fail (error) =>
            @__onUploadingFailed(error) if object == @__currentFile()
          .done (info) =>
            @__onUploadingDone(info) if object == @__currentFile()

    __onUploadingDone: (info) ->
      @__setValue @__infoToValue(info)
      @template.setFileInfo(info)
      @template.loaded()

    __onUploadingFailed: (error) ->
      @__reset()
      @template.error error

    # converts URL, CDN URL, or File object to File object
    __anyToFile: (value) ->
      if value
        if value.done && value.fail
          value
        else
          uploadcare.fileFrom('url', value, @settings)
      else
        null

    api: ->
      unless @__api
        @__api = utils.bindAll this, [
          'openDialog'
          'reloadInfo'
          'value'
        ]
        @__api.onChange = @onChange
        @__api.onUploadComplete = @onUploadComplete
      @__api
