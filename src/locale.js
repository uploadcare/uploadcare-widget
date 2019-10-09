import $ from 'jquery'

import { once } from './utils'
import { build as buildSettings } from './settings'

import * as locales from './locales'

var defaultLang = 'en'

var defaults = {
  lang: defaultLang,
  translations: locales[defaultLang].translations,
  pluralize: locales[defaultLang].pluralize
}

var _build = function (settings) {
  var lang, pluralize, translations
  lang = settings.locale || defaults.lang
  translations = $.extend(true, {}, locales[lang].translations, settings.localeTranslations)
  pluralize = $.isFunction(settings.localePluralize) ? settings.localePluralize : locales[lang].pluralize
  return { lang, translations, pluralize }
}

var build = once(function () {
  return _build(buildSettings())
})

// Backdoor for widget constructor
const rebuild = function (settings) {
  var result
  result = _build(buildSettings(settings))

  build = function () {
    return result
  }

  return build
}

var translate = function (key, node) {
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

const t = function (key, n) {
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

export {
  rebuild,
  t
}
