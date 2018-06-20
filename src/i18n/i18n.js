/* @flow */
/* eslint-disable id-length, max-statements */

import enLocale from './locales/en'
import type {LocaleSpec, Locale, LocalesMap, Translations, NamedParams, ChangeListener} from './flow-typed'

export const createInstance = () => {
  const changeListeners: Array<ChangeListener> = []
  const localesMap: LocalesMap = {}
  let localeName: string = enLocale.name

  addLocale(enLocale)

  /**
   * Get translation by it's path
   * Supports named and numbered templating
   *
   * @param {string} path path to the translation
   * @param {...Array<string> | ...Array<NamedParams>} args template arguments
   * @returns {(string | void)} translated string
   */
  function translate(path: string, ...args: Array<string> | Array<NamedParams>): string | void {
    const locale = getCurrentLocale()

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
   * Apply template arguments to the template string
   *
   * @param {string} value template string
   * @param {Array<string> | Array<NamedParams>} args template arguments
   * @returns {string | void} result string
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
   * Pluralize translation
   *
   * @param {string} path path to the pluralization object
   * @param {number} num number of items
   * @returns {string} pluralized string
   */
  function pluralize(path: string, num: number, ...args: Array<string> | Array<NamedParams>): string | void {
    const locale = getCurrentLocale()
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
   * Get current locale object
   *
   * @returns {Locale}
   */
  function getCurrentLocale(): Locale {
    return localesMap[localeName]
  }

  /**
   * Get object property by it's path
   *
   * @param {string} path
   * @param {Translations} translations
   * @returns {Translations}
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
   * Print error to the console
   *
   * @param {string} message
   * @param {*} args
   */
  function error(message: string, ...args): void {
    /* eslint-disable no-console */
    console.error(`TranslationError: ${message}`, args)
  }

  /**
   * Escape string to use in regex
   *
   * @param {string} str
   * @returns {string}
   */
  function escapeRegex(str: string): string {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  }

  /**
   * Set current locale
   *
   * @param {string} name locale name
   */
  function setLocale(name: string): void {
    if (!localesMap[name]) {
      return error(`locale "${name}" not found`)
    }

    if (localeName === name) {
      return
    }

    localeName = name
    fireChange()
  }

  /**
   * Add new locale
   *
   * @param {Locale} locale locale specification object
   */
  function addLocale(locale: LocaleSpec): void {
    const {name, translations, pluralize} = locale

    if (!name || !translations || !pluralize) {
      return error('locale should contain name, translations and pluralize')
    }

    if (typeof localesMap[name] !== 'undefined') {
      return error(`can't overwrite locale "${name}"`)
    }

    localesMap[name] = {
      translations,
      pluralize,
    }
  }

  /**
   * Get current locale name
   *
   * @returns {string}
   */
  function getLocale(): string {
    return localeName
  }

  /**
   * Get available locales
   *
   * @returns {Array<string>}
   */
  function getLocales(): Array<string> {
    return Object.keys(localesMap)
  }

  /**
   * Update existing locale
   *
   * @param {string} name locale name
   * @param {(locale: Locale) => Locale} update locale update callback
   */
  function updateLocale(name: string, update: (locale: Locale) => Locale): void {
    localesMap[name] = update(localesMap[name])

    if (localeName === name) {
      fireChange()
    }
  }

  /**
   * Add change listener
   *
   * @param {ChangeListener} listener
   */
  function onChange(listener: ChangeListener): void {
    changeListeners.push(listener)
  }

  /**
   * Fires change event
   *
   */
  function fireChange(): void {
    changeListeners.forEach(listener => listener())
  }

  return {
    setLocale,
    addLocale,
    getLocale,
    getLocales,
    updateLocale,
    onChange,

    translate,
    t: translate,

    pluralize,
    p: pluralize,
  }
}

export const i18n = createInstance()

export const t = i18n.translate
export const p = i18n.pluralize
