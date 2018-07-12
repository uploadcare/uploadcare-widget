import {string} from './string'

describe('string', () => {
  it('should accept only strings', () => {
    expect(string('123')).toBe('123')
    expect(string('')).toBe('')
  })

  it('should return null if non-string passed', () => {
    expect(string(123)).toBe(null)
    expect(string({})).toBe(null)
  })
})
