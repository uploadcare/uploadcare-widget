import uploadcare from './namespace'
import * as locales from './locales'

const {
  utils,
  settings: s,
  jQuery: $
} = uploadcare

uploadcare.namespace('locale', function (ns) {
  var _build, build, defaultLang, defaults, translate

  defaultLang = 'en'

  defaults = {
    lang: defaultLang,
    translations: locales[defaultLang].translations,
    pluralize: locales[defaultLang].pluralize
  }

  _build = function (settings) {
    var lang, pluralize, translations
    lang = settings.locale || defaults.lang
    translations = $.extend(true, {}, locales[lang].translations, settings.localeTranslations)
    pluralize = $.isFunction(settings.localePluralize) ? settings.localePluralize : locales[lang].pluralize
    return { lang, translations, pluralize }
  }

  build = utils.once(function () {
    return _build(s.build())
  })

  // Backdoor for widget constructor
  ns.rebuild = function (settings) {
    var result
    result = _build(s.build(settings))

    build = function () {
      return result
    }

    return build
  }

  translate = function (key, node) {
    var i, len, path, subkey
    path = key.split('.')
    for (i = 0, len = path.length; i < len; i++) {
      subkey = path[i]
      if (node == null) {
        return null
      }
      node = node[subkey]
    }
    return node
  }

  ns.t = function (key, n) {
    var locale, ref, value
    locale = build()
    value = translate(key, locale.translations)
    if ((value == null) && locale.lang !== defaults.lang) {
      locale = defaults
      value = translate(key, locale.translations)
    }
    if (n != null) {
      if (locale.pluralize != null) {
        value = ((ref = value[locale.pluralize(n)]) != null ? ref.replace('%1', n) : undefined) || n
      } else {
        value = ''
      }
    }
    return value || ''
  }
})
