import {fromAttributes} from './fromAttributes'

describe('fromAttributes', () => {
  it('should return existing settings', () => {
    const element = document.createElement('input')

    element.setAttribute('data-locale', 'ru')
    element.setAttribute('data-tabs', 'one,two')
    element.setAttribute('data-crop', '')
    element.setAttribute('data-preview-step', 'true')

    const locals = fromAttributes(element)

    expect(locals).toEqual({
      locale: 'ru',
      tabs: 'one,two',
      crop: '',
      previewStep: 'true',
    })
  })

  it('should ignore unsupported settings', () => {
    const element = document.createElement('input')

    element.setAttribute('data-locale', 'ru')
    element.setAttribute('data-not-supported', 'not_supported')

    const locals = fromAttributes(element)

    expect(locals).toEqual({locale: 'ru'})
  })
})
