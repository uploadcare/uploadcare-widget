{
  namespace,
  jQuery: $,
  templates: {tpl}
} = uploadcare

{t} = uploadcare.locale

namespace 'uploadcare.widget.tabs', (ns) ->
  class ns.UrlTab extends ns.BaseSourceTab

    # starts with "http(s)://" and has at least one dot
    urlRegexp = /^(http|https):\/\/.+\..+$/i

    fixUrl = (url) ->
      url = $.trim url
      if urlRegexp.test url
        url
      else if urlRegexp.test 'http://' + url
        'http://' + url
      else
        null

    constructor: ->
      super

      @wrap.append tpl 'tab-url'

      input = @wrap.find('@uploadcare-dialog-url-input')
      input.on 'change keyup input', ->
        button.attr('disabled', !fixUrl $(this).val())

      button = @wrap.find('@uploadcare-dialog-url-submit')
        .attr('disabled', true)

      @wrap.find('@uploadcare-dialog-url-form').on 'submit', =>
        if url = fixUrl input.val()
          @dialogApi.addFiles 'url', url
          input.val ''

        false
