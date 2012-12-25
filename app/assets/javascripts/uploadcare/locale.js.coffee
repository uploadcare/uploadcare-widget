# = require_directory ./locale

uploadcare.whenReady ->
  {
    namespace,
    jQuery: $
  } = uploadcare

  namespace 'uploadcare.locale', (ns) ->
    defaultLocale = 'en'
    ns.lang = uploadcare.defaults.locale

    ns.translations[ns.lang] ||= {}
    $.extend(ns.translations[ns.lang], uploadcare.defaults.translations)

    pluralize =
      uploadcare.defaults.pluralize ||
      ns.pluralize[ns.lang] ||
      ns.pluralize[defaultLocale]

    translate = (key, locale=defaultLocale) ->
      path = key.split('.')
      node = ns.translations[locale]
      for subkey in path
        return null unless node?
        node = node[subkey]
      node

    ns.t = (key, n) ->
      value = translate(key, ns.lang)
      if not value? && ns.lang != defaultLocale
        value = translate(key)
      if n? && value?
        value = value[pluralize(n)]?.replace('%1', n)
      value || ''
