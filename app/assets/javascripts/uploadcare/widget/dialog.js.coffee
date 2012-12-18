# = require ./templates/dialog
# = require ./templates/tab-file
# = require ./templates/tab-url

# = require_self
# = require ./tabs/file-tab
# = require ./tabs/url-tab
# = require ./tabs/remote-tab

uploadcare.whenReady ->
  {
    namespace,
    utils,
    jQuery: $
  } = uploadcare

  {t} = uploadcare.locale

  namespace 'uploadcare.widget', (ns) ->
    class ns.Dialog
      constructor: (settings, @tabNames, @callback) ->
        @settings = utils.buildSettings settings

      open: ->
        @content = $(JST['uploadcare/widget/templates/dialog']())
          .hide()
          .appendTo('body')

        closeCallback = => @close()

        @content.on 'click', (e) ->
          e.stopPropagation()
          closeCallback(e) if e.target == e.currentTarget

        closeButton = @content.find('@uploadcare-dialog-close')
        closeButton.on 'click', closeCallback

        $(window).on 'keydown', (e) ->
          closeCallback(e) if e.which == 27 # Escape

        @tabs = {}
        for tabName in @tabNames when tabName not of @tabs
          tab = @addTab(tabName)
          throw "No such tab: #{tabName}" unless tab
          @tabs[tabName] = tab

        @switchTo(@tabNames[0])
        @content.fadeIn('fast')
        $(this).trigger('uploadcare.dialog.open', @currentTab or '')

      close: ->
        @content.fadeOut('fast', -> $(this).off().remove())
        $(this).trigger('uploadcare.dialog.close')

      switchTo: (@currentTab) ->
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

        $(this).trigger('uploadcare.dialog.switchtab', @currentTab)

      fileSelected: (args...) ->
        @callback(args...)
        @close()

      addTab: (name) ->
        {tabs} = uploadcare.widget

        selectedFileCallback = @fileSelected.bind(this)
        
        tabCls = switch name
          when 'file' then tabs.FileTab
          when 'url' then tabs.UrlTab
          when 'facebook' then tabs.RemoteTab('facebook')
          when 'instagram' then tabs.RemoteTab('instagram')
          else false

        return false if not tabCls

        tab = new tabCls(this, @settings, selectedFileCallback)

        if tab
          $('<li>')
            .addClass("uploadcare-dialog-tab-#{name}")
            .attr('title', t("tabs.#{name}"))
            .on('click', => @switchTo(name))
            .appendTo(@content.find('.uploadcare-dialog-tabs'))
          panel = $('<div>')
            .hide()
            .addClass('uploadcare-dialog-tabs-panel')
            .addClass("uploadcare-dialog-tabs-panel-#{name}")
            .appendTo(@content.find('.uploadcare-dialog-body'))
          tpl = "uploadcare/widget/templates/tab-#{name}"
          panel.append(JST[tpl]()) if tpl of JST
          tab.setContent(panel)
        tab
