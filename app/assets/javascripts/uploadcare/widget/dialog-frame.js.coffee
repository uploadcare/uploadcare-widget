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

    # The global dialog frame, that can show any `dialogContent`
    ns.__dialogFrame =

      __init: ->
        @__opened = false
        @__render()
        @__bind()

      __render: ->
        @container = $ tpl 'dialog-base'
        @contentContainer = @container.find '@uploadcare-dialog-body'
        @container.hide().appendTo('body')

      __bind: ->
        @container.on 'click', (e) =>
          e.stopPropagation()
          @__close() if e.target == e.currentTarget
        @container.find('@uploadcare-dialog-close')
          .on 'click', => @__close()
        $(window).on 'keydown', (e) =>
          @__close() if e.which == 27 # Escape

      show: (dialogContent) ->
        @dialogContent?.closed?()
        @__detach()
        @__setContent dialogContent
        @__open()

      isOpened: ->
        @__opened

      __close: ->
        @__opened = false
        @dialogContent?.closed?()
        @__detach()
        @container.fadeOut 'fast'

      __closeLater: ->
        setTimeout ( => 
          @__close() unless @dialogContent
        ), 100

      __open: ->
        @__opened = true
        @container.fadeIn 'fast'

      __detach: ->
        @dialogContent?.el().detach()
        @dialogContent = null

      __setContent: (dialogContent) ->
        @dialogContent = dialogContent
        @contentContainer.append dialogContent.el()
        unless dialogContent.__alreadyWasHere
          dialogContent.__alreadyWasHere = true
          dialogContent.__detachFromFrame = =>
            if @dialogContent == dialogContent
              @__detach()
              @__closeLater()
          dialogContent.always dialogContent.__detachFromFrame
            

    $ -> ns.__dialogFrame.__init()