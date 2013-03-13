{
  namespace,
  jQuery: $
} = uploadcare

{t} = uploadcare.locale

namespace 'uploadcare.widget.tabs', (ns) ->
  class ns.UrlTab extends ns.BaseFileTab

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

    setContent: (@content) ->
      input = @content.find('@uploadcare-dialog-url-input')
      input.on 'change keyup input', ->
        button.attr('disabled', !fixUrl $(this).val())

      button = @content.find('@uploadcare-dialog-url-submit')
        .attr('disabled', true)

      @content.find('@uploadcare-dialog-url-form').on 'submit', =>
        if url = fixUrl input.val()
          @onSelected.fire 'url', url

        false
