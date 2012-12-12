uploadcare.whenReady ->
  {
    namespace,
    utils,
    jQuery: $
  } = uploadcare

  {dialog, files} = uploadcare.widget

  namespace 'uploadcare.widget.tabs', (ns) ->
    class ns.RemoteTab
      constructor: (@widget, @service) ->

      setContent: (@content) ->
        handler = (e, tabName) =>
          if tabName == @service
            @createIframe()

        $(dialog.currentDialog).on('uploadcare.dialog.open', handler)
        $(dialog.currentDialog).on('uploadcare.dialog.switchtab', handler)

      createIframe: ->
        unless @iframe
          @windowId = utils.uuid()
          @createWatcher()

          src = "#{@widget.settings.socialBase}/window/#{@windowId}/#{@service}/"
          @iframe = $('<iframe>')
            .attr('src', src)
            .css
              width: '100%'
              height: '100%'
              border: 0
            .appendTo(@content)

      createWatcher: ->
        unless @watcher
          @watcher = new utils.pubsub.PubSub @widget, 'window', @windowId
          $(@watcher).on('done', (e, state) =>
            @cleanup()
            dialog.close(files.url(state.url))
          )
          @watcher.watch()

      cleanup: ->
        @watcher.stop()
        @watcher = null
        @iframe.remove()
        @iframe = null
