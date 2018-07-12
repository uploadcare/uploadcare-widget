import {constrain} from './constrain'

describe('constrain', () => {
  it('should work as expected', () => {
    const constrainFromFiveToTen = constrain(5, 10)

    expect(constrainFromFiveToTen(-10)).toBe(5)
    expect(constrainFromFiveToTen(0)).toBe(5)
    expect(constrainFromFiveToTen(999)).toBe(10)

    expect(constrainFromFiveToTen(5)).toBe(5)
    expect(constrainFromFiveToTen(10)).toBe(10)

    expect(constrainFromFiveToTen(6)).toBe(6)
    expect(constrainFromFiveToTen(9)).toBe(9)
  })
})
