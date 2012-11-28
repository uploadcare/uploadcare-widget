uploadcare.whenReady ->
  {
    namespace,
    jQuery: $
  } = uploadcare

  {t} = uploadcare.locale
  {socialServices} = uploadcare.social

  namespace 'uploadcare.widget.adapters', (ns) ->
    class ns.InstagramAdapter extends ns.BaseAdapter
      @registerAs 'instagram'
      socialServices.register('instagram', this)

      constructor: (@widget, @uploader) ->
        super @widget

      @updateStatus: (@status) ->
        # updates status of *all* dialogs on the page
        if status['status'] == "unauthenticated"
          $('@uploadcare-dialog-instagram-oauth').attr('href', status['oauth_url'])
          $('@uploadcare-dialog-instagram-unauthenticated').show()
          $('@uploadcare-dialog-instagram-authenticated').hide()
        else
          $('@uploadcare-dialog-instagram-unauthenticated').hide()
          $('@uploadcare-dialog-instagram-authenticated').show()



