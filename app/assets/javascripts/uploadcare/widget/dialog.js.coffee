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
    jQuery: $
  } = uploadcare

  {t} = uploadcare.locale

  namespace 'uploadcare.widget.dialog', (ns) ->
    ns.open = (widget) ->
      unless ns.currentDialog
        ns.close()
        ns.currentDialog = new Dialog(widget)
        ns.currentDialog.open()

    ns.close = (file) ->
      if ns.currentDialog
        ns.currentDialog.close()
        ns.currentDialog.widget.upload(file) if file?
        ns.currentDialog = null

    ns.isVisible = -> ns.currentDialog?.isVisible()

    class Dialog
      constructor: (@widget) ->
        @content = $(JST['uploadcare/widget/templates/dialog']())
          .hide()
          .appendTo('body')

        closeCallback = (e) =>
          ns.close() if @isVisible()
          false

        @content.on 'click', (e) ->
          e.stopPropagation()
          closeCallback(e) if e.target == e.currentTarget

        closeButton = @content.find('@uploadcare-dialog-close')
        closeButton.on 'click', closeCallback

        $(window).on 'keydown', (e) ->
          closeCallback(e) if e.which == 27 # Escape

      open: ->
        @tabs = {}
        @tabOrder = []
        for tabName in @widget.tabs when tabName not of @tabs
          tab = @addTab(tabName)
          if tab
            @tabs[tabName] = tab
            @tabOrder.push(tabName)

        @switchTo(@tabOrder[0]) if @tabOrder.length > 0
        @content.fadeIn('fast')
        $(this).trigger('uploadcare.dialog.open', @currentTab or '')

      close: -> @content.fadeOut('fast', -> $(this).off().remove())

      isVisible: -> not @content.is(':hidden')

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

      addTab: (name) ->
        {tabs} = uploadcare.widget
        tab = switch name
          when 'file' then new tabs.FileTab(@widget)
          when 'url' then new tabs.UrlTab(@widget)
          when 'facebook' then new tabs.RemoteTab(@widget, 'facebook')
          when 'instagram' then new tabs.RemoteTab(@widget, 'instagram')
          else false
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
