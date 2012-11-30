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

        jQuery(@widget.dialog).on('switch-tab',
          (e, tab_name) =>
            if tab_name == 'instagram'
              @createIframe()
        )

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
          @watcher = new utils.pubsub.PubSubWatcher 'window', @window_id
          jQuery(@watcher).on('done', (e, state) =>

              @stopWatcher()
              
              @uploader.upload(state.url)

              @widget.dialog.close()
          )
          @watcher.watch()

      stopWatcher: =>
        @watcher.stop()





# <iframe src="/window/instagram?window_id={window_id}&pub_key={pub_key}" width="100%" height="100%">
# </iframe>

