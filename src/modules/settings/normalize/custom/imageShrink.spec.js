/* eslint-disable max-nested-callbacks */

import {imageShrink} from './imageShrink'
import {SettingsError} from 'errors/SettingsError'

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

  it('should throw error if size is bigger than 5000000', () => {
    expect(() => imageShrink('2500x2500')).toThrowError(SettingsError)
  })

  it('should throw error if wrong format passed', () => {
    expect(() => imageShrink('')).toThrowError(SettingsError)
    expect(() => imageShrink('test')).toThrowError(SettingsError)
    expect(() => imageShrink('200x200 999')).toThrowError(SettingsError)
    expect(() => imageShrink('200x200 999%')).toThrowError(SettingsError)
  })
})
