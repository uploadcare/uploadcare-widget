import {int} from './int'
import {SettingsError} from 'errors/SettingsError'

describe('int', () => {
  it('should convert string and numbers value to int', () => {
    expect(int('123')).toBe(123)
    expect(int(123)).toBe(123)
    expect(int(123.123)).toBe(123)
  })

  it('should throw error if wrong input received', () => {
    expect(() => int('test')).toThrowError(SettingsError)
    expect(() => int({})).toThrowError(SettingsError)
  })
})
