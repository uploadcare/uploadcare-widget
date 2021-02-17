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

const shrinkFile = function(file, settings) {
  var df
  // in -> file
  // out <- blob
  df = $.Deferred()
  if (!(URL && DataView && Blob)) {
    return df.reject('support')
  }
  // start = new Date()
  runner(release => {
    var op
    // console.log('delayed: ' + (new Date() - start))
    df.always(release)
    // start = new Date()
    op = imageLoader(URL.createObjectURL(file))
    op.always(function(img) {
      return URL.revokeObjectURL(img.src)
    })
    op.fail(function() {
      return df.reject('not image')
    })

    return op.done(function(img) {
      // console.log('load: ' + (new Date() - start))
      df.notify(0.1)

      var exifOp = $.when(getExif(file), isBrowserApplyExif()).always(function(
        exif,
        isExifApplied
      ) {
        var e, isJPEG
        df.notify(0.2)
        isJPEG = exifOp.state() === 'resolved'
        // start = new Date()
        op = shrinkImage(img, settings)
        op.progress(function(progress) {
          return df.notify(0.2 + progress * 0.6)
        })
        op.fail(df.reject)
        op.done(function(canvas) {
          var format, quality
          // console.log('shrink: ' + (new Date() - start))
          // start = new Date()
          format = 'image/jpeg'
          quality = settings.quality || 0.8
          if (!isJPEG && hasTransparency(canvas)) {
            format = 'image/png'
            quality = undefined
          }
          return canvasToBlob(canvas, format, quality, function(blob) {
            canvas.width = canvas.height = 1
            df.notify(0.9)
            // console.log('to blob: ' + (new Date() - start))
            if (exif) {
              if (isExifApplied) {
                setExifOrientation(exif, 1)
              }
              op = replaceJpegChunk(blob, 0xe1, [exif.buffer])
              op.done(df.resolve)

              return op.fail(function() {
                return df.resolve(blob)
              })
            } else {
              return df.resolve(blob)
            }
          })
        })
        e = null // free reference

        return e
      })

      return exifOp
    })
  })

  return df.promise()
}

const drawFileToCanvas = function(file, mW, mH, bg, maxSource) {
  var df, op
  // in -> file
  // out <- canvas
  df = $.Deferred()
  if (!URL) {
    return df.reject('support')
  }
  op = imageLoader(URL.createObjectURL(file))
  op.always(function(img) {
    return URL.revokeObjectURL(img.src)
  })
  op.fail(function() {
    return df.reject('not image')
  })
  op.done(function(img) {
    df.always(function() {
      img.src = '//:0'
    })
    if (maxSource && img.width * img.height > maxSource) {
      return df.reject('max source')
    }
    return $.when(getExif(file), isBrowserApplyExif()).always(function(
      exif,
      isExifApplied
    ) {
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
    })
  })
  return df.promise()
}

// Util functions

const readJpegChunks = function(file) {
  var df, pos, readNext, readNextChunk, readToView
  readToView = function(file, cb) {
    var reader
    reader = new FileReader()
    reader.onload = function() {
      return cb(new DataView(reader.result))
    }
    reader.onerror = function(e) {
      return df.reject('reader', e)
    }
    return reader.readAsArrayBuffer(file)
  }
  readNext = function() {
    return readToView(file.slice(pos, pos + 128), function(view) {
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

  readNextChunk = function() {
    var startPos
    startPos = pos

    // todo fix
    // eslint-disable-next-line no-return-assign
    return readToView(file.slice(pos, (pos += 4)), function(view) {
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
      return readToView(file.slice(pos, (pos += length)), function(view) {
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
  readToView(file.slice(0, 2), function(view) {
    if (view.getUint16(0) !== 0xffd8) {
      return df.reject('not jpeg')
    }
    return readNext()
  })
  return df.promise()
}

const replaceJpegChunk = function(blob, marker, chunks) {
  var df, oldChunkLength, oldChunkPos, op
  df = $.Deferred()
  oldChunkPos = []
  oldChunkLength = []
  op = readJpegChunks(blob)
  op.fail(df.reject)
  op.progress(function(pos, length, oldMarker) {
    if (oldMarker === marker) {
      oldChunkPos.push(pos)
      return oldChunkLength.push(length)
    }
  })
  op.done(function() {
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

const getExif = function(file) {
  var exif, op
  exif = null
  op = readJpegChunks(file)
  op.progress(function(pos, l, marker, view) {
    if (!exif && marker === 0xe1) {
      if (view.byteLength >= 14) {
        if (view.getUint32(0) === 0x45786966 && view.getUint16(4) === 0) {
          exif = view
          return exif
        }
      }
    }
  })
  return op.then(
    function() {
      return exif
    },
    function(reason) {
      return $.Deferred().reject(exif, reason)
    }
  )
}

const setExifOrientation = function(exif, orientation) {
  findExifOrientation(exif, (offset, little) =>
    exif.setUint16(offset, orientation, little)
  )
}

const parseExifOrientation = function(exif) {
  return findExifOrientation(exif, (offset, little) =>
    exif.getUint16(offset, little)
  )
}

const findExifOrientation = function(exif, exifCallback) {
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

const hasTransparency = function(img) {
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
