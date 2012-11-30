uploadcare.whenReady ->
  {
    namespace,
    jQuery,
    utils
  } = uploadcare

  {t} = uploadcare.locale

  {defaultDialog} = uploadcare.widget.dialog

  socialBase = 'http://uploadcare.local:5000'

  namespace 'uploadcare.widget.adapters', (ns) ->
    class ns.InstagramAdapter extends ns.BaseAdapter
      @registerAs 'instagram'

      # constructor: (@widget, @uploader) ->
        # super @widget

        # debugger
        # jQuery('<b>dadsa' + utils.uuid() + '</b>').appendTo(@tab)
        # jQuery(defaultDialog).on('switch-tab',
        #   (e, tab_name, tab) =>
        #     if tab_name == 'instagram'
        #       ns.InstagramAdapter.createIframe tab
        # )

      @createIframe = (tab) =>
        if not @iframe
          @window_id = utils.uuid()

          @watcher = new utils.pubsub.PubSubWatcher 'window', @window_id
          jQuery(@watcher).on('done',
            (state) =>
              @watcher.stop()
              @widget.dialog.close()
              @uploader.upload(state.url)
          )
          @watcher.watch()

          src = "#{socialBase}/window/instagram?window_id=#{@window_id}"
          @iframe = jQuery('<iframe>')
                      .attr('src', src)
                      .css
                        width: '100%'
                        height: '100%'
                      .appendTo(tab)





# <iframe src="/window/instagram?window_id={window_id}&pub_key={pub_key}" width="100%" height="100%">
# </iframe>

