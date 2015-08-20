{
  utils,
  dragdrop,
  locale: {t},
  jQuery: $,
  templates: {tpl}
} = uploadcare

uploadcare.namespace 'widget.tabs', (ns) ->
  class ns.FileTab

    constructor: (@container, @tabButton, @dialogApi, @settings, @name) ->
      @container.append(tpl('tab-file'))
      @container.addClass('uploadcare-dialog-padding')

      @container.on 'click', '.uploadcare-dialog-file-source', (e) =>
        @dialogApi.switchTab($(e.target).data('tab'))

      @__setupFileButton()
      @__initDragNDrop()
      @__updateTabsList()
      @dialogApi.onTabVisibility(@__updateTabsList)

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

    __updateTabsList: =>
      list = @container.find('.uploadcare-dialog-file-sources').empty()
      n = 0
      for tab in @settings.tabs
        if tab == @name
          continue
        if not @dialogApi.isTabVisible(tab)
          continue

        n += 1
        list.append([
          $('<div/>', {
            class: "uploadcare-dialog-file-source"
            'data-tab': tab
            html: t('dialog.tabs.names.' + tab)
          }),
          ' '
        ])

      list.toggleClass('uploadcare-hidden', n == 0)
      @container
        .find('.uploadcare-dialog-file-source-or')
        .toggleClass('uploadcare-hidden', n == 0)
