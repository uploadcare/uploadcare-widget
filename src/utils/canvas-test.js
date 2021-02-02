const sizes = {
  squareSide: [
    // Synthetic limit
    // Equals ~75 Mpx, which is the processing limit of our CDN
    // Allocating larger canvases takes a lot of time - about ~200ms
    // 75 Mpx is more than enough for our users, so larger canvas sizes won't be tested for
    8660,
    // IE 9 (Win)
    8192,
    // IE Mobile (Windows Phone 8.x)
    // Safari (iOS >= 9)
    4096,
    // Safari (iOS < 9, ram >= 256)
    2289,
    // Safari (iOS < 9, ram < 256)
    1773,
  ],
  side: [
    // Synthetic limit
    16384,
    // IE 9 (Win)
    // Safari (iOS 9)
    8192,
    // IE Mobile (Windows Phone 8.x)
    4096,
  ]
}

export const MAX_SQUARE_SIDE = sizes.squareSide[0]
export const MAX_SIDE = sizes.side[0]

const TestPixel = {
  R: 55,
  G: 110,
  B: 165,
  A: 255
}

const FILL_STYLE = `rgba(${TestPixel.R}, ${TestPixel.G}, ${
  TestPixel.B
}, ${TestPixel.A / 255})`

function canvasTest([width, height]) {
  const fill = [width - 1, height - 1, 1, 1] // x, y, width, height

  const cropCvs = document.createElement('canvas')
  cropCvs.width = 1
  cropCvs.height = 1
  const testCvs = document.createElement('canvas')
  testCvs.width = width
  testCvs.height = height

  const cropCtx = cropCvs.getContext('2d')
  const testCtx = testCvs.getContext('2d')

  if (testCtx) {
    testCtx.fillStyle = FILL_STYLE
    testCtx.fillRect.apply(testCtx, fill)

    // Render the test pixel in the bottom-right corner of the
    // test canvas in the top-left of the 1x1 crop canvas. This
    // dramatically reducing the time for getImageData to complete.
    cropCtx.drawImage(testCvs, width - 1, height - 1, 1, 1, 0, 0, 1, 1)
  }

  const imageData = cropCtx && cropCtx.getImageData(0, 0, 1, 1).data
  let isTestPass = false
  if (imageData) {
    // can't use array destructuring because transpiled code fails on IE10
    // there, imageData have type CanvasPixelArray, not Uint8ClampedArray
    const r = imageData[0]
    const g = imageData[1]
    const b = imageData[2]
    const a = imageData[3]
    // Verify test pixel (rgba channels should match TestPixel ones)
    isTestPass =
      r === TestPixel.R &&
      g === TestPixel.G &&
      b === TestPixel.B &&
      a === TestPixel.A
  }

  testCvs.width = testCvs.height = 1

  return isTestPass
}

const test = () => {
  let maxSquare = 0
  let maxSize = 0

  for (let i = 0; i < sizes.squareSide.length; ++i) {
    const side = sizes.squareSide[i]
    if (canvasTest([side, side])) {
      maxSquare = side * side
      break
    }
  }

  for (let i = 0; i < sizes.side.length; ++i) {
    const side = sizes.side[i]

    if (canvasTest([side, 1])) {
      maxSize = side
      break
    }
  }

  return {
    maxSquare,
    maxSize
  }
}

export default test
