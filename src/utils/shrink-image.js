import $ from 'jquery'
import { defer } from '../utils'
import { testCanvasSize } from './canvas-size'
import { log } from './warnings'
import { iOSVersion, isIpadOs } from '../utils/abilities'

const resizeCanvas = function(img, w, h) {
  const df = $.Deferred()

  defer(() => {
    try {
      const canvas = document.createElement('canvas')
      const cx = canvas.getContext('2d')

      canvas.width = w
      canvas.height = h

      cx.imageSmoothingQuality = 'high'
      cx.drawImage(img, 0, 0, w, h)

      img.src = '//:0' // for image
      img.width = img.height = 1 // for canvas

      df.resolve(canvas)
    } catch (e) {
      log(`Failed to shrink image to size ${w}x${h}.`, e)
      df.reject(e)
    }
  })

  return df.promise()
}

/**
 * Goes from target to source by step, the last incomplete step is dropped.
 * Always returns at least one step - target. Source step is not included.
 * Sorted descending.
 *
 * Example with step = 0.71, source = 2000, target = 400
 * 400 (target) <- 563 <- 793 <- 1117 <- 1574 (dropped) <- [2000 (source)]
 */
const calcShrinkSteps = function(sourceW, targetW, targetH, step) {
  const steps = []
  let sW = targetW
  let sH = targetH

  // result should include at least one target step,
  // even if abs(source - target) < step * source
  // just to be sure nothing will break
  // if the original resolution / target resolution condition changes
  do {
    steps.push([sW, sH])
    sW = Math.round(sW / step)
    sH = Math.round(sH / step)
  } while (sW < sourceW * step)

  return steps.reverse()
}

/**
 * Fallback resampling algorithm
 *
 * Reduces dimensions by step until reaches target dimensions,
 * this gives a better output quality than one-step method
 *
 * Target dimensions expected to be supported by browser,
 * unsupported steps will be dropped.
 */
const runFallback = function(img, sourceW, targetW, targetH, step) {
  const steps = calcShrinkSteps(sourceW, targetW, targetH, step)

  const seriesDf = $.Deferred()
  let chainedDf = $.Deferred()
  chainedDf.resolve(img)
  for (const [w, h] of steps) {
    chainedDf = chainedDf
      .then(canvas => {
        const df = $.Deferred()
        testCanvasSize(w, h)
          .then(() => df.resolve(canvas, false))
          .fail(() => df.resolve(canvas, true))
        return df.promise()
      })
      .then((canvas, skip) => {
        return skip ? canvas : resizeCanvas(canvas, w, h)
      })
      .then(canvas => {
        seriesDf.notify((sourceW - w) / (sourceW - targetW))
        return canvas
      })
  }
  chainedDf.done(canvas => {
    seriesDf.resolve(canvas)
  })
  chainedDf.fail(error => {
    seriesDf.reject(error)
  })

  return seriesDf.promise()
}

/**
 * Native high-quality canvas resampling
 *
 * Browser support: https://caniuse.com/mdn-api_canvasrenderingcontext2d_imagesmoothingenabled
 * Target dimensions expected to be supported by browser.
 */
const runNative = function(img, targetW, targetH) {
  return resizeCanvas(img, targetW, targetH)
}

export const shrinkImage = function(img, settings) {
  // in -> image
  // out <- canvas
  const df = $.Deferred()

  // do not shrink image if original resolution / target resolution ratio falls behind 2.0
  const STEP = 0.71 // should be > sqrt(0.5)
  if (img.width * STEP * img.height * STEP < settings.size) {
    return df.reject('not required')
  }
  const sourceW = img.width
  const sourceH = img.height
  const ratio = sourceW / sourceH

  // target size shouldn't be greater than settings.size in any case
  const targetW = Math.floor(Math.sqrt(settings.size * ratio))
  const targetH = Math.floor(settings.size / Math.sqrt(settings.size * ratio))

  // we test the last step because we can skip all intermediate steps
  testCanvasSize(targetW, targetH)
    .fail(() => {
      df.reject('not supported')
    })
    .then(() => {
      const cx = document.createElement('canvas').getContext('2d')
      const supportNative = 'imageSmoothingQuality' in cx
      // native scaling on ios gives blurry results
      const useNativeScaling = supportNative && !iOSVersion && !isIpadOs

      const task = useNativeScaling
        ? runNative(img, targetW, targetH)
        : runFallback(img, sourceW, targetW, targetH, STEP)

      task
        .done(canvas => df.resolve(canvas))
        .progress(progress => df.notify(progress))
        .fail(() => df.reject('not supported'))
    })

  return df.promise()
}
