uploadcare.whenReady ->
  {
    namespace,
    utils,
    jQuery: $
  } = uploadcare

  namespace 'uploadcare.widget.tabs', (ns) ->
    class ns.RemoteTab
      constructor: (@dialog, @widget, @service) ->

      setContent: (@content) ->
        handler = (e, tabName) =>
          if tabName == @service
            @createIframe()

        $(@widget.dialog()).on('uploadcare.dialog.open', handler)
        $(@widget.dialog()).on('uploadcare.dialog.switchtab', handler)

      createIframe: ->
        unless @iframe
          @windowId = utils.uuid()
          @createWatcher()

          src = "#{@widget.settings.socialBase}/window/#{@windowId}/#{@service}"
          @iframe = $('<iframe>')
            .attr('src', src)
            .css
              width: '100%'
              height: '100%'
              border: 0
            .appendTo(@content)

      createWatcher: ->
        unless @watcher
          @watcher = new utils.pubsub.PubSub @widget.settings, 'window', @windowId
          $(@watcher).on('done', (e, state) =>
            @cleanup()
            @widget.closeDialog()
            @widget.upload('url', state.url)
          )
          @watcher.watch()

      cleanup: ->
        @watcher.stop()
        @watcher = null
        @iframe.remove()
        @iframe = null
