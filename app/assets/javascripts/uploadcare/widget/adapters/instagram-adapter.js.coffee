uploadcare.whenReady ->
  {
    namespace,
    jQuery,
    utils
  } = uploadcare

  {t} = uploadcare.locale

  socialBase = 'http://uploadcare.local:5000'

  namespace 'uploadcare.widget.adapters', (ns) ->
    class ns.InstagramAdapter extends ns.BaseAdapter
      @registerAs 'instagram'

      constructor: (@widget, @uploader) ->
        super @widget

        handler = (e, tab_name) =>
            if tab_name == 'instagram'
              @createIframe()

        jQuery(@widget.dialog).on('open-dialog', handler)
        jQuery(@widget.dialog).on('switch-tab', handler)

      createIframe: =>
        if not @iframe
          @window_id = utils.uuid()

          @createWatcher()

          src = "#{socialBase}/window/instagram?window_id=#{@window_id}"
          @iframe = jQuery('<iframe>')
                      .attr('src', src)
                      .css
                        width: '100%'
                        height: '100%'
                      .appendTo(@tab)

      createWatcher: =>
        if not @watcher
          @watcher = new utils.pubsub.PubSub @widget, 'window', @window_id
          jQuery(@watcher).on('done', (e, state) =>

              @cleanup()
              
              @uploader.upload(state.url)

              @widget.dialog.close()
          )
          @watcher.watch()

      cleanup: =>
        @watcher.stop()
        @watcher = null
        @iframe.remove()
        @iframe = null






# <iframe src="/window/instagram?window_id={window_id}&pub_key={pub_key}" width="100%" height="100%">
# </iframe>

