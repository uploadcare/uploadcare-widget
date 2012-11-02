uploadcare.whenReady ->
  {
    namespace,
    jQuery: $
  } = uploadcare

  namespace 'uploadcare.widget.uploaders', (ns) ->
    ns.registered = {}

    class ns.BaseUploader
      @registerAs: (name) ->
        @registeredName = name
        ns.registered[name] = this
