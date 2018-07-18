import {normalize} from './normalize'
import * as cast from './cast'

describe('normalize', () => {
  it('should normalize settings', () => {
    const settings = {
      previewStep: 'true',
      crop: 'false',
      pusherKey: null,
      publicKey: 'demopublickey',
      tabs: 'one two',
    }
    const result = normalize(settings)

    expect(result).toEqual({
      previewStep: true,
      crop: false,
      pusherKey: null,
      publicKey: 'demopublickey',
      tabs: ['one', 'two'],
    })
  })

  it('should make a shallow copy of settings object', () => {
    const schema = {stage0: {foo: [val => val]}}
    const settings = {foo: 'bar'}
    const result = normalize(settings, schema)

    // eslint-disable-next-line eqeqeq
    expect(result).not.toBe(settings)
    expect(result).toEqual(settings)
  })

  it('should apply reducers in LR order', () => {
    const schema = {stage0: {evilKey: [cast.int, value => `${value} two three`, cast.array]}}
    const settings = {evilKey: '666'}
    const result = normalize(settings, schema)

    expect(result).toEqual({evilKey: ['666', 'two', 'three']})
  })

  it('should stop stage0 composing if value is undefined or null', () => {
    const transformer = jest.fn()
    const schema = {stage0: {foo: [cast.string, () => null, transformer]}}
    const settings = {foo: 'bar'}
    const result = normalize(settings, schema)

    expect(result).toEqual({foo: null})
    expect(transformer.mock.calls.length).toBe(0)
  })

  it('should not stap stage1 composing if value is undefined or null', () => {
    const transformer = jest.fn().mockReturnValueOnce('bar')
    const schema = {
      stage0: {foo: [val => val]},
      stage1: {foo: [cast.string, () => null, transformer]},
    }
    const settings = {foo: 'bar'}
    const result = normalize(settings, schema)

    expect(result).toEqual({foo: 'bar'})
    expect(transformer.mock.calls.length).toBe(1)
  })

  it('should apply stage1 reducers after stage0 ones', () => {
    const schema = {
      stage0: {
        foo: [() => 'baz'],
        bar: [val => val],
      },
      stage1: {bar: [(value, settings) => settings.foo]},
    }
    const settings = {
      foo: 'bar',
      bar: undefined,
    }
    const result = normalize(settings, schema)

    expect(result).toEqual({
      foo: 'baz',
      bar: 'baz',
    })
  })

  it('should strip off unsupported options', () => {
    const settings = {
      previewStep: 'true',
      crop: 'false',
      unsupportedOption: 'test',
    }
    const result = normalize(settings)

    expect(result).toEqual({
      previewStep: true,
      crop: false,
    })
  })
})
