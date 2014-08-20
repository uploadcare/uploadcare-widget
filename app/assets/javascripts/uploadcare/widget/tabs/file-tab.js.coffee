{
  namespace,
  utils,
  dragdrop,
  jQuery: $,
  templates: {tpl}
} = uploadcare

namespace 'uploadcare.widget.tabs', (ns) ->
  class ns.FileTab extends ns.BaseSourceTab

    constructor: ->
      super

      @wrap.append tpl 'tab-file', {tabs: @settings.tabs}
      @wrap.addClass('uploadcare-dialog-padding')

      @wrap.on 'click', '@uploadcare-dialog-switch-tab', (e) =>
        @dialogApi.switchTab $(e.target).data 'tab'

      @__setupFileButton()
      @__initDragNDrop()

    __initDragNDrop: ->
      dropArea = @wrap.find('@uploadcare-drop-area')
      if utils.abilities.fileDragAndDrop
        dragdrop.receiveDrop dropArea, (type, data) =>
          @dialogApi.addFiles type, data
          @dialogApi.switchTab 'preview'
        @wrap.addClass "uploadcare-draganddrop"

    __setupFileButton: ->
      fileButton = @wrap.find('@uploadcare-dialog-browse-file')
      accept = if @settings.imagesOnly then 'image/*' else null
      utils.fileInput fileButton, @settings.multiple, accept, (input) =>
        if utils.abilities.sendFileAPI
          @dialogApi.addFiles 'object', input.files
        else
          @dialogApi.addFiles 'input', [input]
        @dialogApi.switchTab 'preview'
