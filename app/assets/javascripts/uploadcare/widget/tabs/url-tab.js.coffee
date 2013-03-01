uploadcare.whenReady ->
  {
    namespace,
    jQuery: $
  } = uploadcare

  {t} = uploadcare.locale

  urlRegexp = ///^
    ((http|https)://)?                          # http(s)://
    [a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}  # site.com
    (:[0-9]{1,5})?                              # :8080
    (/.*)?                                      # /path?and=query&string
  $///i

  namespace 'uploadcare.widget.tabs', (ns) ->
    class ns.UrlTab extends ns.BaseFileTab

      setContent: (@content) ->
        input = @content.find('@uploadcare-dialog-url-input')
        input.on 'change keyup input', ->
          button.attr('disabled', not $(this).val().match(urlRegexp))

        button = @content.find('@uploadcare-dialog-url-submit')
          .attr('disabled', true)

        @content.find('@uploadcare-dialog-url-form').on 'submit', =>
          url = input.val()
          parsed = url.match urlRegexp
          if parsed
            url = 'http://' + url if not parsed[1]
            @onSelected.fire 'url', url

          false
