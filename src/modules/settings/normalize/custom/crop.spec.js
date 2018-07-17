/* eslint-disable max-nested-callbacks */

import {crop} from './crop'
import {SettingsError} from 'errors/SettingsError'

/*
"disabled", crop is disabled. Can’t be combined with other presets.
"" or "free", crop is enabled, and users can freely select any crop area on their images.
"2:3", any area with the aspect ratio of 2:3 can be selected for cropping.
"300x200" — same as above, but if the selected area is greater than 300x200 pixels,
the resulting image will be downscaled to fit the dimensions.
"300x200 upscale" — same as above, but even if the selected are is smaller,
the resulting image gets upscaled to fit the dimensions.
"300x200 minimum" — users won’t be able to define an area smaller than 300x200 pixels.
If an image we apply our crop to is smaller than 300x200 pixels,
it will be upscaled to fit the dimensions.
 */

describe('crop', () => {
  it('should return false on falsy values', () => {
    expect(crop('disabled')).toBe(false)
    expect(crop('false')).toBe(false)
    expect(crop(null)).toBe(false)
    expect(crop(undefined)).toBe(false)
  })

  it('should return free crop by default', () => {
    const free = {
      downscale: false,
      upscale: false,
      notLess: false,
      preferedSize: null,
    }

    expect(crop('')).toEqual([free])
    expect(crop('free')).toEqual([free])
  })
  it('should convert transform crop options in the right way', () => {
    expect(crop('2:3')).toEqual([
      {
        downscale: false,
        upscale: false,
        notLess: false,
        preferedSize: [2, 3],
      },
    ])

    expect(crop('300x200')).toEqual([
      {
        downscale: true,
        upscale: false,
        notLess: false,
        preferedSize: [300, 200],
      },
    ])
    expect(crop('300x200 upscale')).toEqual([
      {
        downscale: true,
        upscale: true,
        notLess: false,
        preferedSize: [300, 200],
      },
    ])
    expect(crop('300x200 minimum')).toEqual([
      {
        downscale: true,
        upscale: true,
        notLess: true,
        preferedSize: [300, 200],
      },
    ])
  })

  it('should should work with multiple presets', () => {
    expect(crop('free, 2:3, 300x200 upscale')).toEqual([
      {
        downscale: false,
        upscale: false,
        notLess: false,
        preferedSize: null,
      },
      {
        downscale: false,
        upscale: false,
        notLess: false,
        preferedSize: [2, 3],
      },
      {
        downscale: true,
        upscale: true,
        notLess: false,
        preferedSize: [300, 200],
      },
    ])
  })

  it('should throw error if wrong format is passed', () => {
    expect(() => crop('test')).toThrowError(SettingsError)
    expect(() => crop('free, test')).toThrowError(SettingsError)
    expect(() => crop('2x2 upscale, free, 2q2')).toThrowError(SettingsError)
  })
})
