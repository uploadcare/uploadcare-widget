{
  namespace,
  locale,
  utils,
  tabsCss,
  jQuery: $,
  locale: {t},
  files
} = uploadcare

namespace 'uploadcare.widget.tabs', (ns) ->
  class ns.RemoteTab extends ns.BaseSourceTab
    constructor: ->
      super

      @wrap.addClass('uploadcare-dialog-remote-iframe-wrap')

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
        .appendTo(@wrap)
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

      $(window).on "message", ({originalEvent: e}) =>
        if e.source isnt @iframe[0].contentWindow
          return

        try
          message = JSON.parse(e.data)
        catch
          return

        if message.type is 'file-selected'
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
          info = {source: @name}
          if message.info
            $.extend(info, message.info)
          file.setSourceInfo(info)

          @dialogApi.addFiles [file.promise()]
