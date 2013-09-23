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

      @wrap.append tpl 'tab-file', {avalibleTabs: @dialogApi.avalibleTabs}

      @wrap.on 'click', '@uploadcare-dialog-switch-tab', (e) =>
        @dialogApi.switchTab $(e.target).data 'tab'

      @__setupFileButton()
      @__initDragNDrop()

    __initDragNDrop: ->
      dropArea = @wrap.find('@uploadcare-drop-area')
      if utils.abilities.fileDragAndDrop
        dragdrop.receiveDrop dropArea, (type, data) =>
          @dialogApi.addFiles type, data
          @dialogApi.switchToPreview()
        className = 'draganddrop'
      else
        className = 'no-draganddrop'
      @wrap.addClass "uploadcare-#{className}"

    __setupFileButton: ->
      fileButton = @wrap.find('@uploadcare-dialog-browse-file')
      utils.fileInput fileButton, @settings.multiple, (e) =>
        @dialogApi.addFiles 'event', e
        @dialogApi.switchTab 'preview'
