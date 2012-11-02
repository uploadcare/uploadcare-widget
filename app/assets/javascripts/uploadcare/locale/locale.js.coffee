# = require ./translations/en
# = require ./translations/ru

uploadcare.whenReady ->
  {
    namespace,
    initialize,
    jQuery,
    utils
  } = uploadcare

  namespace 'uploadcare.locale', (ns) ->
    ns.t = (key) ->
      path = key.split('.')
      start = ns.translations[ns.locale]
      for subkey in path
        start = start[subkey]
      return start

    ns.locale = uploadcare.defaults.locale
