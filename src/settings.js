import $ from 'jquery'
import { version } from '../package.json'

import { sendFileAPI } from './utils/abilities'
import { warnOnce } from './utils/warnings'
import { unique, once, upperCase, normalizeUrl, isObject } from './utils'
import { isWindowDefined } from './utils/is-window-defined'
import { MAX_SQUARE_SIDE } from './utils/canvas-size'
import { getPrefixedCdnBaseSync } from '@uploadcare/cname-prefix/dist/sync'

var indexOf = [].indexOf

// settings
var arrayOptions,
  constrainOptions,
  constraints,
  defaultPreviewUrlCallback,
  defaults,
  initialSettings,
  flagOptions,
  intOptions,
  integration,
  integrationToUserAgent,
  buildRetryConfig,
  normalize,
  parseCrop,
  parseShrink,
  presets,
  script,
  str2arr,
  transformOptions,
  transforms,
  urlOptions,
  callbackOptions,
  objectOptions

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
  tabs: 'file camera url facebook gdrive gphotos dropbox instagram evernote flickr onedrive',
  preferredTypes: '',
  inputAcceptTypes: '', // '' means default, null means "disable accept"
  // upload settings
  doNotStore: false,
  publicKey: null,
  secureSignature: '',
  secureExpire: '',
  pusherKey: '79ae88bd931ea68464d9',
  cdnBase: 'https://ucarecdn.com',
  cdnBasePrefixed: 'https://ucarecd.net',
  urlBase: 'https://upload.uploadcare.com',
  socialBase: 'https://social.uploadcare.com',
  previewProxy: null,
  previewUrlCallback: null,
  remoteTabSessionKey: null,
  metadata: null,
  metadataCallback: null,
  // fine tuning
  imagePreviewMaxSize: 25 * 1024 * 1024,
  multipartMinSize: 10 * 1024 * 1024,
  multipartPartSize: 5 * 1024 * 1024,
  multipartMinLastPartSize: 1024 * 1024,
  multipartConcurrency: 4,
  // `multipartMaxAttempts` is deprecated, value will be assigned to `retryAttempts` if set
  multipartMaxAttempts: null,
  retryAttempts: 3,
  retryThrottledAttempts: 10,
  retryBaseTimeout: 1000,
  retryFactor: 2,
  parallelDirectUploads: 10,
  passWindowOpen: false,
  // camera
  cameraMirrorDefault: true,
  // camera recording
  enableAudioRecording: true,
  enableVideoRecording: true,
  videoPreferredMimeTypes: null,
  audioBitsPerSecond: null,
  videoBitsPerSecond: null,
  // social sources settings
  topLevelOrigin: null,
  // maintain settings
  scriptBase: `//ucarecdn.com/widget/${version}/uploadcare/`,
  debugUploads: false,
  integration: ''
}
initialSettings = { ...defaults }
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
    all: 'file camera url facebook gdrive gphotos dropbox instagram evernote flickr onedrive box vk huddle',
    default: defaults.tabs
  }
}
// integration setting from data attributes of script tag
script =
  isWindowDefined() &&
  (document.currentScript ||
    (function () {
      var scripts
      scripts = document.getElementsByTagName('script')
      return scripts[scripts.length - 1]
    })())
integration = isWindowDefined() && $(script).data('integration')
if (integration && integration != null) {
  defaults = $.extend(defaults, { integration })
}
str2arr = function (value) {
  if (!$.isArray(value)) {
    value = $.trim(value)
    value = value ? value.split(' ') : []
  }
  return value
}
arrayOptions = function (settings, keys) {
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
urlOptions = function (settings, keys) {
  var i, key, len
  for (i = 0, len = keys.length; i < len; i++) {
    key = keys[i]
    if (settings[key] != null) {
      settings[key] = normalizeUrl(settings[key])
    }
  }
  return settings
}
flagOptions = function (settings, keys) {
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
      value = $.trim(value).toLowerCase()
      settings[key] = !(value === 'false' || value === 'disabled')
    } else {
      settings[key] = !!value
    }
  }
  return settings
}
intOptions = function (settings, keys) {
  var i, key, len
  for (i = 0, len = keys.length; i < len; i++) {
    key = keys[i]
    if (settings[key] != null) {
      settings[key] = parseInt(settings[key])
    }
  }
  return settings
}

integrationToUserAgent = function (settings) {
  settings._userAgent = `UploadcareWidget/${version}/${
    settings.publicKey
  } (JavaScript${settings.integration ? `; ${settings.integration}` : ''})`
  return settings
}

buildRetryConfig = function (settings) {
  if (
    settings.retryAttempts === initialSettings.retryAttempts &&
    settings.multipartMaxAttempts !== null
  ) {
    settings.retryAttempts = settings.multipartMaxAttempts
  }

  settings.retryConfig = {
    baseTimeout: settings.retryBaseTimeout,
    factor: settings.retryFactor,
    attempts: settings.retryAttempts,
    debugUploads: settings.debugUploads,
    throttledAttempts: settings.retryThrottledAttempts
  }
}

transformOptions = function (settings, transforms) {
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

constrainOptions = function (settings, constraints) {
  var key, max, min
  for (key in constraints) {
    ;({ min, max } = constraints[key])
    if (settings[key] != null) {
      settings[key] = Math.min(Math.max(settings[key], min), max)
    }
  }
  return settings
}

callbackOptions = function (settings, keys) {
  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i]
    if (settings[key] && typeof settings[key] !== 'function') {
      warnOnce(
        `Option "${key}" is expected to be a function. Instead got: ${typeof settings[
          key
        ]}`
      )
    }
  }
}

objectOptions = function (settings, keys) {
  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i]
    if (settings[key] && !isObject(settings[key])) {
      warnOnce(
        `Option "${key}" is expected to be an object. Instead got: ${typeof settings[
          key
        ]}`
      )
    }
  }
}

parseCrop = function (val) {
  var ratio, reRatio
  reRatio = /^([0-9]+)([x:])([0-9]+)\s*(|upscale|minimum)$/i
  ratio = reRatio.exec($.trim(val.toLowerCase())) || []
  return {
    downscale: ratio[2] === 'x',
    upscale: !!ratio[4],
    notLess: ratio[4] === 'minimum',
    preferedSize: ratio.length ? [+ratio[1], +ratio[3]] : undefined
  }
}

parseShrink = function (val) {
  const reShrink = /^([0-9]+)x([0-9]+)(?:\s+(\d{1,2}|100)%)?$/i
  const shrink = reShrink.exec($.trim(val.toLowerCase())) || []
  if (!shrink.length) {
    return false
  }
  const size = shrink[1] * shrink[2]
  const maxSize = MAX_SQUARE_SIDE * MAX_SQUARE_SIDE
  if (size > maxSize) {
    warnOnce(
      `Shrinked size can not be larger than ${Math.floor(
        maxSize / 1000 / 1000
      )}MP. ` +
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

defaultPreviewUrlCallback = function (url, info) {
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

normalize = function (settings) {
  arrayOptions(settings, ['tabs', 'preferredTypes', 'videoPreferredMimeTypes'])
  urlOptions(settings, [
    'cdnBase',
    'socialBase',
    'urlBase',
    'scriptBase',
    'cdnBasePrefixed'
  ])
  flagOptions(settings, [
    'doNotStore',
    'imagesOnly',
    'multiple',
    'clearable',
    'pathValue',
    'previewStep',
    'systemDialog',
    'debugUploads',
    'multipleMaxStrict',
    'cameraMirrorDefault'
  ])
  intOptions(settings, [
    'multipleMax',
    'multipleMin',
    'multipartMinSize',
    'multipartPartSize',
    'multipartMinLastPartSize',
    'multipartConcurrency',
    'multipartMaxAttempts',
    'retryAttempts',
    'retryThrottledAttempts',
    'retryBaseTimeout',
    'retryFactor',
    'parallelDirectUploads'
  ])
  callbackOptions(settings, ['previewUrlCallback', 'metadataCallback'])
  objectOptions(settings, ['metadata'])
  transformOptions(settings, transforms)
  constrainOptions(settings, constraints)
  integrationToUserAgent(settings)
  buildRetryConfig(settings)
  if (settings.crop !== false && !$.isArray(settings.crop)) {
    if (/^(disabled?|false|null)$/i.test(settings.crop)) {
      settings.crop = false
    } else if ($.isPlainObject(settings.crop)) {
      // old format
      settings.crop = [settings.crop]
    } else {
      settings.crop = $.map(('' + settings.crop).split(','), parseCrop)
    }
  }
  if (settings.imageShrink && !$.isPlainObject(settings.imageShrink)) {
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
  const skydriveIndex = settings.tabs.indexOf('skydrive')
  if (skydriveIndex !== -1) {
    settings.tabs[skydriveIndex] = 'onedrive'
  }

  if (settings.cdnBase === initialSettings.cdnBase) {
    settings.cdnBase = getPrefixedCdnBaseSync(
      settings.publicKey,
      settings.cdnBasePrefixed
    )
  }

  return settings
}

// global variables only
const globals = function () {
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
const common = once(function (settings, ignoreGlobals) {
  var result
  if (!ignoreGlobals) {
    defaults = $.extend(defaults, globals())
  }
  result = normalize($.extend(defaults, settings || {}))
  waitForSettings.fire(result)
  return result
})

// Defaults + global variables + global overrides + local overrides
const build = function (settings) {
  var result
  result = $.extend({}, common())
  if (!$.isEmptyObject(settings)) {
    result = normalize($.extend(result, settings))
  }
  return result
}

const waitForSettings = isWindowDefined() && $.Callbacks('once memory')

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
