import {array} from './array'

describe('array', () => {
  it('should convert string to array', () => {
    expect(array('one two three')).toEqual(['one', 'two', 'three'])
  })

  it('should trim the result', () => {
    expect(array('  one    two     three')).toEqual(['one', 'two', 'three'])
  })

  it('should return null if non-array passed', () => {
    expect(array(123)).toBe(null)
    expect(array({})).toBe(null)
  })

  it('should return null if empty string passed', () => {
    expect(array('')).toEqual(null)
  })

  it('should return arrays untouched', () => {
    expect(array(['one', 'two', 'three'])).toEqual(['one', 'two', 'three'])
  })
})
