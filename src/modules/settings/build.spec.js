import {build} from './build'
import {defaults} from './defaults'

describe('build', () => {
  it('should accept a DOM input element', () => {
    const input = document.createElement('input')

    input.setAttribute('data-locale', 'my-locale')

    const settings = build(input)

    expect(settings).toEqual(expect.objectContaining({locale: 'my-locale'}))
  })

  it('should accept a user settings object', () => {
    const settings = build({locale: 'my-locale'})

    expect(settings).toEqual(expect.objectContaining({locale: 'my-locale'}))
  })

  it('should read global settings', () => {
    window.UPLOADCARE_PREVIEW_STEP = true

    const settings = build({locale: 'my-locale'})

    expect(settings).toEqual(
      expect.objectContaining({
        locale: 'my-locale',
        previewStep: true,
      })
    )
  })

  it('should apply default settings', () => {
    const settings = build({})

    expect(Object.keys(settings)).toEqual(Object.keys(defaults))
  })
})
