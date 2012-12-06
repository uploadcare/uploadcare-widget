uploadcare.whenReady ->
  {
    namespace
  } = uploadcare

  namespace 'uploadcare.widget.adapters', (ns) ->
    class ns.FacebookAdapter extends ns.RemoteAdapter
      @registerAs 'facebook'
      constructor: (@widget) ->
        super @widget, 'facebook'
