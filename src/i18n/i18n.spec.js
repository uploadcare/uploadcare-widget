/* eslint-disable max-statements */

import {createInstance} from './i18n'
import ruLocale from './locales/ru'

describe('i18n', () => {
  let i18n

  beforeEach(() => {
    i18n = createInstance()
  })

  it('should be able to add locale from spec', () => {
    const spec = {
      name: 'test1',
      translations: {
        plural_word: {
          one: 'word',
          other: 'words',
        },
        word: 'word',
      },
      pluralize: num => (num === 1 ? 'one' : 'other'),
    }

    i18n.addLocale(spec)
    i18n.setLocale('test1')

    expect(i18n.t('word')).toBe('word')
    expect(i18n.p('plural_word', 1)).toBe('word')
    expect(i18n.p('plural_word', 99)).toBe('words')
  })

  it('should be able to edit existing locale', () => {
    i18n.addLocale(ruLocale)
    i18n.setLocale('ru')

    i18n.updateLocale('ru', locale => {
      locale.translations.loading = 'Загружаю ваши фотографии'

      return locale
    })

    expect(i18n.t('loading')).toBe('Загружаю ваши фотографии')
  })

  it('should be able to change current locale', () => {
    i18n.addLocale(ruLocale)

    i18n.setLocale('en')
    expect(i18n.t('uploading')).toBe('Uploading... Please wait.')

    i18n.setLocale('ru')
    expect(i18n.t('uploading')).toBe('Загрузка')
  })

  it('should support string templating', () => {
    const spec = {
      name: 'test2',
      translations: {
        named: 'named ${foo} and ${bar} and ${foo}${bar}',
        numbered: 'numbered ${1} and ${2} and ${1}${2}',
        plural: {
          one: 'plural one named ${1}',
          other: 'plural other named ${other}',
        },
      },
      pluralize: num => (num === 1 ? 'one' : 'other'),
    }

    i18n.addLocale(spec)
    i18n.setLocale('test2')

    expect(
      i18n.t('named', {
        foo: 'foo',
        bar: 'bar',
      })
    ).toBe('named foo and bar and foobar')

    expect(i18n.t('numbered', 'foo', 'bar')).toBe('numbered foo and bar and foobar')

    expect(i18n.p('plural', 1, 'foo')).toBe('plural one named foo')
    expect(i18n.p('plural', 10, {other: 'foo'})).toBe('plural other named foo')
  })

  it('should have english locale by default', () => {
    expect(i18n.getLocale()).toBe('en')
    expect(i18n.getLocales().length).toBe(1)
  })

  it('should be able to get current locale name', () => {
    i18n.addLocale(ruLocale)

    i18n.setLocale('en')
    expect(i18n.getLocale()).toBe('en')

    i18n.setLocale('ru')
    expect(i18n.getLocale()).toBe('ru')
  })

  it('should be able to get all available locales', () => {
    i18n.addLocale(ruLocale)
    const locales = i18n.getLocales()

    expect(locales.length).toBe(2)
    expect(locales.includes('en')).toBeTruthy()
    expect(locales.includes('ru')).toBeTruthy()
  })

  it('should be able to listen to changes', () => {
    i18n.addLocale(ruLocale)
    i18n.setLocale('en')

    const listener = jasmine.createSpy()

    i18n.onChange(listener)

    // should fire
    i18n.setLocale('ru')
    i18n.updateLocale('ru', locale => locale)
    i18n.setLocale('en')

    // should not fire
    i18n.updateLocale('ru', locale => locale)
    i18n.setLocale('en')

    expect(listener.calls.count()).toEqual(3)
  })

  it('should provide namespaces functionality', () => {
    i18n.addLocaleNamespace({
      name: 'EffectsTab',
      locale: 'en',
      translations: {
        tree: {
          welcome: 'Hi! This is brand new Effects Tab!',
          effects: {
            one: 'effect',
            other: 'effects',
          },
        },
      },
    })

    expect(i18n.t('EffectsTab#tree.welcome')).toBe('Hi! This is brand new Effects Tab!')
    expect(i18n.p('EffectsTab#tree.effects', 1)).toBe('effect')
    expect(i18n.p('EffectsTab#tree.effects', 10)).toBe('effects')
  })
})
