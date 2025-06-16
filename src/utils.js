import $ from 'jquery'

import { warn } from './utils/warnings'

var indexOf = [].indexOf

// utils
const unique = function (arr) {
  var item, j, len, result
  result = []
  for (j = 0, len = arr.length; j < len; j++) {
    item = arr[j]
    if (indexOf.call(result, item) < 0) {
      result.push(item)
    }
  }
  return result
}

const defer = function (fn) {
  return setTimeout(fn, 0)
}

const gcd = function (a, b) {
  var c
  while (b) {
    c = a % b
    a = b
    b = c
  }
  return a
}

const once = function (fn) {
  var called, result
  called = false
  result = null
  return function () {
    if (!called) {
      result = fn.apply(this, arguments)
      called = true
    }
    return result
  }
}

const wrapToPromise = function (value) {
  return $.Deferred().resolve(value).promise()
}

// same as promise.then(), but if filter returns promise
// it will be just passed forward without any special behavior
const then = function (pr, doneFilter, failFilter, progressFilter) {
  var compose, df
  df = $.Deferred()
  compose = function (fn1, fn2) {
    if (fn1 && fn2) {
      return function () {
        return fn2.call(this, fn1.apply(this, arguments))
      }
    } else {
      return fn1 || fn2
    }
  }
  pr.then(
    compose(doneFilter, df.resolve),
    compose(failFilter, df.reject),
    compose(progressFilter, df.notify)
  )
  return df.promise()
}

// Build copy of source with only specified methods.
// Handles chaining correctly.
const bindAll = function (source, methods) {
  var target
  target = {}

  $.each(methods, function (i, method) {
    var fn = source[method]

    if ($.isFunction(fn)) {
      target[method] = function (...args) {
        var result = fn.apply(source, args)

        // Fix chaining
        if (result === source) {
          return target
        } else {
          return result
        }
      }
    } else {
      target[method] = fn
    }
  })
  return target
}

const upperCase = function (s) {
  return s.replace(/([A-Z])/g, '_$1').toUpperCase()
}

const publicCallbacks = function (callbacks) {
  var result
  result = callbacks.add
  result.add = callbacks.add
  result.remove = callbacks.remove
  return result
}

const uuid = function () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0
    var v = c === 'x' ? r : (r & 3) | 8

    return v.toString(16)
  })
}

// splitUrlRegex("url") => ["url", "scheme", "host", "path", "query", "fragment"]
const splitUrlRegex =
  /^(?:([^:/?#]+):)?(?:\/\/([^/?#]*))?([^?#]*)\??([^#]*)#?(.*)$/
const uuidRegex =
  /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i
const groupIdRegex = new RegExp(`${uuidRegex.source}~[0-9]+`, 'i')
const cdnUrlRegex = new RegExp(
  `^/?(${uuidRegex.source})(?:/(-/(?:[^/]+/)+)?([^/]*))?$`,
  'i'
)
const splitCdnUrl = function (url) {
  return cdnUrlRegex.exec(splitUrlRegex.exec(url)[3])
}
const escapeRegExp = function (str) {
  return str.replace(/[\\-\\[]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
}

const globRegexp = function (str, flags = 'i') {
  var parts
  parts = $.map(str.split('*'), escapeRegExp)
  return new RegExp('^' + parts.join('.+') + '$', flags)
}

const normalizeUrl = function (url) {
  var scheme
  // google.com/ → google.com
  // /google.com/ → /google.com
  // //google.com/ → http://google.com
  // http://google.com/ → http://google.com
  scheme = document.location.protocol
  if (scheme !== 'http:') {
    scheme = 'https:'
  }
  return url.replace(/^\/\//, scheme + '//').replace(/\/+$/, '')
}
const fitText = function (text, max) {
  if (text.length > max) {
    const head = Math.ceil((max - 3) / 2)
    const tail = Math.floor((max - 3) / 2)
    return text.slice(0, head) + '...' + text.slice(-tail)
  } else {
    return text
  }
}

const fitSizeInCdnLimit = function (objSize) {
  return fitSize(objSize, [2048, 2048])
}

const fitSize = function (objSize, boxSize, upscale) {
  var heightRation, widthRatio
  if (objSize[0] > boxSize[0] || objSize[1] > boxSize[1] || upscale) {
    widthRatio = boxSize[0] / objSize[0]
    heightRation = boxSize[1] / objSize[1]
    if (!boxSize[0] || (boxSize[1] && widthRatio > heightRation)) {
      return [Math.round(heightRation * objSize[0]), boxSize[1]]
    } else {
      return [boxSize[0], Math.round(widthRatio * objSize[1])]
    }
  } else {
    return objSize.slice()
  }
}

const applyCropCoordsToInfo = function (info, crop, size, coords) {
  var downscale, h, modifiers, prefered, upscale, w, wholeImage
  ;({ width: w, height: h } = coords)
  prefered = crop.preferedSize
  modifiers = ''
  wholeImage = w === size[0] && h === size[1]
  if (!wholeImage) {
    modifiers += `-/crop/${w}x${h}/${coords.left},${coords.top}/`
  }
  downscale = crop.downscale && (w > prefered[0] || h > prefered[1])
  upscale = crop.upscale && (w < prefered[0] || h < prefered[1])
  if (downscale || upscale) {
    ;[coords.sw, coords.sh] = prefered
    modifiers += `-/resize/${prefered.join('x')}/`
  } else if (!wholeImage) {
    modifiers += '-/preview/'
  }
  info = $.extend({}, info)
  info.cdnUrlModifiers = modifiers
  info.cdnUrl = `${info.originalUrl}${modifiers || ''}`
  info.crop = coords
  return info
}

const imagesOnlyAcceptTypes = [
  'image/*',
  'image/heif',
  'image/heif-sequence',
  'image/heic',
  'image/heic-sequence',
  'image/avif',
  'image/avif-sequence',
  '.heif',
  '.heifs',
  '.heic',
  '.heics',
  '.avif',
  '.avifs'
].join(',')

const fileInput = function (container, settings, fn) {
  var accept, input, run
  input = null
  accept = settings.inputAcceptTypes
  if (accept === '') {
    accept = settings.imagesOnly ? imagesOnlyAcceptTypes : null
  }

  ;(run = function () {
    input = (
      settings.multiple
        ? $('<input type="file" multiple>')
        : $('<input type="file">')
    )
      .attr('accept', accept)
      .css({
        position: 'absolute',
        top: 0,
        opacity: 0,
        margin: 0,
        padding: 0,
        width: 'auto',
        height: 'auto',
        cursor: container.css('cursor')
      })
      .on('change', function () {
        fn(this)
        $(this).hide()
        return run()
      })
    return container.append(input)
  })()

  return container
    .css({
      position: 'relative',
      overflow: 'hidden'
      // to make it posible to set `cursor:pointer` on button
      // http://stackoverflow.com/a/9182787/478603
    })
    .mousemove(function (e) {
      var left, top, width
      ;({ left, top } = $(this).offset())
      width = input.width()
      return input.css({
        left: e.pageX - left - width + 10,
        top: e.pageY - top - 10
      })
    })
}

const fileSelectDialog = function (container, settings, fn, attributes = {}) {
  var accept
  accept = settings.inputAcceptTypes
  if (accept === '') {
    accept = settings.imagesOnly ? imagesOnlyAcceptTypes : null
  }
  return $(
    settings.multiple ? '<input type="file" multiple>' : '<input type="file">'
  )
    .attr('accept', accept)
    .attr(attributes)
    .css({
      position: 'fixed',
      bottom: 0,
      opacity: 0
    })
    .on('change', function () {
      fn(this)
      return $(this).remove()
    })
    .appendTo(container)
    .focus()
    .click()
    .hide()
}

const fileSizeLabels = 'B KB MB GB TB PB EB ZB YB'.split(' ')

const readableFileSize = function (
  value,
  onNaN = '',
  prefix = '',
  postfix = ''
) {
  var digits, fixedTo, i, threshold
  value = parseInt(value, 10)
  if (isNaN(value)) {
    return onNaN
  }
  digits = 2
  i = 0
  threshold = 1000 - 5 * Math.pow(10, 2 - Math.max(digits, 3))
  while (value > threshold && i < fileSizeLabels.length - 1) {
    i++
    value /= 1024
  }
  value += 0.000000000000001
  fixedTo = Math.max(0, digits - Math.floor(value).toFixed(0).length)
  // fixed → number → string, to trim trailing zeroes
  value = Number(value.toFixed(fixedTo))
  // eslint-disable-next-line no-irregular-whitespace
  return `${prefix}${value} ${fileSizeLabels[i]}${postfix}`
}

const ajaxDefaults = {
  dataType: 'json',
  crossDomain: true,
  cache: false
}

const jsonp = function (url, type, data, options = {}) {
  const jqXHR = $.ajax($.extend({ url, type, data }, options, ajaxDefaults))
    .retry(options.retryConfig)
    .fail((_, textStatus, errorThrown) => {
      const text = `${textStatus} (${errorThrown})`
      warn(`JSONP unexpected error: ${text} while loading ${url}`)
    })

  const df = jqXHR.then(function (data) {
    if (data.error) {
      let message, code
      if (typeof data.error === 'string') {
        // /from_url/state/ case
        message = data.error
        code = data.error_code
      } else {
        // other cases (direct/multipart/group)
        message = data.error.content
        code = data.error.error_code
      }
      return $.Deferred().reject({ message, code })
    }

    return data
  })
  df.abort = jqXHR.abort.bind(jqXHR)
  return df
}

const canvasToBlob = function (canvas, type, quality, callback) {
  var arr, binStr, dataURL, i, j, ref
  if (window.HTMLCanvasElement.prototype.toBlob) {
    return canvas.toBlob(callback, type, quality)
  }
  dataURL = canvas.toDataURL(type, quality)
  dataURL = dataURL.split(',')
  binStr = window.atob(dataURL[1])
  arr = new Uint8Array(binStr.length)
  for (i = j = 0, ref = binStr.length; j < ref; i = j += 1) {
    arr[i] = binStr.charCodeAt(i)
  }
  return callback(
    new window.Blob([arr], {
      type: /:(.+\/.+);/.exec(dataURL[0])[1]
    })
  )
}

const taskRunner = function (capacity) {
  var queue, release, run, running
  running = 0
  queue = []
  release = function () {
    var task

    if (queue.length) {
      task = queue.shift()

      return defer(function () {
        return task(release)
      })
    } else {
      running -= 1

      return running
    }
  }

  run = function (task) {
    if (!capacity || running < capacity) {
      running += 1

      return defer(function () {
        return task(release)
      })
    } else {
      return queue.push(task)
    }
  }

  return run
}
// This is work around bug in jquery https://github.com/jquery/jquery/issues/2013
// action, add listener, callbacks,
// ... .then handlers, argument index, [final state]
const pipeTuples = [
  ['notify', 'progress', 2],
  ['resolve', 'done', 0],
  ['reject', 'fail', 1]
]

const fixedPipe = function (promise, ...fns) {
  return $.Deferred(function (newDefer) {
    return $.each(pipeTuples, function (i, tuple) {
      var fn
      // Map tuples (progress, done, fail) to arguments (done, fail, progress)
      fn = $.isFunction(fns[tuple[2]]) && fns[tuple[2]]
      return promise[tuple[1]](function () {
        var returned
        returned = fn && fn.apply(this, arguments)
        if (returned && $.isFunction(returned.promise)) {
          return returned
            .promise()
            .progress(newDefer.notify)
            .done(newDefer.resolve)
            .fail(newDefer.reject)
        } else {
          return newDefer[tuple[0] + 'With'](
            this === promise ? newDefer.promise() : this,
            fn ? [returned] : arguments
          )
        }
      })
    })
  }).promise()
}

const getMetadataObject = function (settings) {
  let metadata
  if (settings.metadataCallback) {
    metadata = settings.metadataCallback() || {}
  } else {
    metadata = settings.metadata || {}
  }
  metadata = { ...metadata }
  $.each(metadata, (key, value) => {
    metadata[key] = String(value)
  })
  return metadata
}

const isObject = function (input) {
  return Object.prototype.toString.call(input) === '[object Object]'
}

const getTopLevelOrigin = () => {
  const topLevelWindow = globalThis.top ?? globalThis.parent ?? globalThis.self
  try {
    return topLevelWindow.location.origin
  } catch (e) {
    console.warn('Unable to access top-level window location:', e)
    return globalThis.location.origin
  }
}

export {
  unique,
  defer,
  gcd,
  once,
  wrapToPromise,
  then,
  bindAll,
  upperCase,
  publicCallbacks,
  uuid,
  splitUrlRegex,
  uuidRegex,
  groupIdRegex,
  cdnUrlRegex,
  splitCdnUrl,
  escapeRegExp,
  globRegexp,
  normalizeUrl,
  fitText,
  fitSizeInCdnLimit,
  fitSize,
  applyCropCoordsToInfo,
  fileInput,
  fileSelectDialog,
  fileSizeLabels,
  readableFileSize,
  ajaxDefaults,
  jsonp,
  canvasToBlob,
  taskRunner,
  fixedPipe,
  getMetadataObject,
  isObject,
  getTopLevelOrigin
}
