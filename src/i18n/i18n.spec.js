import {i18n} from './i18n'
import ruLocale from './locales/ru'

describe('i18n', () => {
  it('should be able to add locale from object', () => {
    const locale = {
      name: 'new_locale',
      translations: {
        plural_word: {
          one: 'word',
          other: 'words',
        },
        word: 'word',
      },
      pluralize: (num) => (num === 1 ? 'one' : 'other'),
    }

    i18n.addLocale(locale)
    i18n.setLocale('new_locale')

    expect(i18n.t('word')).toBe('word')
    expect(i18n.p('plural_word', 1)).toBe('word')
    expect(i18n.p('plural_word', 99)).toBe('words')
  })

  it('should be able to edit existing locale', () => {
    i18n.addLocale(ruLocale)
    i18n.setLocale('ru')

    i18n.updateLocale('ru', locale => {
      locale.translations.loading = 'Чет грузится'

      return locale
    })

    expect(i18n.t('loading')).toBe('Чет грузится')
  })

  it('should be able to change locale', () => {
    i18n.addLocale(ruLocale)

    i18n.setLocale('en')
    expect(i18n.t('uploading')).toBe('Uploading... Please wait.')

    i18n.setLocale('ru')
    expect(i18n.t('uploading')).toBe('Загрузка')
  })

  it('should support templating', () => {
    const locale = {
      name: 'new_locale',
      translations: {
        named: 'named ${foo} and ${bar}',
        numbered: 'numbered ${1} and ${2}',
        plural: {
          one: 'plural one named ${1}',
          other: 'plural other named ${other}',
        },
      },
      pluralize: (num) => (num === 1 ? 'one' : 'other'),
    }

    i18n.addLocale(locale)
    i18n.setLocale('new_locale')

    expect(
      i18n.t('named', {
        foo: 'foo',
        bar: 'bar',
      })
    ).toBe('named foo and bar')

    expect(i18n.t('numbered', 'foo', 'bar')).toBe('numbered foo and bar')

    expect(i18n.p('plural', 1, 'foo')).toBe('plural one named foo')
    expect(i18n.p('plural', 10, {other: 'foo'})).toBe('plural other named foo')
  })
})
