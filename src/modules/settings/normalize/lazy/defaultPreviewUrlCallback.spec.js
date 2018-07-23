import {defaultPreviewUrlCallback} from './defaultPreviewUrlCallback'

describe('defaultPreviewUrlCallback', () => {
  it('should process any passed query correctly', () => {
    const test = (previewProxy, query, expectedResult) =>
      expect(defaultPreviewUrlCallback(previewProxy)(query)).toBe(expectedResult)

    test('http://domain/path', 'query', 'http://domain/path?url=query')
    test('http://domain/path/', 'query', 'http://domain/path/?url=query')
    test('http://domain/path/=', 'query', 'http://domain/path/=?url=query')
    test('http://domain/path/?', 'query', 'http://domain/path/?url=query')
    test('http://domain/path/?a', 'query', 'http://domain/path/?a&url=query')
    test('http://domain/path/?a=', 'query', 'http://domain/path/?a=query')
    test('http://domain/path/?a=b', 'query', 'http://domain/path/?a=b&url=query')
    test('http://domain/path/?a=b&', 'query', 'http://domain/path/?a=b&url=query')
  })
})
