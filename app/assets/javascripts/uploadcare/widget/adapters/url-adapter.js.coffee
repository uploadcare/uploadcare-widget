uploadcare.whenReady ->
  {
    namespace,
    jQuery: $
  } = uploadcare

  {t} = uploadcare.locale
  {files} = uploadcare.widget

  namespace 'uploadcare.widget.adapters', (ns) ->
    class ns.URLAdapter extends ns.BaseAdapter
      @registerAs 'url'
      constructor: (@widget) ->
        super @widget

        input = @tab.find('@uploadcare-dialog-url-input')
        input.on 'change keyup input', ->
          button.attr('disabled', not $(this).val())

        button = @tab.find('@uploadcare-dialog-url-submit')
          .attr('disabled', true)

        @tab.find('@uploadcare-dialog-url-form').on 'submit', =>
          url = input.val()
          @widget.dialog.close()
          @widget.upload(new files.UrlFile(url))
          false
