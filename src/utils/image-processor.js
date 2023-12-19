import $ from 'jquery'

import { Blob, FileReader, URL } from '../utils/abilities'
import { imageLoader } from '../utils/image-loader'
import { fitSize, canvasToBlob, taskRunner } from '../utils'
import { isWindowDefined } from './is-window-defined'
import isBrowserApplyExif from './is-browser-apply-exif'
import { shrinkImage } from './shrink-image'

// utils image
var DataView = isWindowDefined() && window.DataView
var runner = taskRunner(1)

const shrinkFile = function (file, settings) {
  // in -> file
  // out <- blob
  const df = $.Deferred()
  if (!(URL && DataView && Blob)) {
    return df.reject('support')
  }
  // start = new Date()
  runner((release) => {
    // console.log('delayed: ' + (new Date() - start))
    df.always(release)
    // start = new Date()

    const op = shouldSkipShrink(file)
      .then((shouldSkip) => {
        if (shouldSkip) {
          df.reject('skipped')
          return $.Deferred().reject()
        }
      })
      .then(() =>
        stripIccProfile(file).fail(() => {
          df.reject('not image')
        })
      )

    op.done((img) => {
      // console.log('load: ' + (new Date() - start))
      df.notify(0.1)

      const exifOp = $.when(
        getExif(file),
        isBrowserApplyExif(),
        getIccProfile(file)
      ).always((exif, isExifApplied, iccProfile) => {
        df.notify(0.2)
        const isJPEG = exifOp.state() === 'resolved'
        // start = new Date()
        const op = shrinkImage(img, settings)
        op.progress((progress) => {
          return df.notify(0.2 + progress * 0.6)
        })
        op.fail(df.reject)
        op.done((canvas) => {
          // console.log('shrink: ' + (new Date() - start))
          // start = new Date()
          let format = 'image/jpeg'
          let quality = settings.quality || 0.8
          if (!isJPEG && hasTransparency(canvas)) {
            format = 'image/png'
            quality = undefined
          }
          canvasToBlob(canvas, format, quality, (blob) => {
            canvas.width = canvas.height = 1
            df.notify(0.9)
            // console.log('to blob: ' + (new Date() - start))
            let replaceChain = $.Deferred().resolve(blob)
            if (exif) {
              replaceChain = replaceChain
                .then((blob) => replaceExif(blob, exif, isExifApplied))
                .catch(() => blob)
            }
            if (iccProfile?.length > 0) {
              replaceChain = replaceChain
                .then((blob) => replaceIccProfile(blob, iccProfile))
                .catch(() => blob)
            }

            replaceChain.done(df.resolve)
            replaceChain.fail(() => df.resolve(blob))
          })
        })
      })
    })
  })

  return df.promise()
}

const drawFileToCanvas = function (file, mW, mH, bg, maxSource) {
  var df, op
  // in -> file
  // out <- canvas
  df = $.Deferred()
  if (!URL) {
    return df.reject('support')
  }
  op = imageLoader(URL.createObjectURL(file))
  op.always(function (img) {
    return URL.revokeObjectURL(img.src)
  })
  op.fail(function () {
    return df.reject('not image')
  })
  op.done(function (img) {
    df.always(function () {
      img.src = '//:0'
    })
    if (maxSource && img.width * img.height > maxSource) {
      return df.reject('max source')
    }
    return $.when(getExif(file), isBrowserApplyExif()).always(
      function (exif, isExifApplied) {
        var orientation = isExifApplied ? 1 : parseExifOrientation(exif) || 1
        var swap = orientation > 4
        var sSize = swap ? [img.height, img.width] : [img.width, img.height]
        var [dW, dH] = fitSize(sSize, [mW, mH])
        var trns = [
          [1, 0, 0, 1, 0, 0],
          [-1, 0, 0, 1, dW, 0],
          [-1, 0, 0, -1, dW, dH],
          [1, 0, 0, -1, 0, dH],
          [0, 1, 1, 0, 0, 0],
          [0, 1, -1, 0, dW, 0],
          [0, -1, -1, 0, dW, dH],
          [0, -1, 1, 0, 0, dH]
        ][orientation - 1]
        if (!trns) {
          return df.reject('bad image')
        }
        var canvas = document.createElement('canvas')
        canvas.width = dW
        canvas.height = dH
        var ctx = canvas.getContext('2d')
        ctx.transform.apply(ctx, trns)
        if (swap) {
          ;[dW, dH] = [dH, dW]
        }
        if (bg) {
          ctx.fillStyle = bg
          ctx.fillRect(0, 0, dW, dH)
        }
        ctx.drawImage(img, 0, 0, dW, dH)
        return df.resolve(canvas, sSize)
      }
    )
  })
  return df.promise()
}

// Util functions

const readJpegChunks = function (file) {
  var df, pos, readNext, readNextChunk, readToView
  readToView = function (file, cb) {
    var reader
    reader = new FileReader()
    reader.onload = function () {
      return cb(new DataView(reader.result))
    }
    reader.onerror = function (e) {
      return df.reject('reader', e)
    }
    return reader.readAsArrayBuffer(file)
  }
  readNext = function () {
    return readToView(file.slice(pos, pos + 128), function (view) {
      var i, j, ref
      for (
        i = j = 0, ref = view.byteLength;
        ref >= 0 ? j < ref : j > ref;
        i = ref >= 0 ? ++j : --j
      ) {
        if (view.getUint8(i) === 0xff) {
          pos += i
          break
        }
      }
      return readNextChunk()
    })
  }

  readNextChunk = function () {
    var startPos
    startPos = pos

    // todo fix
    // eslint-disable-next-line no-return-assign
    return readToView(file.slice(pos, (pos += 4)), function (view) {
      var length, marker
      if (view.byteLength !== 4 || view.getUint8(0) !== 0xff) {
        return df.reject('corrupted')
      }
      marker = view.getUint8(1)
      if (marker === 0xda) {
        // Start Of Scan
        // console.log('read jpeg chunks: ' + (new Date() - start))
        return df.resolve()
      }
      length = view.getUint16(2) - 2
      // eslint-disable-next-line no-return-assign
      return readToView(file.slice(pos, (pos += length)), function (view) {
        if (view.byteLength !== length) {
          return df.reject('corrupted')
        }
        df.notify(startPos, length, marker, view)
        return readNext()
      })
    })
  }
  df = $.Deferred()
  if (!(FileReader && DataView)) {
    return df.reject('support')
  }
  // start = new Date()
  pos = 2
  readToView(file.slice(0, 2), function (view) {
    if (view.getUint16(0) !== 0xffd8) {
      return df.reject('not jpeg')
    }
    return readNext()
  })
  return df.promise()
}

const replaceJpegChunk = function (blob, marker, chunks) {
  var df, oldChunkLength, oldChunkPos, op
  df = $.Deferred()
  oldChunkPos = []
  oldChunkLength = []
  op = readJpegChunks(blob)
  op.fail(df.reject)
  op.progress(function (pos, length, oldMarker) {
    if (oldMarker === marker) {
      oldChunkPos.push(pos)
      return oldChunkLength.push(length)
    }
  })
  op.done(function () {
    var chunk, i, intro, j, k, len, newChunks, pos, ref
    newChunks = [blob.slice(0, 2)]
    for (j = 0, len = chunks.length; j < len; j++) {
      chunk = chunks[j]
      intro = new DataView(new ArrayBuffer(4))
      intro.setUint16(0, 0xff00 + marker)
      intro.setUint16(2, chunk.byteLength + 2)
      newChunks.push(intro.buffer)
      newChunks.push(chunk)
    }
    pos = 2
    for (
      i = k = 0, ref = oldChunkPos.length;
      ref >= 0 ? k < ref : k > ref;
      i = ref >= 0 ? ++k : --k
    ) {
      if (oldChunkPos[i] > pos) {
        newChunks.push(blob.slice(pos, oldChunkPos[i]))
      }
      pos = oldChunkPos[i] + oldChunkLength[i] + 4
    }
    newChunks.push(blob.slice(pos, blob.size))
    return df.resolve(
      new Blob(newChunks, {
        type: blob.type
      })
    )
  })
  return df.promise()
}

const getExif = function (file) {
  let exif = null
  const op = readJpegChunks(file)
  op.progress(function (pos, l, marker, view) {
    if (!exif && marker === 0xe1) {
      if (view.byteLength >= 14) {
        if (
          // check for "Exif\0"
          view.getUint32(0) === 0x45786966 &&
          view.getUint16(4) === 0
        ) {
          exif = view
          return exif
        }
      }
    }
  })
  return op.then(
    () => exif,
    () => $.Deferred().reject(exif)
  )
}

const getIccProfile = function (file) {
  const iccProfile = []
  const op = readJpegChunks(file)
  op.progress(function (pos, l, marker, view) {
    if (marker === 0xe2) {
      if (
        // check for "ICC_PROFILE\0"
        view.getUint32(0) === 0x4943435f &&
        view.getUint32(4) === 0x50524f46 &&
        view.getUint32(8) === 0x494c4500
      ) {
        iccProfile.push(view)
      }
    }
  })
  return op.then(
    () => iccProfile,
    () => $.Deferred().reject(iccProfile)
  )
}

const replaceExif = function (blob, exif, isExifApplied) {
  if (isExifApplied) {
    setExifOrientation(exif, 1)
  }
  return replaceJpegChunk(blob, 0xe1, [exif.buffer])
}

const replaceIccProfile = function (blob, iccProfile) {
  return replaceJpegChunk(
    blob,
    0xe2,
    iccProfile.map((chunk) => chunk.buffer)
  )
}

const stripIccProfile = function (inputFile) {
  const df = $.Deferred()

  replaceIccProfile(inputFile, [])
    .catch(() => inputFile)
    .then((file) => {
      const op = imageLoader(URL.createObjectURL(file))
      op.always((img) => {
        URL.revokeObjectURL(img.src)
      })
      op.fail(() => {
        df.reject()
      })
      op.done((img) => {
        df.resolve(img)
      })
    })
    .fail(() => {
      df.reject()
    })

  return df.promise()
}

const shouldSkipShrink = (file) => {
  const allowLayers = [
    1, // L (black-white)
    3 // RGB
  ]
  const markers = [
    0xc0, // ("SOF0", "Baseline DCT", SOF)
    0xc1, // ("SOF1", "Extended Sequential DCT", SOF)
    0xc2, // ("SOF2", "Progressive DCT", SOF)
    0xc3, // ("SOF3", "Spatial lossless", SOF)
    0xc5, // ("SOF5", "Differential sequential DCT", SOF)
    0xc6, // ("SOF6", "Differential progressive DCT", SOF)
    0xc7, // ("SOF7", "Differential spatial", SOF)
    0xc9, // ("SOF9", "Extended sequential DCT (AC)", SOF)
    0xca, // ("SOF10", "Progressive DCT (AC)", SOF)
    0xcb, // ("SOF11", "Spatial lossless DCT (AC)", SOF)
    0xcd, // ("SOF13", "Differential sequential DCT (AC)", SOF)
    0xce, // ("SOF14", "Differential progressive DCT (AC)", SOF)
    0xcf // ("SOF15", "Differential spatial (AC)", SOF)
  ]
  let skip = false
  const op = readJpegChunks(file)
  op.progress(function (pos, l, marker, view) {
    if (!skip && markers.indexOf(marker) >= 0) {
      const layer = view.getUint8(5)
      if (allowLayers.indexOf(layer) < 0) {
        skip = true
      }
    }
  })
  return op.then(() => skip).catch(() => skip)
}

const setExifOrientation = function (exif, orientation) {
  findExifOrientation(exif, (offset, little) =>
    exif.setUint16(offset, orientation, little)
  )
}

const parseExifOrientation = function (exif) {
  return findExifOrientation(exif, (offset, little) =>
    exif.getUint16(offset, little)
  )
}

const findExifOrientation = function (exif, exifCallback) {
  var count, j, little, offset, ref
  if (
    !exif ||
    exif.byteLength < 14 ||
    exif.getUint32(0) !== 0x45786966 ||
    exif.getUint16(4) !== 0
  ) {
    return null
  }
  if (exif.getUint16(6) === 0x4949) {
    little = true
  } else if (exif.getUint16(6) === 0x4d4d) {
    little = false
  } else {
    return null
  }
  if (exif.getUint16(8, little) !== 0x002a) {
    return null
  }
  offset = 8 + exif.getUint32(10, little)
  count = exif.getUint16(offset - 2, little)
  for (j = 0, ref = count; ref >= 0 ? j < ref : j > ref; ref >= 0 ? ++j : --j) {
    if (exif.byteLength < offset + 10) {
      return null
    }
    if (exif.getUint16(offset, little) === 0x0112) {
      return exifCallback(offset + 8, little)
    }
    offset += 12
  }
  return null
}

const hasTransparency = function (img) {
  var canvas, ctx, data, i, j, pcsn, ref
  pcsn = 50
  canvas = document.createElement('canvas')
  canvas.width = canvas.height = pcsn
  ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, pcsn, pcsn)
  data = ctx.getImageData(0, 0, pcsn, pcsn).data
  canvas.width = canvas.height = 1
  for (i = j = 3, ref = data.length; j < ref; i = j += 4) {
    if (data[i] < 254) {
      return true
    }
  }
  return false
}

export {
  shrinkFile,
  shrinkImage,
  drawFileToCanvas,
  readJpegChunks,
  replaceJpegChunk,
  getExif,
  parseExifOrientation,
  hasTransparency
}
