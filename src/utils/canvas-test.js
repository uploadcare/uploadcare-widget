const sizes = [
  // Chrome 70 (Mac, Win)
  // Chrome 68 (Android 4.4)
  // Edge 17 (Win)
  // Safari 7-12 (Mac)
  16384,
  // Chrome 68 (Android 7.1-9)
  14188,
  // Chrome 68 (Android 5)
  11402,
  // Chrome 68 (Android 6)
  10836,
  // Firefox 63 (Mac, Win)
  11180,
  // IE 9-11 (Win)
  8192,
  // IE Mobile (Windows Phone 8.x)
  // Safari (iOS 9 - 12)
  4096,
  // Failed
  1
]

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
    testCtx.fillRect.apply(testCtx, fill)

    // Render the test pixel in the bottom-right corner of the
    // test canvas in the top-left of the 1x1 crop canvas. This
    // dramatically reducing the time for getImageData to complete.
    cropCtx.drawImage(testCvs, width - 1, height - 1, 1, 1, 0, 0, 1, 1)
  }

  // Verify image data (Pass = 255, Fail = 0)
  const isTestPass = cropCtx && cropCtx.getImageData(0, 0, 1, 1).data[3] !== 0

  testCvs.width = testCvs.height = 1

  return isTestPass
}

const test = () => {
  for (let index = 0; index < sizes.length; ++index) {
    const size = sizes[index]

    if (canvasTest([size, size])) {
      return { maxSize: sizes[index], maxSquare: sizes[index] * sizes[index] }
    }
  }

  return {
    maxSize: 1,
    maxSquare: 1
  }
}

export default test
