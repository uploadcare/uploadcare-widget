import $ from 'jquery'
import { defer } from '../utils'
import maxCanvasSize from './canvas-size'
import { log } from './warnings'

const shrinkCanvas = function(img, w, h, native) {
  const df = $.Deferred()

  defer(() => {
    const canvas = document.createElement('canvas')
    const cx = canvas.getContext('2d')

    canvas.width = w
    canvas.height = h

    if (native) {
      cx.imageSmoothingQuality = 'high'
    }
    cx.drawImage(img, 0, 0, w, h)

    img.src = '//:0' // for image
    img.width = img.height = 1 // for canvas

    df.resolve(canvas)
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
  steps.push([sW, sH])
  while (sW < sourceW) {
    sW = Math.round(sW / step)
    sH = Math.round(sH / step)

    if (sW < sourceW * step) {
      steps.push([sW, sH])
    }
  }
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
const runFallback = function(
  img,
  sourceW,
  targetW,
  targetH,
  maxArea,
  maxDimension,
  step
) {
  const steps = calcShrinkSteps(sourceW, targetW, targetH, step)
  const supportedSteps = steps.filter(([w, h]) => {
    return w * h <= maxArea && w <= maxDimension && h <= maxDimension
  })

  const seriesDf = $.Deferred()
  let chainedDf = $.Deferred()
  chainedDf.resolve(img)
  for (const [w, h] of supportedSteps) {
    chainedDf = chainedDf
      .then(canvas => shrinkCanvas(canvas, w, h, false))
      .then(canvas => {
        seriesDf.notify((sourceW - w) / (sourceW - targetW))
        return canvas
      })
  }
  chainedDf.done(canvas => {
    seriesDf.resolve(canvas)
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
  return shrinkCanvas(img, targetW, targetH, true)
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

  maxCanvasSize().done(({ maxDimension, maxArea }) => {
    // fit size to browser capabilities
    const targetSize = Math.min(maxArea, settings.size)
    let targetW = Math.floor(Math.sqrt(targetSize * ratio))
    let targetH = Math.floor(targetSize / Math.sqrt(targetSize * ratio))

    // fit dimensions to browser capabilities
    if (targetW > maxDimension) {
      targetW = maxDimension
      targetH = Math.round(targetW / ratio)
    }
    if (targetH > maxDimension) {
      targetH = maxDimension
      targetW = Math.round(ratio * targetH)
    }

    /*
     * If browser can't shrink image to specified size, we don't do it.
     * This condition isn't strict and controlled by BROWSER_CAPABILITY_RATIO.
     * Ratio 0.7 means we shrink image to at least 70% of specified size,
     * if browser doesn't support 100%
     */
    const BROWSER_CAPABILITY_RATIO = 0.7 // browser can / user specified
    const fittedSize = targetW * targetH
    const lowTargetSize = targetSize / settings.size < BROWSER_CAPABILITY_RATIO
    const lowFittedSize = fittedSize / settings.size < BROWSER_CAPABILITY_RATIO
    if (lowTargetSize || lowFittedSize) {
      return df.reject('not supported')
    }

    const cx = document.createElement('canvas').getContext('2d')
    const supportNative = 'imageSmoothingQuality' in cx

    const task = supportNative
      ? runNative(img, targetW, targetH)
      : runFallback(img, sourceW, targetW, targetH, maxArea, maxDimension, STEP)

    task
      .done(canvas => df.resolve(canvas))
      .progress(progress => df.notify(progress))
  })

  return df.promise()
}
