{
  namespace,
  locale,
  utils,
  jQuery: $,
  locale: {t}
} = uploadcare

namespace 'uploadcare.widget.tabs', (ns) ->
  ns.RemoteTabFor = (service) ->
    class RemoteTab extends ns.BaseSourceTab

      constructor: ->
        super

        @wrap.addClass 'uploadcare-dialog-remote-iframe-wrap'
        @dialogApi.onSwitchedToMe.add @__createIframe

        @dialogApi.onSwitched.add (_, switchedToMe) =>
          @__sendMessage
            type: 'visibility-changed'
            visible: switchedToMe

      __sendMessage: (messageObj) ->
        @iframe?[0]?.contentWindow?.postMessage JSON.stringify(messageObj), '*'

      __createIframe: =>
        unless @iframe
          src = "#{@settings.socialBase}/window/#{service}?" + $.param
            lang: @settings.locale
            public_key: @settings.publicKey
            widget_version: uploadcare.version
          @iframe = $('<iframe>')
            .attr
              src: src
              marginheight: 0
              marginwidth: 0
              frameborder: 0
              allowTransparency: "true"
            .css
              width: '100%'
              height: '100%'
              border: 0
              visibility: 'hidden'
            .appendTo(@wrap)
            .on 'load', -> $(this).css 'visibility', 'visible'

          nos = (str) -> str.toLowerCase().replace(/^https/, 'http')

          $(window).on "message", ({originalEvent: e}) =>
            goodOrigin = nos(e.origin) is nos(@settings.socialBase)
            goodSource = e.source is @iframe?[0]?.contentWindow
            if goodOrigin and goodSource
              try 
                message = JSON.parse e.data
              if message?.type is 'file-selected'

                file = uploadcare.rawFileFrom 'url', message.url, @settings
                if message.filename
                  file.setName message.filename
                if message.is_image?
                  file.setIsImage message.is_image
                @dialogApi.addFiles file.promise()
                
                @__sendMessage
                  type: 'file-selected-received'
                  url: message.url
