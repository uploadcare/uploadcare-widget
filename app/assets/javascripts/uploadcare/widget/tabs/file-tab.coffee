import uploadcare from './namespace.coffee'

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
        dragdrop.receiveDrop dropArea, (type, files) =>
          @dialogApi.addFiles(type, files)
          @dialogApi.switchTab('preview')
        dropArea.addClass("uploadcare--draganddrop_supported")

    __setupFileButton: ->
      fileButton = @container.find('.uploadcare--tab__action-button')
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
      list = @container.find('.uploadcare--file-sources__items')
      list.remove('.uploadcare--file-sources__item:not(.uploadcare--file-source_all)')

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

      allButton = list.find('.uploadcare--file-source_all')
        .on 'click', =>
          @dialogApi.openMenu()

      if n > 5
        list.addClass('uploadcare--file-sources__items_many')
      @container.find('.uploadcare--file-sources').attr('hidden', n == 0)

    __tabButton: (name) ->
      tabIcon = $("<svg width='32' height='32'><use xlink:href='#uploadcare--icon-#{name}'/></svg>")
        .attr('role', 'presentation')
        .attr('class', 'uploadcare--icon uploadcare--file-source__icon')

      tabButton = $('<button>')
        .addClass('uploadcare--button')
        .addClass('uploadcare--button_icon')
        .addClass('uploadcare--file-source')
        .addClass("uploadcare--file-source_#{name}")
        .addClass('uploadcare--file-sources__item')
        .attr('type', 'button')
        .attr('title', t("dialog.tabs.names.#{name}"))
        .attr('data-tab', name)
        .append(tabIcon)
        .on 'click', =>
          @dialogApi.switchTab(name)
