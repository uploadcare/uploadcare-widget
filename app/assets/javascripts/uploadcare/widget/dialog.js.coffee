# = require_self
# = require ./tabs/base-file-tab
# = require ./tabs/file-tab
# = require ./tabs/url-tab
# = require ./tabs/remote-tab
# = require ./tabs/preview-tab

uploadcare.whenReady ->
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

    ns.openDialog = (settings = {}, currentFile = null) ->
      ns.closeDialog()
      settings = utils.buildSettings settings
      dialog = new Dialog(settings, currentFile)
      return currentDialogPr = dialog.publicPromise()
        .always ->
          currentDialogPr = null

    class Dialog
      constructor: (@settings, currentFile) ->
        @dfd = $.Deferred()
        @dfd.always => 
          @__closeDialog()

        @content = $(tpl('dialog'))
          .hide()
          .appendTo('body')
        
        @__bind()
        @__prepareTabs()
        @__setFile currentFile

        @content.fadeIn('fast')

      publicPromise: ->
        promise = @dfd.promise()
        promise.reject = @dfd.reject
        return promise

      __bind: ->
        reject = =>
          @dfd.reject(@currentFile)

        @content.on 'click', (e) ->
          e.stopPropagation()
          reject() if e.target == e.currentTarget

        @content.find('@uploadcare-dialog-close').on 'click', reject

        $(window).on 'keydown', (e) ->
          reject() if e.which == 27 # Escape

      __prepareTabs: ->
        @tabs = {}

        @tabs.preview = @addTab 'preview'
        @tabs.preview.onDone.add =>
          @dfd.resolve @currentFile
        @tabs.preview.onBack.add =>
          @__setFile null

        for tabName in @settings.tabs when tabName not of @tabs
          @tabs[tabName] = @addTab(tabName)
          if @tabs[tabName]
            @tabs[tabName].onSelected.add (fileType, data) =>
              @__setFile ns.fileFrom @settings, fileType, data
          else
            throw "No such tab: #{tabName}"

        @switchTab(@settings.tabs[0])

      __closeDialog: ->
        @content.fadeOut 'fast', => @content.off().remove()

      __setFile: (@currentFile) ->
        if @currentFile
          @currentFile.startUpload()
          @tabs.preview.setFile @currentFile
          @__showTab 'preview'
          @switchTab 'preview'
        else
          @__hideTab 'preview'

      addTab: (name) ->
        {tabs} = uploadcare.widget

        tabCls = switch name
          when 'file' then tabs.FileTab
          when 'url' then tabs.UrlTab
          when 'facebook' then tabs.RemoteTabFor 'facebook'
          # when 'dropbox' then tabs.RemoteTabFor 'dropbox'
          when 'gdrive' then tabs.RemoteTabFor 'gdrive'
          when 'instagram' then tabs.RemoteTabFor 'instagram'
          when 'preview' then tabs.PreviewTab

        return false if not tabCls

        tab = new tabCls @dfd.promise(), @settings

        $('<li>')
          .addClass("uploadcare-dialog-tab-#{name}")
          .attr('title', t("tabs.#{name}.title"))
          .on('click', => @switchTab(name))
          .appendTo(@content.find('.uploadcare-dialog-tabs'))
        
        tab.setContent $('<div>')
          .hide()
          .addClass('uploadcare-dialog-tabs-panel')
          .addClass("uploadcare-dialog-tabs-panel-#{name}")
          .append(tpl("tab-#{name}"))
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
          .find('> div')
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

