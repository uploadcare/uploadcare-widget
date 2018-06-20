/* @flow */
/* eslint-disable id-length, max-statements */

import enLocale from './locales/en'
import type {LocaleSpec, Locale, Translations} from './flow-typed'

type LocalesMap = {[name: string]: Locale}
type NamedParams = {[key: string]: string}

const localesMap: LocalesMap = {}
const defaultLocale = 'en'
let locale: string = defaultLocale

addLocale(enLocale)

/**
 *
 *
 * @param {string} path
 * @param {...Array<string> | ...Array<NamedParams>} args
 * @returns {(string | void)}
 */
function translate(path: string, ...args: Array<string> | Array<NamedParams>): string | void {
  const locale = getLocale()

  const {translations} = locale
  let value = getIn(path, translations)

  if (typeof value !== 'string') {
    return error(`expected translation to be a string. Got: ${typeof value}`, value)
  }

  if (args && args.length > 0) {
    return fromTemplate(value, args)
  }

  return value
}

/**
 *
 *
 * @param {string} value
 * @param {Array<string> | Array<NamedParams>} args
 * @returns {string | void}
 */
function fromTemplate(value: string, args: Array<string> | Array<NamedParams>): string | void {
  let template = value

  if (typeof args[0] === 'object') {
    const named: NamedParams = args[0]

    Object.keys(named).forEach(key => {
      template = template.replace(new RegExp('\\$\\{' + escapeRegex(key) + '\\}', 'gm'), named[key])
    })
  }

  if (typeof args[0] === 'string') {
    const numbered: Array<string> = (args: any)

    numbered.forEach((value, idx) => {
      template = template.replace(new RegExp('\\$\\{' + escapeRegex((idx + 1).toString(10)) + '\\}', 'gm'), value)
    })
  }

  return template
}

/**
 *
 *
 * @param {string} path
 * @param {number} num
 * @returns {string}
 */
function pluralize(path: string, num: number, ...args: Array<string> | Array<NamedParams>): string | void {
  const locale = getLocale()
  const value = getIn(path, locale.translations)

  if (typeof value !== 'object') {
    return error(`expected translation to be an object. Got: ${typeof value}`, value)
  }

  try {
    const pluralForm = locale.pluralize(num)
    const pluralized = value[pluralForm]

    if (typeof pluralized !== 'string') {
      return error(`expected pluralized value to be a string. Got: ${typeof pluralized}`, pluralized)
    }

    if (args && args.length > 0) {
      return fromTemplate(pluralized, args)
    }

    return pluralized
  }
  catch (expection) {
    error('pluralization failed. Value: ', value, 'Requested number: ', num, expection)
  }
}

/**
 *
 *
 * @param {string} name
 */
function setLocale(name: string): void {
  if (!localesMap[name]) {
    return error(`locale "${name}" not found`)
  }

  locale = name
}

/**
 *
 *
 * @param {Locale} locale
 */
function addLocale(locale: LocaleSpec): void {
  const {name, translations, pluralize} = locale

  if (!name || !translations || !pluralize) {
    return error('locale should contain name, translations and pluralize')
  }

  localesMap[name] = {
    translations,
    pluralize,
  }
}

/**
 *
 *
 * @param {string} name
 * @param {(locale: Locale) => Locale} update
 */
function updateLocale(name: string, update: (locale: Locale) => Locale): void {
  localesMap[name] = update(localesMap[name])
}

/**
 *
 *
 * @returns {Locale}
 */
function getLocale(): Locale {
  return localesMap[locale]
}

/**
 *
 *
 * @param {string} path
 * @param {{}} object
 * @returns {*}
 */
function getIn(path: string, translations: Translations): Translations | string {
  const parts = path.split('.')
  const length = parts.length
  let property = translations

  for (let i = 0; i < length; i += 1) {
    if (typeof property === 'string') {
      return property
    }

    property = property[parts[i]]
  }

  return property
}

/**
 *
 *
 * @param {string} message
 * @param {*} args
 */
function error(message: string, ...args): void {
  /* eslint-disable no-console */
  console.error(`TranslationError: ${message}`, args)
}

/**
 *
 *
 * @param {string} str
 * @returns {string}
 */
function escapeRegex(str: string): string {
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}

export const i18n = {
  setLocale,
  updateLocale,
  addLocale,

  translate,
  t: translate,

  pluralize,
  p: pluralize,

  get locale() {
    return locale
  },
}

export const t = translate
export const p = pluralize
