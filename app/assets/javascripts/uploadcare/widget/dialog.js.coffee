# = require ./tabs/base-source-tab
# = require ./tabs/file-tab
# = require ./tabs/url-tab
# = require ./tabs/remote-tab
# = require ./tabs/base-preview-tab
# = require ./tabs/preview-tab
# = require ./tabs/preview-tab-multiple
# = require ./tabs/static-tab

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
    dialog.on 'click', (e) ->
      # handler can be called after element detached (close button)
      if not $.contains(document.documentElement, e.target)
        return

      showStoppers = '.uploadcare-dialog-panel, a'
      if $(e.target).is(showStoppers) or $(e.target).parents(showStoppers).length
        return

      ns.closeDialog()

    currentDialogPr = ns.openPanel(dialog.find('.uploadcare-dialog-placeholder'),
                                   files, tab, settings)

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

    settings = s.build settings
    panel = new Panel(settings, placeholder, files, tab).publicPromise()

    filter = (files) ->
      if settings.multiple then uploadcare.FileGroup(files, settings) else files[0]

    promise = utils.then(panel, filter, filter)
    promise.reject = panel.reject
    promise


  registeredTabs = {}

  ns.registerTab = (tabName, constructor) ->
    registeredTabs[tabName] = constructor

  ns.registerTab('file', tabs.FileTab)
  ns.registerTab('url', tabs.UrlTab)
  ns.registerTab('facebook', tabs.RemoteTabFor 'facebook')
  ns.registerTab('dropbox', tabs.RemoteTabFor 'dropbox')
  ns.registerTab('gdrive', tabs.RemoteTabFor 'gdrive')
  ns.registerTab('instagram', tabs.RemoteTabFor 'instagram')
  ns.registerTab('vk', tabs.RemoteTabFor 'vk')
  ns.registerTab('evernote', tabs.RemoteTabFor 'evernote')
  ns.registerTab('box', tabs.RemoteTabFor 'box')
  ns.registerTab('skydrive', tabs.RemoteTabFor 'skydrive')
  ns.registerTab('welcome', tabs.StaticTabWith 'welcome')
  ns.registerTab 'preview', (tabPanel, tabButton, apiForTab, settings) ->
    tabCls = if settings.multiple then tabs.PreviewTabMultiple else tabs.PreviewTab
    new tabCls(tabPanel, tabButton, apiForTab, settings)

  class Panel
    constructor: (@settings, placeholder, files, tab) ->
      @dfd = $.Deferred()
      @dfd.always @__closePanel

      sel = '.uploadcare-dialog-panel'
      @content = $(tpl('panel'))
      @panel = @content.find(sel).add(@content.filter(sel));
      @placeholder = $(placeholder)
      @placeholder.replaceWith(@content)

      if @settings.multiple
        @panel.addClass('uploadcare-dialog-multiple')

      # files collection
      @files = new utils.CollectionOfPromises(files)

      @files.onRemove.add =>
        if @files.length() == 0
          @__hideTab 'preview'

      @tabs = {}

      if @settings.publicKey
        @__prepareTabs(tab)
      else
        @__welcome()

    publicPromise: ->
      promise = @dfd.promise()
      promise.reject = @__reject
      return promise

    # (fileType, data) or ([fileObject, fileObject])
    addFiles: (files, data) =>
      if data
        # 'files' is actually file type
        files = ns.filesFrom(files, data, @settings)

      unless @settings.multiple
        @files.clear()

      for file in files
        @files.add file

      if @settings.previewStep
        @__showTab 'preview'
        unless @settings.multiple
          @switchTab 'preview'
      else
        @__resolve()

    apiForTab: (tabName) ->
      onSwitched = $.Callbacks()
      @dfd.progress (name) ->
        onSwitched.fire name, (name is tabName)

      # return
      fileColl: @files
      onSwitched: onSwitched
      addFiles: @addFiles
      done: @__resolve
      switchTab: @switchTab

    __resolve: =>
      @dfd.resolve @files.get()

    __reject: =>
      @dfd.reject @files.get()

    __prepareTabs: (tab) ->
      @addTab 'preview'
      for tabName in @settings.tabs
        @addTab tabName

      if @files.length()
        @__showTab 'preview'
        @switchTab 'preview'
      else
        @__hideTab 'preview'
        @switchTab(tab || @settings.tabs[0])

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
        .appendTo(@panel)

      tabButton = $('<div>')
        .addClass("uploadcare-dialog-tab")
        .addClass("uploadcare-dialog-tab-#{name}")
        .attr('title', t("dialog.tabs.names.#{name}"))
        .on('click', =>
          if name is @currentTab
            @panel.toggleClass('uploadcare-dialog-opened-tabs')
          else
            @switchTab(name)
        )
        .appendTo(@panel.find('.uploadcare-dialog-tabs'))

      @tabs[name] = new TabCls tabPanel, tabButton, @apiForTab(name), @settings

    __addFakeTab: (name) ->
      $('<div>')
        .addClass("uploadcare-dialog-tab uploadcare-dialog-tab-#{name}")
        .addClass('uploadcare-dialog-disabled-tab')
        .attr('title', t("tabs.#{name}.title"))
        .appendTo(@panel.find('.uploadcare-dialog-tabs'))

    switchTab: (@currentTab) =>
      @panel.removeClass('uploadcare-dialog-opened-tabs')

      className = 'uploadcare-dialog-tab'
      @panel.find(".#{className}")
            .removeClass("#{className}_current")
            .filter(".#{className}-#{@currentTab}")
            .addClass("#{className}_current")

      className = 'uploadcare-dialog-tabs-panel'
      @panel.find(".#{className}")
            .removeClass("#{className}_current")
            .filter(".#{className}-#{@currentTab}")
            .addClass("#{className}_current")

      @dfd.notify @currentTab

    __showTab: (tab) ->
      className = 'uploadcare-dialog-tab'
      @panel.find(".#{className}-#{tab}")
            .removeClass("#{className}_hidden")

    __hideTab: (tab) ->
      if @currentTab == tab
        @switchTab @settings.tabs[0]
      className = 'uploadcare-dialog-tab'
      @panel.find(".#{className}-#{tab}")
            .addClass("#{className}_hidden")

    __welcome: ->
      @addTab('welcome')
      for tabName in @settings.tabs
        @__addFakeTab tabName
      @switchTab('welcome')
