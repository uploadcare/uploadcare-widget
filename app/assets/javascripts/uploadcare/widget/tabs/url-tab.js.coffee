{
  namespace,
  jQuery: $,
  templates: {tpl}
} = uploadcare

{t} = uploadcare.locale

namespace 'uploadcare.widget.tabs', (ns) ->
  class ns.UrlTab extends ns.BaseSourceTab

    # starts with scheme
    urlRegexp = /^[a-z][a-z0-9+\-.]*:?\/\//

    fixUrl = (url) ->
      url = $.trim url
      if urlRegexp.test url
        url
      else
        'http://' + url

    constructor: ->
      super

      @wrap.append tpl 'tab-url'
      @wrap.addClass('uploadcare-dialog-padding')

      input = @wrap.find('@uploadcare-dialog-url-input')
      input.on 'change keyup input', ->
        button.prop('disabled', !$.trim(this.value))

      button = @wrap.find('@uploadcare-dialog-url-submit')
        .prop('disabled', true)

      @wrap.find('@uploadcare-dialog-url-form').on 'submit', =>
        if url = fixUrl input.val()
          @dialogApi.addFiles 'url', [url]
          input.val ''

        false
