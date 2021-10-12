import { log } from './warnings'

const TestPixel = {
  R: 55,
  G: 110,
  B: 165,
  A: 255
}

const FILL_STYLE = `rgba(${TestPixel.R}, ${TestPixel.G}, ${TestPixel.B}, ${
  TestPixel.A / 255
})`

export function canvasTest(width, height) {
  // Wrapped into try/catch because memory alloction errors can be thrown due to insufficient RAM
  try {
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
      // On IE10, imageData have type CanvasPixelArray, not Uint8ClampedArray.
      // CanvasPixelArray supports index access operations only.
      // Array buffers can't be destructuredd and compared with JSON.stringify
      isTestPass =
        imageData[0] === TestPixel.R &&
        imageData[1] === TestPixel.G &&
        imageData[2] === TestPixel.B &&
        imageData[3] === TestPixel.A
    }

    testCvs.width = testCvs.height = 1

    return isTestPass
  } catch (e) {
    log(`Failed to test for max canvas size of ${width}x${height}.`, e)
    return false
  }
}
