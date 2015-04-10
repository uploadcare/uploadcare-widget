{
  namespace,
  jQuery: $,
  templates: {tpl}
} = uploadcare

{t} = uploadcare.locale

namespace 'uploadcare.widget.tabs', (ns) ->
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
      @container.addClass('uploadcare-dialog-padding')

      input = @container.find('.uploadcare-dialog-input')
      input.on 'change keyup input', ->
        button.prop('disabled', !$.trim(this.value))

      button = @container.find('.uploadcare-dialog-url-submit')
        .prop('disabled', true)

      @container.find('.uploadcare-dialog-url-form').on 'submit', =>
        if url = fixUrl(input.val())
          @dialogApi.addFiles('url', [url])
          input.val('')

        false
