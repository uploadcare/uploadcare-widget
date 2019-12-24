import { build as buildSettings } from './settings'
import locales from './locales'
import { extend, isFunction } from './utils'

let currentLocale = null

const locale = {
  translations: Object.keys(locales).reduce((translations, lang) => {
    translations[lang] = locales[lang].translations

    return translations
  }, {}),

  pluralize: Object.keys(locales).reduce((pluralize, lang) => {
    pluralize[lang] = locales[lang].pluralize

    return pluralize
  }, {}),

  // Backdoor for widget constructor
  rebuild: function(settings) {
    currentLocale = null

    return _build(settings)
  },

  t: function(key, n) {
    let locale, ref, value
    locale = _build()
    value = translate(key, locale.translations)
    if (value == null && locale.lang !== defaults.lang) {
      locale = defaults
      value = translate(key, locale.translations)
    }
    if (n != null) {
      if (locale.pluralize != null) {
        value =
          ((ref = value[locale.pluralize(n)]) != null
            ? ref.replace('%1', n)
            : undefined) || n
      } else {
        value = ''
      }
    }
    return value || ''
  }
}

const defaultLang = 'en'

const defaults = {
  lang: defaultLang,
  translations: locales[defaultLang].translations,
  pluralize: locales[defaultLang].pluralize
}

const _build = function(stgs) {
  if (!currentLocale) {
    const settings = buildSettings(stgs)
    const lang = settings.locale || defaults.lang
    const translations = extend(
      {},
      locale.translations[lang],
      settings.localeTranslations
    )

    const pluralize = isFunction(settings.localePluralize)
      ? settings.localePluralize
      : locale.pluralize[lang]

    currentLocale = { lang, translations, pluralize }
  }

  return currentLocale
}

const translate = function(key, node) {
  const path = key.split('.')
  for (let i = 0, len = path.length; i < len; i++) {
    const subkey = path[i]
    if (node == null) {
      return null
    }
    node = node[subkey]
  }
  return node
}

export default locale
