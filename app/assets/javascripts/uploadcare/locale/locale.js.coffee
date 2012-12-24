# = require_directory ./translations

uploadcare.whenReady ->
  uploadcare.namespace 'uploadcare.locale', (ns) ->
    defaultLocale = 'en'
    ns.locale = uploadcare.defaults.locale

    translate = (key, locale=defaultLocale) ->
      path = key.split('.')
      node = ns.translations[locale]
      for subkey in path
        return null unless node?
        node = node[subkey]
      node

    ns.t = (key) ->
      value = translate(key, ns.locale)
      if not value? && ns.locale != defaultLocale
        value = translate(key)
      value
