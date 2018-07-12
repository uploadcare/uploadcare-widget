import {normalize} from './normalize'
import * as cast from './cast'

describe('normalize', () => {
  it('should normalize settings', () => {
    const settings = {
      previewStep: 'true',
      crop: 'false',
    }
    const result = normalize(settings)

    expect(result).toEqual(
      jasmine.objectContaining({
        previewStep: true,
        crop: false,
      })
    )
  })

  it('should make a shallow copy of settings object', () => {
    const schema = {}
    const settings = {foo: 'bar'}
    const result = normalize(settings, schema)

    expect(result == settings).toBe(false)
    expect(result).toEqual(settings)
  })

  it('should apply prepare reducers in LR order', () => {
    const schema = {prepare: {evilKey: [cast.int, value => `${value}, two,three`, cast.array]}}
    const settings = {evilKey: '666'}
    const result = normalize(settings, schema)

    expect(result).toEqual(jasmine.objectContaining({evilKey: ['666', 'two', 'three']}))
  })

  it('should not call a prepare reducer if value is undefined or null', () => {
    const transformer = jest.fn()
    const schema = {prepare: {foo: [cast.string, () => null, transformer]}}
    const settings = {foo: 'bar'}
    const result = normalize(settings, schema)

    expect(result).toEqual(jasmine.objectContaining({foo: null}))
    expect(transformer.mock.calls.length).toBe(0)
  })

  it('should apply a lazy reducer if value is undefined or null', () => {
    const transformer = jest.fn().mockReturnValueOnce('bar')
    const schema = {lazy: {foo: [cast.string, () => null, transformer]}}
    const settings = {foo: 'bar'}
    const result = normalize(settings, schema)

    expect(result).toEqual(jasmine.objectContaining({foo: 'bar'}))
    expect(transformer.mock.calls.length).toBe(1)
  })

  it('should apply lazy reducers after prepare ones', () => {
    const schema = {
      prepare: {foo: [() => 'baz']},
      lazy: {bar: (value, settings) => settings.foo},
    }
    const settings = {
      foo: 'bar',
      bar: undefined,
    }
    const result = normalize(settings, schema)

    expect(result).toEqual(
      jasmine.objectContaining({
        foo: 'baz',
        bar: 'baz',
      })
    )
  })
})
