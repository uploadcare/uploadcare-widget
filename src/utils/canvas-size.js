import $ from 'jquery'
import { defer } from '../utils'
import { canvasTest } from './canvas-test'
import { memoize } from './memoize'

const sizes = {
  squareSide: [
    // Safari (iOS < 9, ram >= 256)
    // We are supported mobile safari < 9 since widget v2, by 5 Mpx limit
    // so it's better to continue support despite the absence of this browser in the support table
    Math.ceil(Math.sqrt(5 * 1000 * 1000)),
    // IE Mobile (Windows Phone 8.x)
    // Safari (iOS >= 9)
    4096,
    // Synthetic limit
    // Allocating larger canvases takes a lot of time - about ~200ms
    // 67 Mpx is more than enough for our users, so larger canvas sizes won't be tested for
    // IE 9 (Win)
    8192
  ],
  side: [
    // IE Mobile (Windows Phone 8.x)
    4096,
    // IE 9 (Win)
    // Safari (iOS 9)
    8192,
    // Synthetic limit
    // Edge 17 (Win)
    // IE11 (Win)
    16384
  ]
}

export const MAX_SQUARE_SIDE = sizes.squareSide[sizes.squareSide.length - 1]
export const MAX_SIDE = sizes.side[sizes.side.length - 1]

function asyncWrapper(fn) {
  return (...args) => {
    const df = $.Deferred()

    defer(() => {
      const passed = fn(...args)
      df.resolve(passed)
    })

    return df.promise()
  }
}

/**
 * Memoization key serealizer, that prevents unnecessary canvas tests.
 * No need to make test if we know that:
 * - browser supports higher canvas size
 * - browser doesn't support lower canvas size
 */
function memoKeySerializer([w], cache) {
  const cachedWidths = Object.keys(cache)
    .map(val => parseInt(val, 10))
    .sort((a, b) => a - b)

  for (let i = 0; i < cachedWidths.length; i++) {
    const cachedWidth = cachedWidths[i]
    const isSupported = !!cache[cachedWidth]
    // higher supported canvas size, return it
    if (cachedWidth > w && isSupported) {
      return cachedWidth
    }
    // lower unsupported canvas size, return it
    if (cachedWidth < w && !isSupported) {
      return cachedWidth
    }
  }

  // use canvas width as the key,
  // because we're doing dimension test by width - [dimension, 1]
  return w
}

// separate memoization for square and dimension tests
const squareTest = asyncWrapper(memoize(canvasTest, memoKeySerializer))
const dimensionTest = asyncWrapper(memoize(canvasTest, memoKeySerializer))

export function testCanvasSize(w, h) {
  const df = $.Deferred()

  const testSquareSide = sizes.squareSide.find(side => side * side >= w * h)
  const testSide = sizes.side.find(side => side >= w && side >= h)
  if (!testSquareSide || !testSide) {
    return df.reject()
  }

  const tasks = [
    squareTest(testSquareSide, testSquareSide),
    dimensionTest(testSide, 1)
  ]

  $.when(...tasks).done((squareSidePassed, sidePassed) => {
    if (squareSidePassed && sidePassed) {
      df.resolve()
    } else {
      df.reject()
    }
  })

  return df.promise()
}
