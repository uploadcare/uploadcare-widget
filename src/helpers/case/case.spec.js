import {camel2upper, camel2kebab, kebab2upperCamelCase} from './case'

describe('camel2upper', () => {
  it('should convert camelCase to UPPER_CASE', () => {
    expect(camel2upper('camelCase')).toBe('CAMEL_CASE')
    expect(camel2upper('camel')).toBe('CAMEL')
  })
})

describe('camel2kebab', () => {
  it('should convert camelCase to kebab-case', () => {
    expect(camel2kebab('camelCase')).toBe('camel-case')
    expect(camel2kebab('camel')).toBe('camel')
  })
})

describe('kebab2upperCamelCase', () => {
  it('should convert kebab-case to UpperCamelCase', () => {
    expect(kebab2upperCamelCase('camel-case')).toBe('CamelCase')
    expect(kebab2upperCamelCase('camel')).toBe('Camel')
  })
})
