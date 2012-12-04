uploadcare.whenReady ->
  {
    namespace,
    jQuery,
    utils
  } = uploadcare

  {t} = uploadcare.locale

  namespace 'uploadcare.widget.adapters', (ns) ->
    class ns.InstagramAdapter extends ns.BaseAdapter
      @registerAs 'instagram'

      constructor: (@widget, @uploader) ->
        super @widget

        handler = (e, tab_name) =>
          if tab_name == 'instagram'
            @createIframe()

        jQuery(@widget.dialog).on('uploadcare.dialog.open', handler)
        jQuery(@widget.dialog).on('uploadcare.dialog.switchtab', handler)

      createIframe: =>
        if not @iframe
          @window_id = utils.uuid()

          @createWatcher()

          src = "#{@widget.settings.socialBase}/window/instagram?window_id=#{@window_id}"
          @iframe = jQuery('<iframe>')
                      .attr('src', src)
                      .css
                        width: '100%'
                        height: '100%'
                        border: 0
                      .appendTo(@tab)

      createWatcher: =>
        if not @watcher
          @watcher = new utils.pubsub.PubSub @widget, 'window', @window_id
          jQuery(@watcher).on('done', (e, state) =>
            @uploader.upload(state.url)

            @cleanup()

            @widget.dialog.close()
          )
          @watcher.watch()

      cleanup: =>
        @watcher.stop()
        @watcher = null
        @iframe.remove()
        @iframe = null
