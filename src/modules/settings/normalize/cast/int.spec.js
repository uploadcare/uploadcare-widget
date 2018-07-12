import {int} from './int'

describe('int', () => {
  it('should convert string and numbers value to int', () => {
    expect(int('123')).toBe(123)
    expect(int(123)).toBe(123)
    expect(int(123.123)).toBe(123)
  })

  it('should return null if wrong input received', () => {
    expect(int('test')).toBe(null)
    expect(int({})).toBe(null)
  })
})
