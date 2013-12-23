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
        className = 'draganddrop'
      else
        className = 'no-draganddrop'
      @wrap.addClass "uploadcare-#{className}"

    __setupFileButton: ->
      fileButton = @wrap.find('@uploadcare-dialog-browse-file')
      utils.fileInput fileButton, @settings.multiple, (input) =>
        if input.files
          @dialogApi.addFiles 'object', input.files
        else
          @dialogApi.addFiles 'input', [input]
        @dialogApi.switchTab 'preview'
