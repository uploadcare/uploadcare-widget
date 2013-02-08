uploadcare.whenReady ->
  {
    namespace,
    locale,
    utils,
    jQuery: $
  } = uploadcare

  namespace 'uploadcare.widget.tabs', (ns) ->
    ns.RemoteTabFor = (service) ->
      class RemoteTab extends ns.BaseFileTab

        setContent: (@content) ->

          @dialog.progress (tab) =>
            if tab == service
              @createIframe()

          @dialog.fail =>
            @cleanup()


        createIframe: ->
          unless @iframe
            @windowId = utils.uuid()
            @createWatcher()

            src =
              "#{@settings.socialBase}/window/#{@windowId}/" +
              "#{service}?lang=#{locale.lang}"
            @iframe = $('<iframe>')
              .attr('src', src)
              .css
                width: '100%'
                height: '100%'
                border: 0
              .appendTo(@content)

        createWatcher: ->
          unless @watcher
            @watcher = new utils.pubsub.PubSub @settings, 'window', @windowId
            $(@watcher).on('done', (e, state) =>
              @cleanup()
              file = uploadcare.fileFrom(@settings, 'url', state.url)
              @onSelected.fire file
            )
            @watcher.watch()

        cleanup: ->
          @watcher?.stop()
          @watcher = null
          @iframe?.remove()
          @iframe = null
