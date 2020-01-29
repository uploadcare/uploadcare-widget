import { html } from './utils/html'

var indexOf = [].indexOf

// utils
const unique = function(arr) {
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

const defer = function(fn) {
  return setTimeout(fn, 0)
}

const gcd = function(a, b) {
  var c
  while (b) {
    c = a % b
    a = b
    b = c
  }
  return a
}

const once = function(fn) {
  var called, result
  called = false
  result = null
  return function() {
    if (!called) {
      result = fn.apply(this, arguments)
      called = true
    }
    return result
  }
}

const wrapToPromise = function(value) {
  return Promise.resolve(value)
}

// same as promise.then(), but if filter returns promise
// it will be just passed forward without any special behavior
const then = function(pr, doneFilter, failFilter, progressFilter) {
  const compose = function(fn1, fn2) {
    if (fn1 && fn2) {
      return function() {
        return fn2.call(this, fn1.apply(this, arguments))
      }
    } else {
      return fn1 || fn2
    }
  }

  return new Promise((resolve, reject) => {
    return pr.then(
      compose(
        doneFilter,
        resolve
      ),
      compose(
        failFilter,
        reject
      )
    )
  })
}

// Build copy of source with only specified methods.
// Handles chaining correctly.
const bindAll = function(source, methods) {
  var target
  target = {}

  each(methods, function(i, method) {
    var fn = source[method]

    if (isFunction(fn)) {
      target[method] = function(...args) {
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

const upperCase = function(s) {
  return s.replace(/([A-Z])/g, '_$1').toUpperCase()
}

const publicCallbacks = function(callbacks) {
  var result
  result = callbacks.add
  result.add = callbacks.add
  result.remove = callbacks.remove
  return result
}

const uuid = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0
    var v = c === 'x' ? r : (r & 3) | 8

    return v.toString(16)
  })
}

// splitUrlRegex("url") => ["url", "scheme", "host", "path", "query", "fragment"]
const splitUrlRegex = /^(?:([^:/?#]+):)?(?:\/\/([^/?#]*))?([^?#]*)\??([^#]*)#?(.*)$/
const uuidRegex = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i
const groupIdRegex = new RegExp(`${uuidRegex.source}~[0-9]+`, 'i')
const cdnUrlRegex = new RegExp(
  `^/?(${uuidRegex.source})(?:/(-/(?:[^/]+/)+)?([^/]*))?$`,
  'i'
)
const splitCdnUrl = function(url) {
  return cdnUrlRegex.exec(splitUrlRegex.exec(url)[3])
}
const escapeRegExp = function(str) {
  return str.replace(/[\\-\\[]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
}

const globRegexp = function(str, flags = 'i') {
  const parts = str.split('*').map(escapeRegExp)

  return new RegExp('^' + parts.join('.+') + '$', flags)
}

const normalizeUrl = function(url) {
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
const fitText = function(text, max) {
  var head, tail
  if (text.length > max) {
    head = Math.ceil((max - 3) / 2)
    tail = Math.floor((max - 3) / 2)
    return text.slice(0, head) + '...' + text.slice(-tail)
  } else {
    return text
  }
}

const fitSizeInCdnLimit = function(objSize) {
  return fitSize(objSize, [2048, 2048])
}

const fitSize = function(objSize, boxSize, upscale) {
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

const applyCropCoordsToInfo = function(info, crop, size, coords) {
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
  info = extend({}, info)
  info.cdnUrlModifiers = modifiers
  info.cdnUrl = `${info.originalUrl}${modifiers || ''}`
  info.crop = coords
  return info
}

const fileInput = function(container, settings, fn) {
  var run
  let input = null
  let accept = settings.inputAcceptTypes
  if (accept === '') {
    accept = settings.imagesOnly ? 'image/*' : null
  }

  ;(run = function() {
    input = document.createElement('input')
    input.type = 'file'

    if (settings.multiple) {
      input.setAttribute('multiple', '')
    }

    input.setAttribute('accept', accept)

    input.addEventListener('change', function() {
      fn(this)
      input.style.display = 'none'

      return run()
    })

    input.style.position = 'absolute'
    input.style.top = '0'
    input.style.opacity = '0'
    input.style.margin = '0'
    input.style.padding = '0'
    input.style.width = 'auto'
    input.style.height = 'auto'
    input.style.cursor = window.getComputedStyle(container).cursor

    return container.appendChild(input)
  })()

  container.style.position = 'relative'
  container.style.overflow = 'hidden'

  container.addEventListener('mousemove', function(e) {
    const rect = this.getBoundingClientRect()

    const { left, top } = {
      top: rect.top + document.body.scrollTop,
      left: rect.left + document.body.scrollLeft
    }
    const width = parseFloat(
      window.getComputedStyle(input, null).width.replace('px', '')
    )

    input.style.left = e.pageX - left - width + 10
    input.style.top = e.pageY - top - 10
  })

  return container
}

const fileSelectDialog = function(container, settings, fn, attributes = {}) {
  let accept = settings.inputAcceptTypes
  if (accept === '') {
    accept = settings.imagesOnly ? 'image/*' : null
  }

  const serializedAttr = Object.entries(attributes).reduce(
    (ser, [name, value]) => `${ser} ${name}='${value}'`,
    ''
  )

  const input = parseHTML(html`
    <input
      type="file" ${settings.multiple ? 'multiple' : ''}
      accept='${accept}'
      style="position: fixed;bottom: 0;opacity: 0;"
      ${serializedAttr}
    ></input>
  `)

  input.addEventListener('change', e => {
    fn(e.target)
    container.removeChild(input)
  })

  container.appendChild(input)

  input.click()

  input.style.display = 'none'
}

const fileSizeLabels = 'B KB MB GB TB PB EB ZB YB'.split(' ')

const readableFileSize = function(
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

const canvasToBlob = function(canvas, type, quality, callback) {
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

const taskRunner = function(capacity) {
  var queue, release, run, running
  running = 0
  queue = []
  release = function() {
    var task

    if (queue.length) {
      task = queue.shift()

      return defer(function() {
        return task(release)
      })
    } else {
      running -= 1

      return running
    }
  }

  run = function(task) {
    if (!capacity || running < capacity) {
      running += 1

      return defer(function() {
        return task(release)
      })
    } else {
      return queue.push(task)
    }
  }

  return run
}

const isFunction = fn => {
  // Support: Chrome <=57, Firefox <=52
  // In some browsers, typeof returns "function" for HTML <object> elements
  // (i.e., `typeof document.createElement( "object" ) === "function"`).
  // We don't want to classify *any* DOM node as a function.
  return typeof fn === 'function' && typeof fn.nodeType !== 'number'
}

const inArray = (elem, arr, i) => {
  return arr == null ? -1 : indexOf.call(arr, elem, i)
}

function toType(obj) {
  if (obj == null) {
    return obj + ''
  }

  const class2type = {}

  // Support: Android <=2.3 only (functionish RegExp)
  return typeof obj === 'object' || typeof obj === 'function'
    ? class2type[toString.call(obj)] || 'object'
    : typeof obj
}

const isArrayLike = obj => {
  function isWindow(obj) {
    return obj != null && obj === obj.window
  }

  // Support: real iOS 8.2 only (not reproducible in simulator)
  // `in` check used to prevent JIT error (gh-2145)
  // hasOwn isn't used here due to false negatives
  // regarding Nodelist length in IE
  var length = !!obj && 'length' in obj && obj.length
  var type = toType(obj)

  if (isFunction(obj) || isWindow(obj)) {
    return false
  }

  return (
    type === 'array' ||
    length === 0 ||
    (typeof length === 'number' && length > 0 && length - 1 in obj)
  )
}

const each = function(obj, callback) {
  var length
  var i = 0

  if (isArrayLike(obj)) {
    length = obj.length
    for (; i < length; i++) {
      if (callback.call(obj[i], i, obj[i]) === false) {
        break
      }
    }
  } else {
    for (i in obj) {
      if (callback.call(obj[i], i, obj[i]) === false) {
        break
      }
    }
  }

  return obj
}

const callbacks = function(options) {
  // Convert String-formatted options into Object-formatted ones
  function createOptions(options) {
    var object = {}
    const arr = options.match(/[^\x20\t\r\n\f]+/g) || []
    arr.forEach(function(_, flag) {
      object[flag] = true
    })
    return object
  }

  // Convert options from String-formatted to Object-formatted if needed
  // (we check in cache first)
  options =
    typeof options === 'string'
      ? createOptions(options)
      : Object.assign({}, options)

  // Flag to know if list is currently firing
  var firing
  // Last fire value for non-forgettable lists
  var memory
  // Flag to know if list was already fired
  var fired
  // Flag to prevent firing
  var locked
  // Actual callback list
  var list = []
  // Queue of execution data for repeatable lists
  var queue = []
  // Index of currently firing callback (modified by add/remove as needed)
  var firingIndex = -1
  // Fire callbacks
  var fire = function() {
    // Enforce single-firing
    locked = locked || options.once

    // Execute callbacks for all pending executions,
    // respecting firingIndex overrides and runtime changes
    fired = firing = true
    for (; queue.length; firingIndex = -1) {
      memory = queue.shift()
      while (++firingIndex < list.length) {
        // Run callback and check for early termination
        if (
          list[firingIndex].apply(memory[0], memory[1]) === false &&
          options.stopOnFalse
        ) {
          // Jump to end and forget the data so .add doesn't re-fire
          firingIndex = list.length
          memory = false
        }
      }
    }

    // Forget the data if we're done with it
    if (!options.memory) {
      memory = false
    }

    firing = false

    // Clean up if we're done firing for good
    if (locked) {
      // Keep an empty list if we have data for future add calls
      if (memory) {
        list = []

        // Otherwise, this object is spent
      } else {
        list = ''
      }
    }
  }
  // Actual Callbacks object
  var self = {
    // Add a callback or a collection of callbacks to the list
    add: function() {
      if (list) {
        // If we have memory from a past run, we should fire after adding
        if (memory && !firing) {
          firingIndex = list.length - 1
          queue.push(memory)
        }

        ;(function add(args) {
          each(args, function(_, arg) {
            if (isFunction(arg)) {
              if (!options.unique || !self.has(arg)) {
                list.push(arg)
              }
            } else if (arg && arg.length && toType(arg) !== 'string') {
              // Inspect recursively
              add(arg)
            }
          })
        })(arguments)

        if (memory && !firing) {
          fire()
        }
      }
      return this
    },

    // Remove a callback from the list
    remove: function() {
      each(arguments, function(_, arg) {
        var index
        while ((index = inArray(arg, list, index)) > -1) {
          list.splice(index, 1)

          // Handle firing indexes
          if (index <= firingIndex) {
            firingIndex--
          }
        }
      })
      return this
    },

    // Check if a given callback is in the list.
    // If no argument is given, return whether or not list has callbacks attached.
    has: function(fn) {
      return fn ? inArray(fn, list) > -1 : list.length > 0
    },

    // Remove all callbacks from the list
    empty: function() {
      if (list) {
        list = []
      }
      return this
    },

    // Disable .fire and .add
    // Abort any current/pending executions
    // Clear all callbacks and values
    disable: function() {
      locked = queue = []
      list = memory = ''
      return this
    },
    disabled: function() {
      return !list
    },

    // Disable .fire
    // Also disable .add unless we have memory (since it would have no effect)
    // Abort any pending executions
    lock: function() {
      locked = queue = []
      if (!memory && !firing) {
        list = memory = ''
      }
      return this
    },
    locked: function() {
      return !!locked
    },

    // Call all callbacks with the given context and arguments
    fireWith: function(context, args) {
      if (!locked) {
        args = args || []
        args = [context, args.slice ? args.slice() : args]
        queue.push(args)
        if (!firing) {
          fire()
        }
      }
      return this
    },

    // Call all the callbacks with the given arguments
    fire: function() {
      self.fireWith(this, arguments)
      return this
    },

    // To know if the callbacks have already been called at least once
    fired: function() {
      return !!fired
    }
  }

  return self
}

const isPlainObject = function(obj) {
  var proto, Ctor

  // Detect obvious negatives
  // Use toString instead of jQuery.type to catch host objects
  if (!obj || toString.call(obj) !== '[object Object]') {
    return false
  }

  proto = Object.getPrototypeOf(obj)

  // Objects with no prototype (e.g., `Object.create( null )`) are plain
  if (!proto) {
    return true
  }

  var class2type = {}
  var hasOwn = class2type.hasOwnProperty
  var fnToString = hasOwn.toString
  var ObjectFunctionString = fnToString.call(Object)

  // Objects with prototype are plain iff they were constructed by a global Object function
  Ctor = hasOwn.call(proto, 'constructor') && proto.constructor
  return (
    typeof Ctor === 'function' && fnToString.call(Ctor) === ObjectFunctionString
  )
}

const extend = function() {
  var options
  var name
  var src
  var copy
  var copyIsArray
  var clone
  var target = arguments[0] || {}
  var i = 1
  var length = arguments.length
  var deep = false

  // Handle a deep copy situation
  if (typeof target === 'boolean') {
    deep = target

    // Skip the boolean and the target
    target = arguments[i] || {}
    i++
  }

  // Handle case when target is a string or something (possible in deep copy)
  if (typeof target !== 'object' && !isFunction(target)) {
    target = {}
  }

  // Extend jQuery itself if only one argument is passed
  if (i === length) {
    target = this
    i--
  }

  for (; i < length; i++) {
    // Only deal with non-null/undefined values
    if ((options = arguments[i]) != null) {
      // Extend the base object
      for (name in options) {
        copy = options[name]

        // Prevent Object.prototype pollution
        // Prevent never-ending loop
        if (name === '__proto__' || target === copy) {
          continue
        }

        // Recurse if we're merging plain objects or arrays
        if (
          deep &&
          copy &&
          (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))
        ) {
          src = target[name]

          // Ensure proper type for the source value
          if (copyIsArray && !Array.isArray(src)) {
            clone = []
          } else if (!copyIsArray && !isPlainObject(src)) {
            clone = {}
          } else {
            clone = src
          }
          copyIsArray = false

          // Never move original objects, clone them
          target[name] = extend(deep, clone, copy)

          // Don't bring in undefined values
        } else if (copy !== undefined) {
          target[name] = copy
        }
      }
    }
  }

  // Return the modified object
  return target
}

const grep = (elems, callback, invert) => {
  var callbackInverse
  var matches = []
  var i = 0
  var length = elems.length
  var callbackExpect = !invert

  // Go through the array, only saving the items
  // that pass the validator function
  for (; i < length; i++) {
    callbackInverse = !callback(elems[i], i)
    if (callbackInverse !== callbackExpect) {
      matches.push(elems[i])
    }
  }

  return matches
}

const parseHTML = function(str) {
  var tmp = document.implementation.createHTMLDocument()
  tmp.body.innerHTML = str

  if (tmp.body.childElementCount <= 1) {
    return tmp.body.children[0]
  } else {
    return Array.from(tmp.body.children).reduce((fragment, node) => {
      fragment.appendChild(node)
      return fragment
    }, document.createDocumentFragment())
  }
}

const matches = function(el, selector) {
  return (
    el &&
    (
      el.matches ||
      el.matchesSelector ||
      el.msMatchesSelector ||
      el.mozMatchesSelector ||
      el.webkitMatchesSelector ||
      el.oMatchesSelector
    ).call(el, selector)
  )
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
  canvasToBlob,
  taskRunner,
  isFunction,
  callbacks,
  inArray,
  extend,
  grep,
  parseHTML,
  isPlainObject,
  matches,
  each,
}
