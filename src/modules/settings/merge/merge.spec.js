import {merge} from './merge'

describe('merge', () => {
  it('should merge settings in right order', () => {
    const globals = {
      locale: 'ru',
      previewStep: true,
      tabs: 'one, two, three',
    }
    const locals = {locale: 'en'}

    const result = merge(globals, locals)

    expect(result).toEqual(
      jasmine.objectContaining({
        locale: 'en',
        previewStep: true,
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

    const locals = {
      locale: 'en',
      doNotStore: undefined,
    }

    const result = merge(globals, locals)

    expect(result).toEqual(
      jasmine.objectContaining({
        locale: 'en',
        previewStep: '',
        doNotStore: undefined,
      })
    )
  })
})
