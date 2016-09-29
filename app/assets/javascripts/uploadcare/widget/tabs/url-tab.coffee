{
  jQuery: $,
  templates: {tpl}
} = uploadcare

{t} = uploadcare.locale

uploadcare.namespace 'widget.tabs', (ns) ->
  class ns.UrlTab

    # starts with scheme
    urlRegexp = /^[a-z][a-z0-9+\-.]*:?\/\//

    fixUrl = (url) ->
      url = $.trim(url)
      if urlRegexp.test(url)
        url
      else
        'http://' + url

    constructor: (@container, @tabButton, @dialogApi, @settings, @name) ->
      @container.append(tpl('tab-url'))

      input = @container.find('.uploadcare--input')
      input.on 'change keyup input', ->
        button.prop('disabled', !$.trim(this.value))

      button = @container.find('.uploadcare--button_submit')
        .prop('disabled', true)

      @container.find('.uploadcare--form').on 'submit', =>
        if url = fixUrl(input.val())
          @dialogApi.addFiles('url', [[url, {source: 'url-tab'}]])
          input.val('')

        false
