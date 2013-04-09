# = require_self
# = require ./tabs/base-file-tab
# = require ./tabs/file-tab
# = require ./tabs/url-tab
# = require ./tabs/remote-tab
# = require ./tabs/preview-tab

{
  namespace,
  utils,
  locale: {t},
  templates: {tpl},
  jQuery: $,
  ui: {progress: {Circle}}
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

    if utils.isFileGroup(files)
      files = files.files()

    settings = utils.buildSettings settings
    dialog = new Dialog(settings, files, tab)

    currentDialogPr = dialog.publicPromise()
      .always ->
        currentDialogPr = null

    filter = if settings.multiple
      (files) ->
        if files and files.length
          uploadcare.fileGroupFrom('files', files, settings)
        else
          null
    else
      (files) -> files[0]

    promise = utils.then(currentDialogPr, filter, filter)
    promise.reject = currentDialogPr.reject

    return promise

  class Dialog
    constructor: (@settings, files, tab) ->

      if files 
        unless $.isArray(files)
          files = [files]
      else
        files = []

      if files.length
        @settings = $.extend {}, @settings, {previewStep: true}

      @dfd = $.Deferred()
      @dfd.always => 
        @__closeDialog()

      @content = $(tpl('dialog'))
        .hide()
        .appendTo('body')
      
      @files = new utils.CollectionOfPromises()
      @files.onAdd.add =>
        if @settings.previewStep
          @__showTab 'preview'
          @switchTab 'preview'
        else
          @__resolve()
      @files.onRemove.add =>
        if @files.length() == 0
          @__hideTab 'preview'

      @__bind()
      @__prepareTabs()
      @switchTab(tab || @settings.tabs[0])
      
      @files.add(file) for file in files

      @__updateFirstTab()

      @content.fadeIn('fast')

    publicPromise: ->
      promise = @dfd.promise()
      promise.reject = @dfd.reject
      return promise

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

      @content.on 'click', '@uploadcare-dialog-switch-tab', (e) =>
        @switchTab $(e.target).data('tab')

    __prepareTabs: ->
      @tabs = {}

      @__preparePreviewTab()

      for tabName in @settings.tabs when tabName not of @tabs
        @tabs[tabName] = @addTab(tabName).tab
        if @tabs[tabName]
          @tabs[tabName].onSelected.add (fileType, data) =>
            if @settings.multiple
              @files.add(file) for file in ns.filesFrom(fileType, data, @settings)
            else
              @files.clear()
              @files.add(ns.fileFrom(fileType, data, @settings))
        else
          throw new Error("No such tab: #{tabName}")

    __preparePreviewTab: ->
      {tabButton, tab: @tabs.preview} = @addTab 'preview'
      @tabs.preview.setFiles @files
      @tabs.preview.onDone.add @__resolve
      @tabs.preview.onBack.add => @files.clear()
      @__hideTab 'preview'

      size = 28
      circleEl = $('<div>')
        .appendTo(tabButton)
        .css(
          position: 'absolute'
          top: '50%'
          left: '50%'
          marginTop: size / -2
          marginLeft: size / -2
          width: size
          height: size
        )

      circleDf = $.Deferred()

      update = =>
        infos = @files.lastProgresses()
        progress = 0
        for progressInfo in infos
          progress += (progressInfo?.progress or 0) / infos.length
        circleDf.notify {progress}

      @files.onAnyProgress.add update
      @files.onAdd.add update
      @files.onRemove.add update

      new Circle(circleEl).listen circleDf.promise(), 'progress'

    __closeDialog: ->
      @content.fadeOut 'fast', => @content.off().remove()

    addTab: (name) ->
      {tabs} = uploadcare.widget

      tabCls = switch name
        when 'file' then tabs.FileTab
        when 'url' then tabs.UrlTab
        when 'facebook' then tabs.RemoteTabFor 'facebook'
        when 'dropbox' then tabs.RemoteTabFor 'dropbox'
        when 'gdrive' then tabs.RemoteTabFor 'gdrive'
        when 'instagram' then tabs.RemoteTabFor 'instagram'
        when 'preview' then tabs.PreviewTab

      return false if not tabCls

      tab = new tabCls @dfd.promise(), @settings

      tabButton = $('<div>')
        .addClass("uploadcare-dialog-tab uploadcare-dialog-tab-#{name}")
        .attr('title', t("tabs.#{name}.title"))
        .on('click', => @switchTab(name))
        .appendTo(@content.find('.uploadcare-dialog-tabs'))
      
      tab.setContent $('<div>')
        .hide()
        .addClass('uploadcare-dialog-tabs-panel')
        .addClass("uploadcare-dialog-tabs-panel-#{name}")
        .append(tpl("tab-#{name}", {avalibleTabs: @settings.tabs}))
        .appendTo(@content.find('.uploadcare-dialog-body'))
      
      return {tab, tabButton}

    switchTab: (@currentTab) ->
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

