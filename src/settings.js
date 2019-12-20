import { version } from '../package.json'

import { sendFileAPI } from './utils/abilities'
import { warnOnce } from './utils/warnings'
import { unique, once, upperCase, normalizeUrl, isFunction } from './utils'
import { isWindowDefined } from './utils/is-window-defined'

var indexOf = [].indexOf

// settings
var arrayOptions,
  constrainOptions,
  constraints,
  defaultPreviewUrlCallback,
  defaults,
  flagOptions,
  intOptions,
  integration,
  integrationToUserAgent,
  normalize,
  parseCrop,
  parseShrink,
  presets,
  script,
  str2arr,
  transformOptions,
  transforms,
  urlOptions

defaults = {
  // developer hooks
  live: true,
  manualStart: false,
  locale: null,
  localePluralize: null,
  localeTranslations: null,
  // widget & dialog settings
  systemDialog: false,
  crop: false,
  previewStep: false,
  imagesOnly: false,
  clearable: false,
  multiple: false,
  multipleMax: 1000,
  multipleMin: 1,
  multipleMaxStrict: false,
  imageShrink: false,
  pathValue: true,
  tabs:
    'file camera url facebook gdrive gphotos dropbox instagram evernote flickr onedrive',
  preferredTypes: '',
  inputAcceptTypes: '', // '' means default, null means "disable accept"
  // upload settings
  doNotStore: false,
  publicKey: null,
  secureSignature: '',
  secureExpire: '',
  pusherKey: '79ae88bd931ea68464d9',
  cdnBase: 'https://ucarecdn.com',
  urlBase: 'https://upload.uploadcare.com',
  socialBase: 'https://social.uploadcare.com',
  previewProxy: null,
  previewUrlCallback: null,
  // fine tuning
  imagePreviewMaxSize: 25 * 1024 * 1024,
  multipartMinSize: 10 * 1024 * 1024,
  multipartPartSize: 5 * 1024 * 1024,
  multipartMinLastPartSize: 1024 * 1024,
  multipartConcurrency: 4,
  multipartMaxAttempts: 3,
  parallelDirectUploads: 10,
  passWindowOpen: false,
  // camera recording
  audioBitsPerSecond: null,
  videoBitsPerSecond: null,
  // maintain settings
  scriptBase: `//ucarecdn.com/widget/${version}/uploadcare/`,
  debugUploads: false,
  integration: ''
}
transforms = {
  multipleMax: {
    from: 0,
    to: 1000
  }
}
constraints = {
  multipleMax: {
    min: 1,
    max: 1000
  }
}
presets = {
  tabs: {
    all:
      'file camera url facebook gdrive gphotos dropbox instagram evernote flickr onedrive box vk huddle',
    default: defaults.tabs
  }
}
// integration setting from data attributes of script tag
script =
  isWindowDefined() &&
  (document.currentScript ||
    (function() {
      var scripts
      scripts = document.getElementsByTagName('script')
      return scripts[scripts.length - 1]
    })())
integration = isWindowDefined() && script.dataset.integration
if (integration && integration != null) {
  defaults = Object.assign(defaults, { integration })
}
str2arr = function(value) {
  if (!Array.isArray(value)) {
    value = value.trim()
    value = value ? value.split(' ') : []
  }
  return value
}
arrayOptions = function(settings, keys) {
  var hasOwnProperty = Object.prototype.hasOwnProperty

  var i, item, j, key, len, len1, source, value
  for (i = 0, len = keys.length; i < len; i++) {
    key = keys[i]
    value = source = str2arr(settings[key])
    if (hasOwnProperty.apply(presets, [key])) {
      value = []
      for (j = 0, len1 = source.length; j < len1; j++) {
        item = source[j]
        if (hasOwnProperty.apply(presets[key], [item])) {
          value = value.concat(str2arr(presets[key][item]))
        } else {
          value.push(item)
        }
      }
    }
    settings[key] = unique(value)
  }
  return settings
}
urlOptions = function(settings, keys) {
  var i, key, len
  for (i = 0, len = keys.length; i < len; i++) {
    key = keys[i]
    if (settings[key] != null) {
      settings[key] = normalizeUrl(settings[key])
    }
  }
  return settings
}
flagOptions = function(settings, keys) {
  var i, key, len, value
  for (i = 0, len = keys.length; i < len; i++) {
    key = keys[i]
    if (!(settings[key] != null)) {
      continue
    }
    value = settings[key]
    if (typeof value === 'string') {
      // "", "..." -> true
      // "false", "disabled" -> false
      value = value.trim().toLowerCase()
      settings[key] = !(value === 'false' || value === 'disabled')
    } else {
      settings[key] = !!value
    }
  }
  return settings
}
intOptions = function(settings, keys) {
  var i, key, len
  for (i = 0, len = keys.length; i < len; i++) {
    key = keys[i]
    if (settings[key] != null) {
      settings[key] = parseInt(settings[key])
    }
  }
  return settings
}

integrationToUserAgent = function(settings) {
  settings._userAgent = `UploadcareWidget/${version}/${
    settings.publicKey
  } (JavaScript${settings.integration ? `; ${settings.integration}` : ''})`
  return settings
}

transformOptions = function(settings, transforms) {
  var key, transform
  for (key in transforms) {
    transform = transforms[key]
    if (settings[key] != null) {
      if (settings[key] === transform.from) {
        settings[key] = transform.to
      }
    }
  }
  return settings
}

constrainOptions = function(settings, constraints) {
  var key, max, min
  for (key in constraints) {
    ;({ min, max } = constraints[key])
    if (settings[key] != null) {
      settings[key] = Math.min(Math.max(settings[key], min), max)
    }
  }
  return settings
}

parseCrop = function(val) {
  var ratio, reRatio
  reRatio = /^([0-9]+)([x:])([0-9]+)\s*(|upscale|minimum)$/i
  ratio = reRatio.exec(val.toLowerCase().trim()) || []
  return {
    downscale: ratio[2] === 'x',
    upscale: !!ratio[4],
    notLess: ratio[4] === 'minimum',
    preferedSize: ratio.length ? [+ratio[1], +ratio[3]] : undefined
  }
}

parseShrink = function(val) {
  var reShrink, shrink, size
  reShrink = /^([0-9]+)x([0-9]+)(?:\s+(\d{1,2}|100)%)?$/i
  shrink = reShrink.exec(val.toLowerCase().trim()) || []
  if (!shrink.length) {
    return false
  }
  size = shrink[1] * shrink[2]
  if (size > 5000000) {
    // ios max canvas square
    warnOnce(
      'Shrinked size can not be larger than 5MP. ' +
        `You have set ${shrink[1]}x${shrink[2]} (` +
        `${Math.ceil(size / 1000 / 100) / 10}MP).`
    )

    return false
  }
  return {
    quality: shrink[3] ? shrink[3] / 100 : undefined,
    size: size
  }
}

defaultPreviewUrlCallback = function(url, info) {
  var addAmpersand, addName, addQuery, queryPart
  if (!this.previewProxy) {
    return url
  }
  addQuery = !/\?/.test(this.previewProxy)
  addName = addQuery || !/=$/.test(this.previewProxy)
  addAmpersand = !addQuery && !/[&?=]$/.test(this.previewProxy)
  queryPart = encodeURIComponent(url)
  if (addName) {
    queryPart = 'url=' + queryPart
  }
  if (addAmpersand) {
    queryPart = '&' + queryPart
  }
  if (addQuery) {
    queryPart = '?' + queryPart
  }
  return this.previewProxy + queryPart
}

normalize = function(settings) {
  var skydriveIndex
  arrayOptions(settings, ['tabs', 'preferredTypes'])
  urlOptions(settings, ['cdnBase', 'socialBase', 'urlBase', 'scriptBase'])
  flagOptions(settings, [
    'doNotStore',
    'imagesOnly',
    'multiple',
    'clearable',
    'pathValue',
    'previewStep',
    'systemDialog',
    'debugUploads',
    'multipleMaxStrict'
  ])
  intOptions(settings, [
    'multipleMax',
    'multipleMin',
    'multipartMinSize',
    'multipartPartSize',
    'multipartMinLastPartSize',
    'multipartConcurrency',
    'multipartMaxAttempts',
    'parallelDirectUploads'
  ])
  transformOptions(settings, transforms)
  constrainOptions(settings, constraints)
  integrationToUserAgent(settings)
  if (settings.crop !== false && !Array.isArray(settings.crop)) {
    if (/^(disabled?|false|null)$/i.test(settings.crop)) {
      settings.crop = false
    } else if (isPlainObject(settings.crop)) {
      // old format
      settings.crop = [settings.crop]
    } else {
      settings.crop = ('' + settings.crop).split(',').map(parseCrop)
    }
  }
  if (settings.imageShrink && !isPlainObject(settings.imageShrink)) {
    settings.imageShrink = parseShrink(settings.imageShrink)
  }
  if (settings.crop || settings.multiple) {
    settings.previewStep = true
  }
  if (!sendFileAPI) {
    settings.systemDialog = false
  }
  if (settings.validators) {
    settings.validators = settings.validators.slice()
  }
  if (settings.previewProxy && !settings.previewUrlCallback) {
    settings.previewUrlCallback = defaultPreviewUrlCallback
  }
  skydriveIndex = settings.tabs.indexOf('skydrive')
  if (skydriveIndex !== -1) {
    settings.tabs[skydriveIndex] = 'onedrive'
  }
  return settings
}

// global variables only
const globals = function() {
  var key, scriptSettings, value
  scriptSettings = {}
  for (key in defaults) {
    value = window[`UPLOADCARE_${upperCase(key)}`]
    if (value != null) {
      scriptSettings[key] = value
    }
  }
  return scriptSettings
}

// Defaults + global variables + global overrides (once from uploadcare.start)
// Not publicly-accessible
const common = once(function(settings, ignoreGlobals) {
  var result
  if (!ignoreGlobals) {
    defaults = Object.assign(defaults, globals())
  }
  result = normalize(Object.assign(defaults, settings || {}))
  waitForSettings.fire(result)
  return result
})

// Defaults + global variables + global overrides + local overrides
const build = function(settings) {
  var result
  result = Object.assign({}, common())
  if (!Object.keys(settings).length === 0) {
    result = normalize(Object.assign(result, settings))
  }
  return result
}

// Convert String-formatted options into Object-formatted ones
const createOptions = options => {
  var rnothtmlwhite = /[^\x20\t\r\n\f]+/g
  var object = {}
  var arr = options.match(rnothtmlwhite) || []
  arr.forEach(function(_, flag) {
    object[flag] = true
  })
  return object
}

const toType = obj => {
  if (obj == null) {
    return obj + ''
  }
  var class2type = {}

  // Support: Android <=2.3 only (functionish RegExp)
  return typeof obj === 'object' || typeof obj === 'function'
    ? class2type[toString.call(obj)] || 'object'
    : typeof obj
}

const inArray = (elem, arr, i) => {
  return arr == null ? -1 : indexOf.call(arr, elem, i)
}

const callbacks = function(options) {
  // Convert options from String-formatted to Object-formatted if needed
  // (we check in cache first)
  options =
    typeof options === 'string'
      ? createOptions(options)
      : Object.assign({}, options)

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
          args.forEach(function(_, arg) {
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
      arguments.forEach(function(_, arg) {
        var index
        while ((index = inArray(arg, list, index)) > -1) {
          // while ((index = jQuery.inArray(arg, list, index)) > -1) {
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

const waitForSettings = isWindowDefined() && callbacks('once memory')

const CssCollector = class CssCollector {
  constructor() {
    this.urls = []
    this.styles = []
  }

  addUrl(url) {
    if (!/^https?:\/\//i.test(url)) {
      throw new Error('Embedded urls should be absolute. ' + url)
    }
    if (!(indexOf.call(this.urls, url) >= 0)) {
      return this.urls.push(url)
    }
  }

  addStyle(style) {
    return this.styles.push(style)
  }
}

const isPlainObject = obj => {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

const emptyKeyText =
  '<div class="uploadcare--tab__content">\n<div class="uploadcare--text uploadcare--text_size_large uploadcare--tab__title">Hello!</div>\n<div class="uploadcare--text">Your <a class="uploadcare--link" href="https://uploadcare.com/dashboard/">public key</a> is not set.</div>\n<div class="uploadcare--text">Add this to the &lt;head&gt; tag to start uploading files:</div>\n<div class="uploadcare--text uploadcare--text_pre">&lt;script&gt;\nUPLOADCARE_PUBLIC_KEY = \'your_public_key\';\n&lt;/script&gt;</div>\n</div>'

export {
  defaults,
  presets,
  emptyKeyText,
  globals,
  build,
  common,
  waitForSettings,
  CssCollector
}
