import {boolean} from './boolean'

describe('boolean', () => {
  it('should convert any value to boolean', () => {
    // any thruthy value should be true
    expect(boolean('true')).toBe(true)
    expect(boolean('')).toBe(true)
    expect(boolean(1)).toBe(true)

    // except for the 'false', 'disabled' and other falsy values
    expect(boolean(' false ')).toBe(false)
    expect(boolean('false')).toBe(false)
    expect(boolean('disabled')).toBe(false)
    expect(boolean(0)).toBe(false)
  })
})
