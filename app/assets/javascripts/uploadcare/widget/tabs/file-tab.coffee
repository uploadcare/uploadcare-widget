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

      @__setupFileButton()
      @__initDragNDrop()
      @__initTabsList()

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

    __initTabsList: =>
      list = @container.find('.uploadcare--file-sources__items').empty()
      n = 0
      for tab in @settings.tabs
        if tab in ['file', 'url', 'camera']
          continue
        if not @dialogApi.isTabVisible(tab)
          continue

        n += 1

        if n > 5
          continue

        list.append([@__tabButton(tab), ' '])

      if n > 5
        list.addClass('uploadcare--file-sources__items_many')

      allIcon = $("<svg width='32' height='32'><use xlink:href='#uploadcare--icon-more'/></svg>")
        .attr('role', 'presentation')
        .addClass('uploadcare--icon')
        .addClass('uploadcare--file-source__icon')

      allButton = $('<div>', {role: 'button', tabindex: "0"})
        .addClass('uploadcare--file-source')
        .addClass("uploadcare--file-source_all")
        .addClass('uploadcare--file-sources__item')
        .attr('title', 'Open menu')
        .append(allIcon)
        .on 'click', =>
          @dialogApi.openMenu()

      list.append([allButton, ' '])

      @container.find('.uploadcare--file-sources').attr('hidden', n == 0)

    __tabButton: (name) ->
      tabIcon = $("<svg width='32' height='32'><use xlink:href='#uploadcare--icon-#{name}'/></svg>")
        .attr('role', 'presentation')
        .addClass('uploadcare--icon')
        .addClass('uploadcare--file-source__icon')

      tabButton = $('<div>', {role: 'button', tabindex: "0"})
        .addClass('uploadcare--file-source')
        .addClass("uploadcare--file-source_#{name}")
        .addClass('uploadcare--file-sources__item')
        .attr('title', t("dialog.tabs.names.#{name}"))
        .attr('data-tab', name)
        .append(tabIcon)
        .on 'click', =>
          @dialogApi.switchTab(name)