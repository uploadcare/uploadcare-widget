# = require_directory ./locale

{
  namespace,
  settings,
  jQuery: $
} = uploadcare

namespace 'uploadcare.locale', (ns) ->
  defaultLocale = 'en'

  translate = (key, locale=defaultLocale) ->
    path = key.split('.')
    node = ns.translations[locale]
    for subkey in path
      return null unless node?
      node = node[subkey]
    node

  ns.t = (key, n) ->
    lang = settings.build().locale || defaultLocale
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
