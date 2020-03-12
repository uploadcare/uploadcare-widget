// import $ from 'jquery'

import { FileReader, URL } from '../utils/abilities'
import { imageLoader } from '../utils/image-loader.ts'
import { fitSize } from '../utils'
// import { defer, fitSize, canvasToBlob, taskRunner } from '../utils'
import { isWindowDefined } from './is-window-defined'

// utils image
const DataView = isWindowDefined() && window.DataView
// const runner = taskRunner(1)

const shrinkFile = function(file, settings) {
  // var df
  // // in -> file
  // // out <- blob
  // df = $.Deferred()
  // if (!(URL && DataView && Blob)) {
  //   return df.reject('support')
  // }
  // // start = new Date()
  // runner(release => {
  //   var op
  //   // console.log('delayed: ' + (new Date() - start))
  //   df.always(release)
  //   // start = new Date()
  //   op = imageLoader(URL.createObjectURL(file))
  //   op.always(function(img) {
  //     return URL.revokeObjectURL(img.src)
  //   })
  //   op.fail(function() {
  //     return df.reject('not image')
  //   })

  //   return op.done(function(img) {
  //     // console.log('load: ' + (new Date() - start))
  //     df.notify(0.1)

  //     var exifOp = getExif(file).always(function(exif) {
  //       var e, isJPEG
  //       df.notify(0.2)
  //       isJPEG = exifOp.state() === 'resolved'
  //       // start = new Date()
  //       op = shrinkImage(img, settings)
  //       op.progress(function(progress) {
  //         return df.notify(0.2 + progress * 0.6)
  //       })
  //       op.fail(df.reject)
  //       op.done(function(canvas) {
  //         var format, quality
  //         // console.log('shrink: ' + (new Date() - start))
  //         // start = new Date()
  //         format = 'image/jpeg'
  //         quality = settings.quality || 0.8
  //         if (!isJPEG && hasTransparency(canvas)) {
  //           format = 'image/png'
  //           quality = undefined
  //         }
  //         return canvasToBlob(canvas, format, quality, function(blob) {
  //           canvas.width = canvas.height = 1
  //           df.notify(0.9)
  //           // console.log('to blob: ' + (new Date() - start))
  //           if (exif) {
  //             op = replaceJpegChunk(blob, 0xe1, [exif.buffer])
  //             op.done(df.resolve)
  //             return op.fail(function() {
  //               return df.resolve(blob)
  //             })
  //           } else {
  //             return df.resolve(blob)
  //           }
  //         })
  //       })
  //       e = null // free reference

  //       return e
  //     })

  //     return exifOp
  //   })
  // })

  // return df.promise()

  throw Error('not implemented')
}


const shrinkImage = function(img, settings) {
  // var cx,
  //   df,
  //   h,
  //   maxSize,
  //   maxSquare,
  //   originalW,
  //   ratio,
  //   run,
  //   runNative,
  //   sH,
  //   sW,
  //   step,
  //   w
  // // in -> image
  // // out <- canvas
  // df = $.Deferred()
  // step = 0.71 // sohuld be > sqrt(0.5)
  // if (img.width * step * img.height * step < settings.size) {
  //   return df.reject('not required')
  // }
  // sW = originalW = img.width
  // sH = img.height
  // ratio = sW / sH
  // w = Math.floor(Math.sqrt(settings.size * ratio))
  // h = Math.floor(settings.size / Math.sqrt(settings.size * ratio))
  // maxSquare = 5000000 // ios max canvas square
  // maxSize = 4096 // ie max canvas dimensions
  // run = function() {
  //   if (sW <= w) {
  //     df.resolve(img)
  //     return
  //   }
  //   return defer(function() {
  //     var canvas
  //     sW = Math.round(sW * step)
  //     sH = Math.round(sH * step)
  //     if (sW * step < w) {
  //       sW = w
  //       sH = h
  //     }
  //     if (sW * sH > maxSquare) {
  //       sW = Math.floor(Math.sqrt(maxSquare * ratio))
  //       sH = Math.floor(maxSquare / Math.sqrt(maxSquare * ratio))
  //     }
  //     if (sW > maxSize) {
  //       sW = maxSize
  //       sH = Math.round(sW / ratio)
  //     }
  //     if (sH > maxSize) {
  //       sH = maxSize
  //       sW = Math.round(ratio * sH)
  //     }
  //     canvas = document.createElement('canvas')
  //     canvas.width = sW
  //     canvas.height = sH
  //     canvas.getContext('2d').drawImage(img, 0, 0, sW, sH)
  //     img.src = '//:0' // for image
  //     img.width = img.height = 1 // for canvas
  //     img = canvas
  //     df.notify((originalW - sW) / (originalW - w))
  //     return run()
  //   })
  // }

  // runNative = function() {
  //   var canvas, cx
  //   canvas = document.createElement('canvas')
  //   canvas.width = w
  //   canvas.height = h
  //   cx = canvas.getContext('2d')
  //   cx.imageSmoothingQuality = 'high'
  //   cx.drawImage(img, 0, 0, w, h)
  //   img.src = '//:0' // for image
  //   img.width = img.height = 1 // for canvas
  //   return df.resolve(canvas)
  // }

  // cx = document.createElement('canvas').getContext('2d')

  // if ('imageSmoothingQuality' in cx) {
  //   runNative()
  // } else {
  //   run()
  // }
  // return df.promise()

  throw Error('not implemented')
}

const drawFileToCanvas = function(file, mW, mH, bg, maxSource) {
  // in -> file
  // out <- canvas
  let res = () => {}
  let rej = () => {}
  const promise = new Promise((resolve, reject) => {
    res = resolve
    rej = reject
  })

  if (!URL) {
    return rej(Error('support'))
  }
  const op = imageLoader(URL.createObjectURL(file))
  op.finally(function(img) {
    return URL.revokeObjectURL(img.src)
  })
  op.catch(function() {
    return rej(Error('not image'))
  })
  op.then(function(img) {
    promise.finally(function() {
      img.src = '//:0'
    })
    if (maxSource && img.width * img.height > maxSource) {
      return rej('max source')
    }
    return getExif(file).always(function(exif) {
      var canvas, ctx, dH, dW, orientation, sSize, swap, trns
      orientation = parseExifOrientation(exif) || 1
      swap = orientation > 4
      sSize = swap ? [img.height, img.width] : [img.width, img.height]
      ;[dW, dH] = fitSize(sSize, [mW, mH])
      trns = [
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
        return rej('bad image')
      }
      canvas = document.createElement('canvas')
      canvas.width = dW
      canvas.height = dH
      ctx = canvas.getContext('2d')
      ctx.transform.apply(ctx, trns)
      if (swap) {
        ;[dW, dH] = [dH, dW]
      }
      if (bg) {
        ctx.fillStyle = bg
        ctx.fillRect(0, 0, dW, dH)
      }
      ctx.drawImage(img, 0, 0, dW, dH)
      return res(canvas, sSize)
    })
  })

  return promise
}

// Util functions

const readJpegChunks = function(file) {
  let res = () => {}
  let rej = () => {}
  const promise = new Promise((resolve, reject) => {
    res = resolve
    rej = reject
  })
  let pos = 2

  const readToView = function(file, cb) {
    const reader = new FileReader()

    reader.onload = function() {
      return cb(new DataView(reader.result))
    }
    reader.onerror = function(e) {
      return rej(Error('reader'))
    }

    return reader.readAsArrayBuffer(file)
  }

  const readNext = function() {
    return readToView(file.slice(pos, pos + 128), function(view) {
      let i, j, ref
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

  const readNextChunk = function() {
    return readToView(file.slice(pos, (pos += 4)), function(view) {
      if (view.byteLength !== 4 || view.getUint8(0) !== 0xff) {
        return rej(Error('corrupted'))
      }
      const marker = view.getUint8(1)
      if (marker === 0xda) {
        // Start Of Scan
        // console.log('read jpeg chunks: ' + (new Date() - start))
        return res()
      }
      const length = view.getUint16(2) - 2
      // eslint-disable-next-line no-return-assign
      return readToView(file.slice(pos, (pos += length)), function(view) {
        if (view.byteLength !== length) {
          return rej(Error('corrupted'))
        }
        // df.notify(startPos, length, marker, view)
        return readNext()
      })
    })
  }

  if (!(FileReader && DataView)) {
    return rej(Error('support'))
  }

  readToView(file.slice(0, 2), function(view) {
    if (view.getUint16(0) !== 0xffd8) {
      return rej(Error('not jpeg'))
    }
    return readNext()
  })

  return promise
}

const replaceJpegChunk = function(blob, marker, chunks) {
  // var df, oldChunkLength, oldChunkPos, op
  // df = $.Deferred()
  // oldChunkPos = []
  // oldChunkLength = []
  // op = readJpegChunks(blob)
  // op.fail(df.reject)
  // op.progress(function(pos, length, oldMarker) {
  //   if (oldMarker === marker) {
  //     oldChunkPos.push(pos)
  //     return oldChunkLength.push(length)
  //   }
  // })
  // op.done(function() {
  //   var chunk, i, intro, j, k, len, newChunks, pos, ref
  //   newChunks = [blob.slice(0, 2)]
  //   for (j = 0, len = chunks.length; j < len; j++) {
  //     chunk = chunks[j]
  //     intro = new DataView(new ArrayBuffer(4))
  //     intro.setUint16(0, 0xff00 + marker)
  //     intro.setUint16(2, chunk.byteLength + 2)
  //     newChunks.push(intro.buffer)
  //     newChunks.push(chunk)
  //   }
  //   pos = 2
  //   for (
  //     i = k = 0, ref = oldChunkPos.length;
  //     ref >= 0 ? k < ref : k > ref;
  //     i = ref >= 0 ? ++k : --k
  //   ) {
  //     if (oldChunkPos[i] > pos) {
  //       newChunks.push(blob.slice(pos, oldChunkPos[i]))
  //     }
  //     pos = oldChunkPos[i] + oldChunkLength[i] + 4
  //   }
  //   newChunks.push(blob.slice(pos, blob.size))
  //   return df.resolve(
  //     new Blob(newChunks, {
  //       type: blob.type
  //     })
  //   )
  // })
  // return df.promise()

  throw Error('not implemented')
}

const getExif = function(file) {
  let exif = null
  const op = readJpegChunks(file)
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
      return Promise.reject(reason)
    }
  ).catch(reason => Promise.reject(reason))
}

const parseExifOrientation = function(exif) {
  if (
    !exif ||
    exif.byteLength < 14 ||
    exif.getUint32(0) !== 0x45786966 ||
    exif.getUint16(4) !== 0
  ) {
    return null
  }

  let little
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

  let offset = 8 + exif.getUint32(10, little)
  const count = exif.getUint16(offset - 2, little)
  let j
  let ref
  for (j = 0, ref = count; ref >= 0 ? j < ref : j > ref; ref >= 0 ? ++j : --j) {
    if (exif.byteLength < offset + 10) {
      return null
    }
    if (exif.getUint16(offset, little) === 0x0112) {
      return exif.getUint16(offset + 8, little)
    }
    offset += 12
  }
  return null
}

const hasTransparency = function(img) {
  let i, j
  const pcsn = 50
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = pcsn

  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, pcsn, pcsn)

  const data = ctx.getImageData(0, 0, pcsn, pcsn).data
  canvas.width = canvas.height = 1

  const ref = data.length
  for (i = j = 3, ref; j < ref; i = j += 4) {
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
