import merge from 'deepmerge'

import uploadcare from './namespace'
import * as locales from './locales'

const {
  utils,
  settings: s
} = uploadcare

const translate = function (key, node) {
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

const defaultLang = 'en'

const defaults = {
  lang: defaultLang,
  translations: locales[defaultLang].translations,
  pluralize: locales[defaultLang].pluralize
}

const _build = function (settings) {
  const lang = settings.locale || defaults.lang

  const translations = merge(
    {},
    locales[lang].translations,
    settings.localeTranslations
  )

  const pluralize = typeof settings.localePluralize === 'function'
    ? settings.localePluralize
    : locales[lang].pluralize

  return { lang, translations, pluralize }
}

let build = utils.once(function () {
  return _build(s.build())
})

// Backdoor for widget constructor
const rebuild = function (settings) {
  var result
  result = _build(s.build(settings))

  build = function () {
    return result
  }

  return build
}

const t = function (key, n) {
  var ref
  let locale = build()
  let value = translate(key, locale.translations)

  if (value == null && locale.lang !== defaults.lang) {
    locale = defaults
    value = translate(key, locale.translations)
  }

  if (n != null) {
    if (locale.pluralize != null) {
      const plur = value[locale.pluralize(n)]

      value = plur != null ? ref.replace('%1', n) : undefined
      value = value || n
    } else {
      value = ''
    }
  }
  return value || ''
}

export { rebuild, t }
