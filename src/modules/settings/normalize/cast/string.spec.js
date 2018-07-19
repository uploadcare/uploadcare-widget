import {string} from './string'
import {SettingsError} from 'errors/SettingsError'

describe('string', () => {
  it('should accept only strings', () => {
    expect(string('123')).toBe('123')
    expect(string('')).toBe('')
  })

  it('should throw error if non-string passed', () => {
    expect(() => string(123)).toThrowError(SettingsError)
    expect(() => string({})).toThrowError(SettingsError)
  })
})
