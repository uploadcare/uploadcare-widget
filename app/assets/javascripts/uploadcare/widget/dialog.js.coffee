# = require ./tabs/file-tab
# = require ./tabs/url-tab
# = require ./tabs/camera-tab
# = require ./tabs/remote-tab
# = require ./tabs/base-preview-tab
# = require ./tabs/preview-tab
# = require ./tabs/preview-tab-multiple

{
  namespace,
  utils,
  locale: {t},
  templates: {tpl},
  ui: {progress: {Circle}},
  files,
  widget: {tabs},
  settings: s,
  jQuery: $
} = uploadcare

namespace 'uploadcare', (ns) ->

  lockScroll = (el, toTop) ->
    top = el.scrollTop()
    left = el.scrollLeft()
    if toTop
      el.scrollTop(0).scrollLeft(0)
    ->
      el.scrollTop(top).scrollLeft(left)

  $(window).on 'keydown', (e) =>
    if ns.isDialogOpened()
      if e.which == 27  # Escape
        e.stopImmediatePropagation()
        ns.closeDialog()

  currentDialogPr = null
  openedClass = 'uploadcare-dialog-opened'

  ns.isDialogOpened = ->
    currentDialogPr != null

  ns.closeDialog = ->
    currentDialogPr?.reject()

  ns.openDialog = (files, tab, settings) ->
    ns.closeDialog()

    dialog = $(tpl('dialog')).appendTo('body')
    dialog.on('click', '.uploadcare-dialog-close', ns.closeDialog)
    dialog.on 'dblclick', (e) ->
      # handler can be called after element detached (close button)
      if not $.contains(document.documentElement, e.target)
        return

      showStoppers = '.uploadcare-dialog-panel, a'
      if $(e.target).is(showStoppers) or $(e.target).parents(showStoppers).length
        return

      ns.closeDialog()

    currentDialogPr = ns.openPanel(dialog.find('.uploadcare-dialog-placeholder'),
                                   files, tab, settings)

    dialog.addClass('uploadcare-active')
    cancelLock = lockScroll($(window), dialog.css('position') is 'absolute')
    $('html, body').addClass(openedClass)

    currentDialogPr.always ->
      $('html, body').removeClass(openedClass)
      currentDialogPr = null
      dialog.remove()
      cancelLock()


  # files - null, or File object, or array of File objects, or FileGroup object
  # result - File objects or FileGroup object (depends on settings.multiple)
  ns.openPanel = (placeholder, files, tab, settings) ->
    if $.isPlainObject(tab)
      settings = tab
      tab = null

    if not files
      files = []
    else if utils.isFileGroup(files)
      files = files.files()
    else if not $.isArray(files)
      files = [files]

    settings = s.build(settings)
    panel = new Panel(settings, placeholder, files, tab).publicPromise()

    filter = (files) ->
      if settings.multiple
        uploadcare.FileGroup(files, settings)
      else
        files[0]

    utils.then(panel, filter, filter).promise(panel)


  registeredTabs = {}

  ns.registerTab = (tabName, constructor) ->
    registeredTabs[tabName] = constructor

  ns.registerTab('file', tabs.FileTab)
  ns.registerTab('url', tabs.UrlTab)
  ns.registerTab('camera', tabs.CameraTab)
  ns.registerTab('facebook', tabs.RemoteTab)
  ns.registerTab('dropbox', tabs.RemoteTab)
  ns.registerTab('gdrive', tabs.RemoteTab)
  ns.registerTab('instagram', tabs.RemoteTab)
  ns.registerTab('flickr', tabs.RemoteTab)
  ns.registerTab('vk', tabs.RemoteTab)
  ns.registerTab('evernote', tabs.RemoteTab)
  ns.registerTab('box', tabs.RemoteTab)
  ns.registerTab('skydrive', tabs.RemoteTab)
  ns.registerTab('huddle', tabs.RemoteTab)
  ns.registerTab 'empty-pubkey', (tabPanel, _1, _2, settings) ->
    tabPanel.append(settings._emptyKeyText)
  ns.registerTab 'preview', (tabPanel, tabButton, dialogApi, settings, name) ->
    tabCls = if settings.multiple
        tabs.PreviewTabMultiple
      else
        tabs.PreviewTab
    new tabCls(tabPanel, tabButton, dialogApi, settings, name)

  class Panel
    constructor: (@settings, placeholder, files, tab) ->
      @dfd = $.Deferred()
      @dfd.always(@__closePanel)

      sel = '.uploadcare-dialog-panel'
      @content = $(tpl('panel'))
      @panel = @content.find(sel).add(@content.filter(sel))
      @placeholder = $(placeholder)
      @placeholder.replaceWith(@content)

      if @settings.multiple
        @panel.addClass('uploadcare-dialog-multiple')

      # files collection
      @files = new utils.CollectionOfPromises(files)
      @files.onRemove.add =>
        if @files.length() == 0
          @hideTab('preview')

      @tabs = {}
      @__prepareFooter()
      @onTabVisibility = $.Callbacks()

      if @settings.publicKey
        @__prepareTabs(tab)
      else
        @__welcome()

    publicPromise: ->
      if not @promise
        @promise = @dfd.promise(
          reject: @__reject
          resolve: @__resolve
          fileColl: @files
          addFiles: @addFiles
          switchTab: @switchTab
          hideTab: @hideTab
          showTab: @showTab
          isTabVisible: @isTabVisible
          onTabVisibility: @onTabVisibility
        )
      @promise

    # (fileType, data) or ([fileObject, fileObject])
    addFiles: (files, data) =>
      if data
        # 'files' is actually file type
        files = ns.filesFrom(files, data, @settings)

      if not @settings.multiple
        @files.clear()

      for file in files
        @files.add(file)

      if @settings.previewStep
        @showTab('preview')
        if not @settings.multiple
          @switchTab('preview')
      else
        @__resolve()

    __resolve: =>
      @dfd.resolve(@files.get())

    __reject: =>
      @dfd.reject(@files.get())

    __prepareTabs: (tab) ->
      @addTab('preview')
      for tabName in @settings.tabs
        @addTab(tabName)

      if @files.length()
        @showTab('preview')
        @switchTab('preview')
      else
        @hideTab('preview')
        @switchTab(tab || @__firstVisibleTab())

    __prepareFooter: ->
      @footer = @panel.find('.uploadcare-panel-footer')
      notDisabled = ':not(.uploadcare-disabled-el)'
      @footer.on 'click', '.uploadcare-dialog-button' + notDisabled, =>
        @switchTab('preview')
      @footer.on('click', '.uploadcare-dialog-button-success' + notDisabled, @__resolve)

      @__updateFooter()
      @files.onAdd.add(@__updateFooter)
      @files.onRemove.add(@__updateFooter)

    __updateFooter: =>
        files = @files.length()
        tooManyFiles = @settings.multipleMax != 0 and files > @settings.multipleMax
        tooFewFiles = files < @settings.multipleMin

        @footer.find('.uploadcare-dialog-button-success')
          .toggleClass('uploadcare-disabled-el', tooManyFiles or tooFewFiles)

        @footer.find('.uploadcare-dialog-button')
          .toggleClass('uploadcare-disabled-el', files is 0)

        footer = if tooManyFiles
          t('dialog.tabs.preview.multiple.tooManyFiles')
            .replace('%max%', @settings.multipleMax)
        else if files and tooFewFiles
          t('dialog.tabs.preview.multiple.tooFewFiles')
            .replace('%min%', @settings.multipleMin)
        else
          t('dialog.tabs.preview.multiple.title')

        @footer.find('.uploadcare-panel-footer-text')
          .toggleClass('uploadcare-error', tooManyFiles)
          .text(footer.replace('%files%', t('file', files)))

        @footer.find('.uploadcare-panel-footer-counter')
          .toggleClass('uploadcare-error', tooManyFiles)
          .text(if files then "(#{files})" else "")

    __closePanel: =>
      @panel.replaceWith(@placeholder)
      @content.remove()

    addTab: (name) ->
      if name of @tabs
        return

      TabCls = registeredTabs[name]

      if not TabCls
        throw new Error("No such tab: #{name}")

      tabPanel = $('<div>')
        .addClass("uploadcare-dialog-tabs-panel")
        .addClass("uploadcare-dialog-tabs-panel-#{name}")
        .insertBefore(@footer)

      tabButton = $('<div>', {role: 'button', tabindex: "0"})
        .addClass("uploadcare-dialog-tab")
        .addClass("uploadcare-dialog-tab-#{name}")
        .attr('title', t("dialog.tabs.names.#{name}"))
        .appendTo(@panel.find('.uploadcare-dialog-tabs'))
        .on 'click', =>
          if name is @currentTab
            @panel.toggleClass('uploadcare-dialog-opened-tabs')
          else
            @switchTab(name)

      @tabs[name] = new TabCls(tabPanel, tabButton, @publicPromise(), @settings, name)

    switchTab: (tab) =>
      if not tab
        return
      @currentTab = tab

      @panel.removeClass('uploadcare-dialog-opened-tabs')

      className = 'uploadcare-dialog-tab'
      @panel.find(".#{className}")
            .removeClass("#{className}_current")
            .filter(".#{className}-#{tab}")
            .addClass("#{className}_current")

      className = 'uploadcare-dialog-tabs-panel'
      @panel.find(".#{className}")
            .removeClass("#{className}_current")
            .filter(".#{className}-#{tab}")
            .addClass("#{className}_current")

      @dfd.notify(tab)

    showTab: (tab) =>
      className = 'uploadcare-dialog-tab'
      @panel.find(".#{className}-#{tab}")
            .removeClass("#{className}_hidden")
      @onTabVisibility.fire(tab, true)

    hideTab: (tab) =>
      if @currentTab == tab
        @switchTab(@__firstVisibleTab())
      className = 'uploadcare-dialog-tab'
      @panel.find(".#{className}-#{tab}")
            .addClass("#{className}_hidden")
      @onTabVisibility.fire(tab, false)

    isTabVisible: (tab) =>
      className = 'uploadcare-dialog-tab'
      not @panel.find(".#{className}-#{tab}")\
            .is(".#{className}_hidden")

    __firstVisibleTab: ->
      for tab in @settings.tabs
        if @isTabVisible(tab)
          return tab

    __welcome: ->
      @addTab('empty-pubkey')
      @switchTab('empty-pubkey')
      for tabName in @settings.tabs
        @__addFakeTab(tabName)
      null

    __addFakeTab: (name) ->
      $('<div>')
        .addClass("uploadcare-dialog-tab uploadcare-dialog-tab-#{name}")
        .addClass('uploadcare-dialog-disabled-tab')
        .attr('title', t("dialog.tabs.names.#{name}"))
        .appendTo(@panel.find('.uploadcare-dialog-tabs'))
