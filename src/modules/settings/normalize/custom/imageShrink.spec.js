import {imageShrink} from './imageShrink'

/*
800x600, shrinks images to 0.48 megapixels with the default JPEG quality of 80%.
1600x1600 95%, shrinks images to 2.5 megapixels with 95% JPEG quality.
 */

describe('imageShrink', () => {
  it('should work as expected', () => {
    expect(imageShrink('800x600')).toEqual({
      size: 800 * 600,
      quality: null,
    })

    expect(imageShrink('1600x1600 95%')).toEqual({
      size: 1600 * 1600,
      quality: 0.95,
    })
  })
})
