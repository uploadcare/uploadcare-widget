import uploadcare from './namespace'
import { sendFileAPI } from './utils/abilities'

var indexOf = [].indexOf

const {
  expose,
  utils,
  jQuery: $,
  version
} = uploadcare

uploadcare.namespace('settings', function (ns) {
  var arrayOptions, constrainOptions, constraints, defaultPreviewUrlCallback, defaults, flagOptions, intOptions, integration, integrationToUserAgent, normalize, parseCrop, parseShrink, presets, script, str2arr, transformOptions, transforms, urlOptions
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
      all: 'file camera url facebook gdrive gphotos dropbox instagram evernote flickr onedrive box vk huddle',
      default: defaults.tabs
    }
  }
  // integration setting from data attributes of script tag
  script = document.currentScript || (function () {
    var scripts
    scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]
  })()
  integration = $(script).data('integration')
  if (integration != null) {
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
      settings[key] = utils.unique(value)
    }
    return settings
  }
  urlOptions = function (settings, keys) {
    var i, key, len
    for (i = 0, len = keys.length; i < len; i++) {
      key = keys[i]
      if (settings[key] != null) {
        settings[key] = utils.normalizeUrl(settings[key])
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
    settings._userAgent = `UploadcareWidget/${version}/${settings.publicKey} (JavaScript${(settings.integration ? `; ${settings.integration}` : '')})`
    return settings
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
      ({ min, max } = constraints[key])
      if (settings[key] != null) {
        settings[key] = Math.min(Math.max(settings[key], min), max)
      }
    }
    return settings
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
    var reShrink, shrink, size
    reShrink = /^([0-9]+)x([0-9]+)(?:\s+(\d{1,2}|100)%)?$/i
    shrink = reShrink.exec($.trim(val.toLowerCase())) || []
    if (!shrink.length) {
      return false
    }
    size = shrink[1] * shrink[2]
    if (size > 5000000) { // ios max canvas square
      utils.warnOnce('Shrinked size can not be larger than 5MP. ' + `You have set ${shrink[1]}x${shrink[2]} (` + `${Math.ceil(size / 1000 / 100) / 10}MP).`)
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
    var skydriveIndex
    arrayOptions(settings, ['tabs', 'preferredTypes'])
    urlOptions(settings, ['cdnBase', 'socialBase', 'urlBase', 'scriptBase'])
    flagOptions(settings, ['doNotStore', 'imagesOnly', 'multiple', 'clearable', 'pathValue', 'previewStep', 'systemDialog', 'debugUploads', 'multipleMaxStrict'])
    intOptions(settings, ['multipleMax', 'multipleMin', 'multipartMinSize', 'multipartPartSize', 'multipartMinLastPartSize', 'multipartConcurrency', 'multipartMaxAttempts', 'parallelDirectUploads'])
    transformOptions(settings, transforms)
    constrainOptions(settings, constraints)
    integrationToUserAgent(settings)
    if (settings.crop !== false && !$.isArray(settings.crop)) {
      if (/^(disabled?|false|null)$/i.test(settings.crop)) {
        settings.crop = false
      } else if ($.isPlainObject(settings.crop)) { // old format
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
    skydriveIndex = settings.tabs.indexOf('skydrive')
    if (skydriveIndex !== -1) {
      settings.tabs[skydriveIndex] = 'onedrive'
    }
    return settings
  }

  // Defaults (not normalized)
  expose('defaults', $.extend({
    allTabs: presets.tabs.all
  }, defaults))

  // global variables only
  ns.globals = function () {
    var key, scriptSettings, value
    scriptSettings = {}
    for (key in defaults) {
      value = window[`UPLOADCARE_${utils.upperCase(key)}`]
      if (value != null) {
        scriptSettings[key] = value
      }
    }
    return scriptSettings
  }

  // Defaults + global variables + global overrides (once from uploadcare.start)
  // Not publicly-accessible
  ns.common = utils.once(function (settings, ignoreGlobals) {
    var result
    if (!ignoreGlobals) {
      defaults = $.extend(defaults, ns.globals())
    }
    result = normalize($.extend(defaults, settings || {}))
    ns.waitForSettings.fire(result)
    return result
  })

  // Defaults + global variables + global overrides + local overrides
  ns.build = function (settings) {
    var result
    result = $.extend({}, ns.common())
    if (!$.isEmptyObject(settings)) {
      result = normalize($.extend(result, settings))
    }
    return result
  }

  ns.waitForSettings = $.Callbacks('once memory')

  ns.CssCollector = class CssCollector {
    constructor () {
      this.urls = []
      this.styles = []
    }

    addUrl (url) {
      if (!/^https?:\/\//i.test(url)) {
        throw new Error('Embedded urls should be absolute. ' + url)
      }
      if (!(indexOf.call(this.urls, url) >= 0)) {
        return this.urls.push(url)
      }
    }

    addStyle (style) {
      return this.styles.push(style)
    }
  }
  uploadcare.tabsCss = new ns.CssCollector()
  defaults._emptyKeyText = "<div class=\"uploadcare--tab__content\">\n<div class=\"uploadcare--text uploadcare--text_size_large uploadcare--tab__title\">Hello!</div>\n<div class=\"uploadcare--text\">Your <a class=\"uploadcare--link\" href=\"https://uploadcare.com/dashboard/\">public key</a> is not set.</div>\n<div class=\"uploadcare--text\">Add this to the &lt;head&gt; tag to start uploading files:</div>\n<div class=\"uploadcare--text uploadcare--text_pre\">&lt;script&gt;\nUPLOADCARE_PUBLIC_KEY = 'your_public_key';\n&lt;/script&gt;</div>\n</div>"
})
