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
  settings: s,
  jQuery: $,
  locale: {t}
} = uploadcare

namespace 'uploadcare.widget', (ns) ->
  class ns.BaseWidget

    constructor: (element) ->
      @element = $(element)
      @settings = s.build @element.data()

      @__onChange = $.Callbacks()
      @onChange = utils.publicCallbacks @__onChange
      @__initOnUploadComplete()

      @__setupWidget()
      @template.reset()

      @element.on 'change.uploadcare', => @reloadInfo()
      @reloadInfo()

    __setupWidget: ->
      @template = new ns.Template(@settings, @element)

      @template.addButton('cancel', t('buttons.cancel')).on('click', @__reset)
      @template.addButton('remove', t('buttons.remove')).on('click', @__reset)

      # Create the dialog and widget buttons
      if @settings.tabs.length > 0
        if uploadcare.settings.common().customWidget
          $("@uploadcare-widget-buttons").on("click", ->
            _this.openDialog "file"
          ).css cursor: "pointer"
        else
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
      @__clearCurrentObj()
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
      if uploadcare.settings.common().customWidget
        return info
      else
        @template.setFileInfo(info)
        @template.loaded()

    __onUploadingFailed: (error) ->
      @template.error error

    api: ->
      unless @__api
        @__api = utils.bindAll this, [
          'openDialog'
          'reloadInfo'
          'value'
        ]
        @__api.onChange = @onChange
        @__api.onUploadComplete = @onUploadComplete
        @__api.inputElement = @element.get(0)
      @__api
