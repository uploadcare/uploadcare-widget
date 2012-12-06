# = require ./templates/dialog
# = require ./templates/tab-file
# = require ./templates/tab-url

uploadcare.whenReady ->
  {
    namespace,
    jQuery: $
  } = uploadcare

  {t} = uploadcare.locale

  namespace 'uploadcare.widget.dialog', (ns) ->
    class ns.Dialog
      constructor: ->
        @content = $(JST['uploadcare/widget/templates/dialog']())
          .hide()
          .appendTo('body')

        closeCallback = (e) =>
          @close() if @isVisible()
          false

        @content.on 'click', (e) ->
          e.stopPropagation()
          closeCallback(e) if e.target == e.currentTarget

        closeButton = @content.find('@uploadcare-dialog-close')
        closeButton.on 'click', closeCallback

        $(window).on 'keydown', (e) ->
          closeCallback(e) if e.which == 27 # Escape

      open: ->
        @content.find('input[type=text]')
          .val('')
          .change()
        @content.fadeIn('fast')

        $(this).trigger('uploadcare.dialog.open', [@currentTab or ''])

      close: -> @content.fadeOut('fast')

      isVisible: ->
        not @content.is(':hidden')

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
            .filter("#uploadcare-dialog-tab-#{@currentTab}")
              .show()

        $(this).trigger('uploadcare.dialog.switchtab', [@currentTab])

      addTab: (name) ->
        tab = $('<li>')
          .addClass("uploadcare-dialog-tab-#{name}")
          .attr('title', t("tabs.#{name}"))
          .on('click', => @switchTo(name))
          .appendTo(@content.find('.uploadcare-dialog-tabs'))
        panel = $('<div>')
          .hide()
          .addClass('uploadcare-dialog-tabs-panel')
          .attr('id', "uploadcare-dialog-tab-#{name}")
          .appendTo(@content.find('.uploadcare-dialog-body'))
        tpl = "uploadcare/widget/templates/tab-#{name}"
        panel.append(JST[tpl]()) if JST.hasOwnProperty(tpl)
        panel

    ns.defaultDialog = new ns.Dialog()
