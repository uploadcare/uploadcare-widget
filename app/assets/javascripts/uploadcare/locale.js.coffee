# = require_directory ./locale

{
  namespace,
  jQuery: $
} = uploadcare

namespace 'uploadcare.locale', (ns) ->
  defaultLocale = 'en'
  ns.lang = uploadcare.defaults.locale || defaultLocale

  ns.translations[ns.lang] ||= {}
  $.extend(ns.translations[ns.lang], uploadcare.defaults.translations)

  translate = (key, locale=defaultLocale) ->
    path = key.split('.')
    node = ns.translations[locale]
    for subkey in path
      return null unless node?
      node = node[subkey]
    node

  ns.t = (key, n) ->
    lang = ns.lang
    value = translate(key, lang)
    if not value? && lang != defaultLocale
      lang = defaultLocale
      value = translate(key, lang)

    if n?
      pluralize = ns.pluralize[lang]
      if pluralize?
        value = value[pluralize(n)]?.replace('%1', n) || n
      else
        value = ''

    value || ''
