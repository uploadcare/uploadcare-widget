import {merge} from './merge'

describe('merge', () => {
  it('should merge settings in right order', () => {
    const globals = {
      locale: 'ru',
      previewStep: true,
      tabs: 'one, two, three',
    }
    const attributes = {locale: 'en'}
    const options = {previewStep: false}

    const result = merge(globals, attributes, options)

    expect(result).toEqual(
      jasmine.objectContaining({
        locale: 'en',
        previewStep: false,
        tabs: 'one, two, three',
      })
    )
  })

  it('should correctly override falsy values', () => {
    const globals = {
      locale: 'ru',
      previewStep: '',
      doNotStore: true,
    }

    const attributes = {
      locale: 'en',
      doNotStore: undefined,
    }

    const options = {
      previewStep: false,
      doNotStore: null,
    }

    const result = merge(globals, attributes, options)

    expect(result).toEqual(
      jasmine.objectContaining({
        locale: 'en',
        previewStep: false,
        doNotStore: null,
      })
    )
  })
})
