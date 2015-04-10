{
  namespace,
  utils,
  dragdrop,
  jQuery: $,
  templates: {tpl}
} = uploadcare

namespace 'uploadcare.widget.tabs', (ns) ->
  class ns.FileTab

    constructor: (@container, @tabButton, @dialogApi, @settings, @name) ->
      @container.append(tpl('tab-file', {tabs: @settings.tabs}))
      @container.addClass('uploadcare-dialog-padding')

      @container.on 'click', '.uploadcare-dialog-file-source', (e) =>
        @dialogApi.switchTab($(e.target).data('tab'))

      @__setupFileButton()
      @__initDragNDrop()

    __initDragNDrop: ->
      dropArea = @container.find('.uploadcare-dialog-file-drop-area')
      if utils.abilities.fileDragAndDrop
        dragdrop.receiveDrop dropArea, (type, data) =>
          @dialogApi.addFiles(type, data)
          @dialogApi.switchTab('preview')
        @container.addClass("uploadcare-draganddrop")

    __setupFileButton: ->
      fileButton = @container.find('.uploadcare-dialog-big-button')
      utils.fileInput fileButton, @settings, (input) =>
        if utils.abilities.sendFileAPI
          @dialogApi.addFiles('object', input.files)
        else
          @dialogApi.addFiles('input', [input])
        @dialogApi.switchTab('preview')
