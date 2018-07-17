/* eslint-disable max-nested-callbacks */

import {array} from './array'
import {SettingsError} from 'errors/SettingsError'

describe('array', () => {
  it('should convert string to array', () => {
    expect(array('one two three')).toEqual(['one', 'two', 'three'])
  })

  it('should trim the result', () => {
    expect(array('  one    two     three')).toEqual(['one', 'two', 'three'])
  })

  it('should throw error if non-array passed', () => {
    expect(() => array(123)).toThrowError(SettingsError)
    expect(() => array({})).toThrowError(SettingsError)
  })

  it('should return empty array if empty string passed', () => {
    expect(array('')).toEqual([])
  })

  it('should return arrays untouched', () => {
    expect(array(['one', 'two', 'three'])).toEqual(['one', 'two', 'three'])
  })
})
