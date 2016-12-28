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

      @container.on 'click', '.uploadcare--file-sources__item', (e) =>
        @dialogApi.switchTab($(e.target).data('tab'))

      @container.on 'click', '.uploadcare--file-sources__items', (e) =>
        @dialogApi.openMenu()

      @__setupFileButton()
      @__initDragNDrop()
      @__updateTabsList()
      @dialogApi.onTabVisibility(@__updateTabsList)

    __initDragNDrop: ->
      dropArea = @container.find('.uploadcare--draganddrop')
      if utils.abilities.fileDragAndDrop
        dragdrop.receiveDrop dropArea, (type, data) =>
          @dialogApi.addFiles(type, data)
          @dialogApi.switchTab('preview')
        dropArea.addClass("uploadcare--draganddrop_supported")

    __setupFileButton: ->
      fileButton = @container.find('.uploadcare--panel__action-button')
      if utils.abilities.sendFileAPI
        fileButton.on 'click', =>
          utils.fileSelectDialog @container, @settings, (input) =>
            @dialogApi.addFiles('object', input.files)
            @dialogApi.switchTab('preview')
          false
      else
        utils.fileInput fileButton, @settings, (input) =>
          @dialogApi.addFiles('input', [input])
          @dialogApi.switchTab('preview')

    __updateTabsList: =>
      list = @container.find('.uploadcare--file-sources__items').empty()
      n = 0
      for tab in @settings.tabs
        if tab in ['file', 'url', 'camera']
          continue
        if not @dialogApi.isTabVisible(tab)
          continue

        n += 1
        list.append([
          $('<div/>', {
            class: "uploadcare--file-sources__item uploadcare--file-sources__item_" + tab
            'data-tab': tab
            html: t('dialog.tabs.names.' + tab)
          }),
          ' '
        ])

      @container.find('.uploadcare--file-sources').attr('hidden', n == 0)
