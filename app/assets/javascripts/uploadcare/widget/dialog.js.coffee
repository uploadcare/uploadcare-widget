# = require_self
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
  ui: {progress: {Circle}}
  files,
  settings: s,
  jQuery: $
} = uploadcare

namespace 'uploadcare', (ns) ->

  currentDialogPr = null

  ns.isDialogOpened = ->
    currentDialogPr != null

  ns.closeDialog = ->
    currentDialogPr?.reject()

  # files - null, or File object, or array of File objects, or FileGroup object
  # result - File objects or FileGroup object (depends on settings.multiple)
  ns.openDialog = (files, tab, settings) ->
    if $.isPlainObject(tab)
      settings = tab
      tab = null

    ns.closeDialog()

    if not files
      files = []
    else if utils.isFileGroup(files)
      files = files.files()
    else if not $.isArray(files)
      files = [files]

    settings = s.build settings
    dialog = new Dialog(settings, files, tab)

    currentDialogPr = dialog.publicPromise()
      .always ->
        currentDialogPr = null

    filter = (files) ->
      if settings.multiple then uploadcare.FileGroup(files, settings) else files[0]

    promise = utils.then(currentDialogPr, filter, filter)
    promise.reject = currentDialogPr.reject

    return promise

  class Dialog
    constructor: (@settings, files, tab, @validators=[]) ->
      @dfd = $.Deferred()
      @dfd.always =>
        @__closeDialog()

      @content = $(tpl('dialog'))
        .hide()
        .appendTo('body')

      if @settings.multiple
        @content.addClass('uploadcare-dialog-multiple')

      # files collection
      @files = new utils.CollectionOfPromises()

      @files.onRemove.add =>
        if @files.length() == 0
          @__hideTab 'preview'

      @__bind()
      @tabs = {}

      # validators
      if @settings.imagesOnly
        @settings.imagesOnly = false
        @validators.push (info) =>
          if not info.isImage
            throw new Error('image')

      if @settings.publicKey
        @addFiles(files)
        @__prepareTabs(tab)
      else
        @__welcome()

      @__updateFirstTab()

      @content.fadeIn('fast')

    publicPromise: ->
      promise = @dfd.promise()
      promise.reject = @dfd.reject
      return promise

    # (fileType, data) or ([fileObject, fileObject])
    addFiles: (files, data) =>
      if data
        # 'files' is actually file type
        files = ns.filesFrom(files, data, @settings)

      unless @settings.multiple
        @files.clear()

      for file in files
        @files.add file.then @__validationFilter

      if @settings.previewStep
        @__showTab 'preview'
        unless @settings.multiple
          @switchTab 'preview'
      else
        @__resolve()

    __validationFilter: (info) =>
      try
        for validator in @validators
            validator(info)
        info
      catch err
        $.Deferred().reject(err.message, info)

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

    __bind: ->
      panel = @content.find('.uploadcare-dialog-panel')

      isPartOfWindow = (el) ->
        $(el).is(panel) or $.contains(panel.get(0), el)

      @content.on 'click', (e) =>
        @__reject() unless !utils.inDom(e.target) or isPartOfWindow(e.target) or $(e.target).is('a')

      $(window).on 'keydown', (e) =>
        @__reject() if e.which == 27 # Escape

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

    __closeDialog: ->
      @content.fadeOut 'fast', => @content.off().remove()

    addTab: (name) ->
      {tabs} = uploadcare.widget

      return if name of @tabs

      TabCls = switch name
        when 'file' then tabs.FileTab
        when 'url' then tabs.UrlTab
        when 'facebook' then tabs.RemoteTabFor 'facebook'
        when 'dropbox' then tabs.RemoteTabFor 'dropbox'
        when 'gdrive' then tabs.RemoteTabFor 'gdrive'
        when 'instagram' then tabs.RemoteTabFor 'instagram'
        when 'vk' then tabs.RemoteTabFor 'vk'
        when 'evernote' then tabs.RemoteTabFor 'evernote'
        when 'preview' then (if @settings.multiple then tabs.PreviewTabMultiple else tabs.PreviewTab)
        when 'welcome' then tabs.StaticTabWith 'welcome'

      if not TabCls
        throw new Error("No such tab: #{name}")

      tabPanel = $('<div>')
        .hide()
        .addClass('uploadcare-dialog-tabs-panel')
        .addClass("uploadcare-dialog-tabs-panel-#{name}")
        .appendTo(@content.find('.uploadcare-dialog-body'))

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
      @content.find('.uploadcare-dialog-body')
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

    __updateFirstTab: ->
      # Needs to solve issue with border-radius in CSS
      # (WebKit bug: http://tech.bluesmoon.info/2011/04/overflowhidden-border-radius-and.html)
      className = 'uploadcare-dialog-first-tab'
      @content.find(".#{className}").removeClass className
      @content.find(".uploadcare-dialog-tab").filter( ->
        # :visible selector doesn't work because whole dialog might be hidden
        $(this).css('display') != 'none'
      ).first().addClass className

    __showTab: (tab) ->
      @content.find(".uploadcare-dialog-tab-#{tab}").show()
      @__updateFirstTab()

    __hideTab: (tab) ->
      if @currentTab == tab
        @switchTab @settings.tabs[0]
      @content.find(".uploadcare-dialog-tab-#{tab}").hide()
      @__updateFirstTab()

    __welcome: ->
      @addTab('welcome')
      @__addFakeTab tabName for tabName in @settings.tabs
      @switchTab('welcome')
