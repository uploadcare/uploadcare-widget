# = require_self
# = require ./tabs/base-file-tab
# = require ./tabs/file-tab
# = require ./tabs/url-tab
# = require ./tabs/remote-tab
# = require ./tabs/preview-tab

{
  namespace,
  utils,
  files,
  jQuery: $
} = uploadcare

{t} = uploadcare.locale
{tpl} = uploadcare.templates

namespace 'uploadcare', (ns) ->

  currentDialogPr = null

  ns.isDialogOpened = -> 
    currentDialogPr != null

  ns.closeDialog = ->
    currentDialogPr?.reject()

  ns.openDialog = (currentFiles, tab, settings) ->
    if $.isPlainObject(tab)
      settings = tab
      tab = null

    ns.closeDialog()
    settings = utils.buildSettings settings
    dialog = new Dialog(settings, currentFiles, tab)
    return currentDialogPr = dialog.publicPromise()
      .always ->
        currentDialogPr = null

  class Dialog
    constructor: (@settings, currentFiles, tab) ->

      if currentFiles
        @settings = $.extend {}, @settings, {previewStep: true}

      @dfd = $.Deferred()
      @dfd.always => 
        @__closeDialog()

      @content = $(tpl('dialog'))
        .hide()
        .appendTo('body')
      
      @__initFileGroup()
      @__bind()
      @__prepareTabs()
      @switchTab(tab || @settings.tabs[0])

      unless $.isArray(currentFiles)
        currentFiles = [currentFiles]
      @fileGroup.add(file) for file in currentFiles

      @__updateFirstTab()
      @content.fadeIn('fast')

    publicPromise: ->
      promise = @dfd.promise()
      promise.reject = @dfd.reject
      return promise

    __initFileGroup: ->
      @fileGroup = new files.FileGroup(@settings)
      @fileGroup.onFileAdded.add =>
        if @settings.previewStep
          @__showTab 'preview'
          @switchTab 'preview'
      @fileGroup.onFileRemoved.add =>
        if @fileGroup.get().length == 0
          @__hideTab 'preview'
      @dfd.fail @fileGroup.cancel

    # TMP
    __fileForWidget: ->
      if @settings.multiple
        @fileGroup.save()
        @fileGroup.asSingle() 
      else 
        @fileGroup.get()[0]
    __resolve: =>
      @dfd.resolve @__fileForWidget()
    __reject: =>
      @dfd.reject  @__fileForWidget()

    __bind: ->
      isPartOfWindow = (el) ->
        $(el).is('.uploadcare-dialog-panel') or
          $(el).parents('.uploadcare-dialog-panel').size()

      @content.on 'click', (e) =>
        @__reject() unless isPartOfWindow(e.target) or $(e.target).is('a')

      $(window).on 'keydown', (e) =>
        @__reject() if e.which == 27 # Escape

      @content.on 'click', '@uploadcare-dialog-switch-tab', (e) =>
        @switchTab $(e.target).data('tab')

    __prepareTabs: ->
      @tabs = {}

      @tabs.preview = @addTab 'preview'
      @tabs.preview.setGroup @fileGroup
      @tabs.preview.onDone.add @__resolve
      @tabs.preview.onBack.add => @fileGroup.removeAll()
      @__hideTab 'preview'

      for tabName in @settings.tabs when tabName not of @tabs
        @tabs[tabName] = @addTab(tabName)
        if @tabs[tabName]
          @tabs[tabName].onSelected.add (fileType, data) =>
            if @settings.multiple
              @fileGroup.add(file) for file in ns.filesFrom(fileType, data, @settings)
            else
              @fileGroup.removeAll()
              @fileGroup.add(ns.fileFrom(fileType, data, @settings))
        else
          throw new Error("No such tab: #{tabName}")

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

      $('<div>')
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
      
      return tab

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

