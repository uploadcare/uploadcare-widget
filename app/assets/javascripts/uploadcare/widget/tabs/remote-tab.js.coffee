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

        nos = (str) -> str.replace(/^https/, 'http')

        $(window).on "message", ({originalEvent: e}) =>
          goodOrigin = nos(e.origin) is nos(@settings.socialBase)
          goodSource = e.source is @iframe?[0]?.contentWindow
          if goodOrigin and goodSource
            message = JSON.parse e.data
            if message.type is 'file-selected'
              @onSelected.fire 'url', message.url

      createIframe: ->
        unless @iframe
          src = "#{@settings.socialBase}/window/#{service}?" + $.param
            lang: @settings.locale
            public_key: @settings.publicKey
            widget_version: uploadcare.version
          @iframe = $('<iframe>')
            .attr('src', src)
            .css
              width: '100%'
              height: '100%'
              border: 0
              visibility: 'hidden'
            .appendTo(@content)
            .on 'load', -> $(this).css 'visibility', 'visible'
