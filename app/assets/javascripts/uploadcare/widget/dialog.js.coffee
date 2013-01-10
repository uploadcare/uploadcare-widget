# = require_self
# = require ./tabs/file-tab
# = require ./tabs/url-tab
# = require ./tabs/remote-tab

uploadcare.whenReady ->
  {
    namespace,
    utils,
    files,
    jQuery: $
  } = uploadcare

  {t} = uploadcare.locale
  {tpl} = uploadcare.templates

  namespace 'uploadcare.widget', (ns) ->
    ns.showDialog = (settings = {}) ->
      settings = utils.buildSettings settings

      $ .Deferred ->
          $.extend this, dialogUiMixin

          @settings = settings

          @__createDialog()

          @always @__closeDialog
        .pipe(files.toFiles, -> 'dialog was closed')
        .promise()


    dialogUiMixin =
      __createDialog: ->
        @content = $(tpl('dialog'))
          .hide()
          .appendTo('body')

        @content.on 'click', (e) =>
          e.stopPropagation()
          @reject() if e.target == e.currentTarget

        closeButton = @content.find('@uploadcare-dialog-close')
        closeButton.on 'click', => @reject()

        $(window).on 'keydown', (e) =>
          @reject() if e.which == 27 # Escape

        @__prepareTabs()

        @content.fadeIn('fast')

      __closeDialog: ->
        @content.fadeOut 'fast', => @content.off().remove()

      __prepareTabs: ->
        @tabs = {}
        for tabName in @settings.tabs when tabName not of @tabs
          @tabs[tabName] = @__addTab(tabName)
          throw "No such tab: #{tabName}" unless @tabs[tabName]

        @__switchTab(@settings.tabs[0])

      __addTab: (name) ->
        {tabs} = uploadcare.widget

        tabCls = switch name
          when 'file' then tabs.FileTab
          when 'url' then tabs.UrlTab
          when 'facebook' then tabs.RemoteTabFor 'facebook'
          when 'dropbox' then tabs.RemoteTabFor 'dropbox'
          when 'gdrive' then tabs.RemoteTabFor 'gdrive'
          when 'instagram' then tabs.RemoteTabFor 'instagram'

        return false if not tabCls

        tab = new tabCls this, @settings, => @resolve.apply(this, arguments)

        if tab
          $('<li>')
            .addClass("uploadcare-dialog-tab-#{name}")
            .attr('title', t("tabs.#{name}.title"))
            .on('click', => @__switchTab(name))
            .appendTo(@content.find('.uploadcare-dialog-tabs'))
          panel = $('<div>')
            .hide()
            .addClass('uploadcare-dialog-tabs-panel')
            .addClass("uploadcare-dialog-tabs-panel-#{name}")
            .appendTo(@content.find('.uploadcare-dialog-body'))
          panel.append(tpl("tab-#{name}"))
          tab.setContent(panel)
        tab

      __switchTab: (@currentTab) ->
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

        @notify @currentTab
