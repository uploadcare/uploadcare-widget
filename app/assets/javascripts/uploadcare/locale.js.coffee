# = require_directory ./locale

{
  namespace,
  utils,
  settings: s,
  jQuery: $
} = uploadcare

namespace 'uploadcare.locale', (ns) ->
  defaultLang = 'en'
  defaults =
    lang: defaultLang
    translations: ns.translations[defaultLang]
    pluralize: ns.pluralize[defaultLang]

  build = utils.once ->
    settings = s.build()
    lang = settings.locale || defaults.lang
    translations = $.extend(true, {},
      ns.translations[lang],
      settings.localeTranslations
    )
    pluralize = if $.isFunction(settings.localePluralize)
      settings.localePluralize
    else
      ns.pluralize[lang]

    {lang, translations, pluralize}


  translate = (key, node) ->
    path = key.split('.')
    for subkey in path
      return null unless node?
      node = node[subkey]
    node

  ns.t = (key, n) ->
    locale = build()
    value = translate(key, locale.translations)
    if not value? && locale.lang != defaults.lang
      locale = defaults
      value = translate(key, locale.translations)

    if n?
      if locale.pluralize?
        value = value[locale.pluralize(n)]?.replace('%1', n) || n
      else
        value = ''

    value || ''
