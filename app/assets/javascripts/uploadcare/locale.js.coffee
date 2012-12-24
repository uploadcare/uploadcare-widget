# = require_directory ./locale

uploadcare.whenReady ->
  uploadcare.namespace 'uploadcare.locale', (ns) ->
    defaultLocale = 'en'
    ns.lang = uploadcare.defaults.locale

    translate = (key, locale=defaultLocale) ->
      path = key.split('.')
      node = ns.translations[locale]
      for subkey in path
        return null unless node?
        node = node[subkey]
      node

    ns.t = (key) ->
      value = translate(key, ns.lang)
      if not value? && ns.lang != defaultLocale
        value = translate(key)
      value
