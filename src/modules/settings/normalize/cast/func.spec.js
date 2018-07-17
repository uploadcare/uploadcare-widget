/* eslint-disable max-nested-callbacks */

import {func} from './func'
import {SettingsError} from 'errors/SettingsError'

describe('func', () => {
  it('should accept any function', () => {
    const fn = jest.fn()

    expect(func(fn)).toBe(fn)
  })

  it('should throw error if non-function passed', () => {
    expect(() => func()).toThrowError(SettingsError)
    expect(() => func('')).toThrowError(SettingsError)
    expect(() => func(123)).toThrowError(SettingsError)
    expect(() => func({})).toThrowError(SettingsError)
    expect(() => func(true)).toThrowError(SettingsError)
  })
})
