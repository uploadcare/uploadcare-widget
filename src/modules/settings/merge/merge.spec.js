import {merge} from './merge'

describe('merge', () => {
  it('should merge settings in right order', () => {
    const defaults = {
      locale: 'en',
      previewStep: false,
      crop: 'free',
    }

    const globals = {
      locale: 'ru',
      previewStep: true,
      tabs: 'one, two, three',
    }
    const locals = {locale: 'en'}

    const result = merge(defaults, globals, locals)

    expect(result).toEqual({
      locale: 'en',
      previewStep: true,
      tabs: 'one, two, three',
      crop: 'free',
    })
  })

  it.only('should correctly override falsy values', () => {
    const defaults = {
      multipartMinSize: 1,
      previewStep: true,
      crop: 'free',
      multiple: false,
    }

    const globals = {
      multipartMinSize: 0,
      previewStep: false,
      crop: undefined,
    }

    const locals = {
      locale: 'en',
      doNotStore: undefined,
      multiple: null,
    }

    const result = merge(defaults, globals, locals)

    expect(result).toEqual({
      doNotStore: undefined,
      multipartMinSize: 0,
      previewStep: false,
      crop: undefined,
      multiple: null,
      locale: 'en',
    })
  })
})
