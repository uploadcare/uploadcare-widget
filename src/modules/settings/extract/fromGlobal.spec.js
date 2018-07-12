import {fromGlobal} from './fromGlobal'

const clearGlobals = () => {
  for (const key of Object.keys(window)) {
    if (key.startsWith('UPLOADCARE_')) {
      delete window[key]
    }
  }
}

describe('fromGlobal', () => {
  beforeEach(clearGlobals)

  it('should return existing settings', () => {
    window.UPLOADCARE_LOCALE = 'ru'
    window.UPLOADCARE_TABS = 'one,two'
    window.UPLOADCARE_PREVIEW_STEP = true

    const globals = fromGlobal()

    expect(globals).toEqual(
      jasmine.objectContaining({
        locale: 'ru',
        tabs: 'one,two',
        previewStep: true,
      })
    )
  })

  it('should ignore unsupported settings', () => {
    window.UPLOADCARE_LOCALE = 'ru'
    window.UPLOADCARE_NOT_SUPPORTED = 'not_supported'

    const globals = fromGlobal()

    expect(globals).toEqual(
      jasmine.objectContaining({locale: 'ru'})
    )
  })
})
