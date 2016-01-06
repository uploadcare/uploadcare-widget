{
  locale,
  utils,
  tabsCss,
  jQuery: $,
  locale: {t},
  files
} = uploadcare

uploadcare.namespace 'widget.tabs', (ns) ->
  class ns.RemoteTab
    constructor: (@container, @tabButton, @dialogApi, @settings, @name) ->
      @container.addClass('uploadcare-dialog-remote-iframe-wrap')

      @dialogApi.progress (name) =>
        if name == @name
          @__createIframe()
        @__sendMessage
          type: 'visibility-changed'
          visible: name == @name

    remoteUrl: ->
      "#{@settings.socialBase}/window/#{@name}?" + $.param(
        lang: @settings.locale
        public_key: @settings.publicKey
        widget_version: uploadcare.version
        images_only: @settings.imagesOnly
        pass_window_open: @settings.passWindowOpen
      )

    __sendMessage: (messageObj) ->
      @iframe?[0].contentWindow.postMessage(JSON.stringify(messageObj), '*')

    __createIframe: =>
      if @iframe
        return

      @iframe = $('<iframe>',
          src: @remoteUrl()
          marginheight: 0
          marginwidth: 0
          frameborder: 0
          allowTransparency: "true"
        )
        .addClass('uploadcare-dialog-remote-iframe')
        .appendTo(@container)
        .on 'load', =>
          @iframe.css('opacity', '1')
          for url in tabsCss.urls
            @__sendMessage(
              type: 'embed-css'
              url: url
            )
          for style in tabsCss.styles
            @__sendMessage(
              type: 'embed-css'
              style: style
            )
          return

      iframe = @iframe[0].contentWindow

      utils.registerMessage 'file-selected', iframe, (message) =>
        url = do =>
          if message.alternatives
            for type in @settings.preferredTypes
              type = utils.globRegexp(type)
              for key of message.alternatives
                if type.test(key)
                  return message.alternatives[key]
          return message.url

        file = new files.UrlFile(@settings, url)
        if message.filename
          file.setName(message.filename)
        if message.is_image?
          file.setIsImage(message.is_image)
        if message.info
          file.updateSourceInfo(message.info)
        file.updateSourceInfo({source: @name})

        @dialogApi.addFiles [file.promise()]


      utils.registerMessage 'open-new-window', iframe, (message) =>
        if @settings.debugUploads
          utils.debug("Open new window message.", @name)

        popup = window.open(message.url, '_blank')
        if not popup
          utils.warn("Can't open new window. Possible blocked.", @name)
          return

        resolve = =>
          if @settings.debugUploads
            utils.debug("Window is closed.", @name)
          @__sendMessage
            type: 'navigate'
            fragment: ''

        # Detect is window supports "closed".
        # In browsers we have only "closed" property.
        # In Cordova addEventListener('exit') does work.
        if 'closed' of popup
          interval = setInterval =>
            if popup.closed
              clearInterval(interval)
              resolve()
          , 100

        else
          popup.addEventListener('exit', resolve)

      @dialogApi.done =>
        utils.unregisterMessage('file-selected', iframe)
        utils.unregisterMessage('open-new-window', iframe)
