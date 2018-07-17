import {url} from './url'

jsdom.reconfigure({url: 'http://uploadcare.com'})

describe('url', () => {
  it('should convert normalize urls', () => {
    expect(url('google.com/')).toBe('google.com')
    expect(url('/google.com/')).toBe('/google.com')
    expect(url('//google.com/')).toBe('http://google.com')
    expect(url('http://google.com/')).toBe('http://google.com')
  })
})
