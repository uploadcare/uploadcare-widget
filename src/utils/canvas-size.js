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
    // IE 9 (Win)
    8192,
    // Firefox 63 (Mac, Win)
    11180,
    // Chrome 68 (Android 6)
    10836,
    // Chrome 68 (Android 5)
    11402,
    // Chrome 68 (Android 7.1-9)
    14188,
    // Chrome 70 (Mac, Win)
    // Chrome 68 (Android 4.4)
    // Edge 17 (Win)
    // Safari 7-12 (Mac)
    16384
  ],
  dimension: [
    // IE Mobile (Windows Phone 8.x)
    4096,
    // IE 9 (Win)
    8192,
    // Edge 17 (Win)
    // IE11 (Win)
    16384,
    // Chrome 70 (Mac, Win)
    // Chrome 68 (Android 4.4-9)
    // Firefox 63 (Mac, Win)
    32767,
    // Chrome 83 (Mac, Win)
    // Safari 7-12 (Mac)
    // Safari (iOS 9-12)
    // Actually Safari has a much bigger limits - 4194303 of width and 8388607 of height,
    // but we will not use them
    65535
  ]
}

export const MAX_SQUARE_SIDE = sizes.squareSide[sizes.squareSide.length - 1]

function wrapAsync(fn) {
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
function memoKeySerializer(args, cache) {
  const [w] = args
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
const squareTest = wrapAsync(memoize(canvasTest, memoKeySerializer))
const dimensionTest = wrapAsync(memoize(canvasTest, memoKeySerializer))

export function testCanvasSize(w, h) {
  const df = $.Deferred()

  const testSquareSide = sizes.squareSide.find(side => side * side >= w * h)
  const testDimension = sizes.dimension.find(side => side >= w && side >= h)
  if (!testSquareSide || !testDimension) {
    return df.reject()
  }

  const tasks = [
    squareTest(testSquareSide, testSquareSide),
    dimensionTest(testDimension, 1)
  ]

  $.when(...tasks).done((squareSupported, dimensionSupported) => {
    if (squareSupported && dimensionSupported) {
      df.resolve()
    } else {
      df.reject()
    }
  })

  return df.promise()
}
