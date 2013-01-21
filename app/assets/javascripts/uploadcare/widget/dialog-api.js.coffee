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
    ns.DialogApi =

      __init: ->
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
        @__setContent dialogContent
        @__open()

      # same as show() but, don't close current content (just detach)
      replace: (dialogContent) ->
        @dialogContent?.detached?()
        @__setContent dialogContent
        @__open()

      __close: ->
        @dialogContent?.closed?()
        @container.fadeOut 'fast'

      __open: ->
        @container.fadeIn 'fast'

      __setContent: (dialogContent) ->
        @dialogContent = dialogContent
        @contentContainer
          .empty()
          .append dialogContent.el()
        dialogContent.always =>
          @__close() if @dialogContent == dialogContent


    $ -> ns.DialogApi.__init()