# = require_directory ./locale

{
  utils,
  settings: s,
  jQuery: $
} = uploadcare

uploadcare.namespace 'locale', (ns) ->
  defaultLang = 'en'
  defaults =
    lang: defaultLang
    translations: ns.translations[defaultLang]
    pluralize: ns.pluralize[defaultLang]

  _build = (settings) ->
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

  build = utils.once ->
    _build(s.build())

  # Backdoor for widget constructor
  ns.rebuild = (settings) ->
    result = _build(s.build(settings))
    build = ->
      result

  translate = (key, node) ->
    path = key.split('.')
    for subkey in path
      if not node?
        return null
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
