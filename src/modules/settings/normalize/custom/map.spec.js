import {map} from './map'

describe('map', () => {
  it('should work as expected', () => {
    const mapZeroToFive = map(0, 5)

    expect(mapZeroToFive(0)).toBe(5)
    expect(mapZeroToFive(10)).toBe(10)
  })
})
