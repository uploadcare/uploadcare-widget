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

    $('body').addClass(openedClass)
    dialog = $(tpl('dialog')).hide().appendTo('body').fadeIn('fast')
    dialog.on 'click', (e) ->
      showStopper = $(e.target).parents().addBack().filter('.uploadcare-dialog-panel, a')
      if not showStopper.length
        ns.closeDialog()

    currentDialogPr = ns.openPanel(dialog.find('.uploadcare-dialog-placeholder'),
                                   files, tab, settings)
    currentDialogPr.always ->
      $('body').removeClass(openedClass)
      currentDialogPr = null
      dialog.fadeOut 'fast', ->
        dialog.remove()


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

      @content = $(tpl('panel'))
      @placeholder = $(placeholder)
      @placeholder.replaceWith(@content)

      if @settings.multiple
        @content.addClass('uploadcare-dialog-multiple')

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
      avalibleTabs: @settings.tabs
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
      @content.replaceWith(@placeholder)

    addTab: (name) ->

      if name of @tabs
        return

      TabCls = registeredTabs[name]

      if not TabCls
        throw new Error("No such tab: #{name}")

      tabPanel = $('<div>')
        .hide()
        .addClass('uploadcare-dialog-tabs-panel')
        .addClass("uploadcare-dialog-tabs-panel-#{name}")
        .appendTo(@content.find('.uploadcare-dialog-panel'))

      tabButton = $('<div>')
        .addClass("uploadcare-dialog-tab uploadcare-dialog-tab-#{name}")
        .attr('title', t("tabs.#{name}.title"))
        .on('click', => @switchTab(name))
        .appendTo(@content.find('.uploadcare-dialog-tabs'))

      @tabs[name] = new TabCls tabPanel, tabButton, @apiForTab(name), @settings

    __addFakeTab: (name) ->
      $('<div>')
        .addClass("uploadcare-dialog-tab uploadcare-dialog-tab-#{name}")
        .addClass('uploadcare-dialog-disabled-tab')
        .attr('title', t("tabs.#{name}.title"))
        .appendTo(@content.find('.uploadcare-dialog-tabs'))

    switchTab: (@currentTab) =>
      @content.find('.uploadcare-dialog-panel')
        .find('.uploadcare-dialog-selected-tab')
          .removeClass('uploadcare-dialog-selected-tab')
          .end()
        .find(".uploadcare-dialog-tab-#{@currentTab}")
          .addClass('uploadcare-dialog-selected-tab')
          .end()
        .find('.uploadcare-dialog-tabs-panel')
          .hide()
          .filter(".uploadcare-dialog-tabs-panel-#{@currentTab}")
            .show()
      @dfd.notify @currentTab

    __showTab: (tab) ->
      @content.find(".uploadcare-dialog-tab-#{tab}").show()

    __hideTab: (tab) ->
      if @currentTab == tab
        @switchTab @settings.tabs[0]
      @content.find(".uploadcare-dialog-tab-#{tab}").hide()

    __welcome: ->
      @addTab('welcome')
      for tabName in @settings.tabs
        @__addFakeTab tabName
      @switchTab('welcome')
