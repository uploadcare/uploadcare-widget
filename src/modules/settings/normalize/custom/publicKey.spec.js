import {publicKey} from './publicKey'

describe('publicKey', () => {
  beforeEach(() => {
    global.console = {warn: jest.fn()}
  })

  it('should not modify value', () => {
    expect(publicKey('test')).toBe('test')
    expect(publicKey(null)).toBe(null)
    expect(publicKey('')).toBe('')
  })

  it('should make console.warn if falsy value passed', () => {
    publicKey()
    publicKey(null)
    publicKey(undefined)
    publicKey('')

    expect(global.console.warn.mock.calls.length).toBe(4)
  })
})
