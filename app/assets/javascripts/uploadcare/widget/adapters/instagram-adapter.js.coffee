uploadcare.whenReady ->
  {
    namespace,
    jQuery: $
  } = uploadcare

  {t} = uploadcare.locale

  namespace 'uploadcare.widget.adapters', (ns) ->
    class ns.InstagramAdapter extends ns.BaseAdapter
      @registerAs 'instagram'


# <iframe src="/window/instagram?window_id={window_id}&pub_key={pub_key}" width="100%" height="100%">
# </iframe>

