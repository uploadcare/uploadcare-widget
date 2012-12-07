uploadcare.whenReady ->
  {
    namespace,
    utils,
    jQuery: $
  } = uploadcare

  namespace 'uploadcare.widget.adapters', (ns) ->
    class ns.RemoteAdapter extends ns.BaseAdapter
      @registerAs 'instagram'
      constructor: (@widget, @service) ->
        super @widget

        handler = (e, tabName) =>
          if tabName == @service
            @createIframe()

        $(@widget.dialog).on('uploadcare.dialog.open', handler)
        $(@widget.dialog).on('uploadcare.dialog.switchtab', handler)

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
            .appendTo(@tab)

      createWatcher: ->
        unless @watcher
          @watcher = new utils.pubsub.PubSub @widget, 'window', @windowId
          $(@watcher).on('done', (e, state) =>
            @widget.upload('url', state.url)
            @cleanup()
            @widget.dialog.close()
          )
          @watcher.watch()

      cleanup: ->
        @watcher.stop()
        @watcher = null
        @iframe.remove()
        @iframe = null
