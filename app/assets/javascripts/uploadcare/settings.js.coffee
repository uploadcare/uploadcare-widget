{
  expose
  namespace,
  utils,
  jQuery: $
} = uploadcare

namespace 'uploadcare.settings', (ns) ->

  defaults =
    # developer hooks
    'live': true
    'manual-start': false
    'locale': null
    'locale-pluralize': null
    'locale-translations': null
    # widget settings
    'system-dialog': false
    'crop': 'disabled'
    'preview-step': false
    'images-only': false
    'clearable': false
    'multiple': false
    'multiple-max': 0
    'multiple-min': 1
    'path-value': false
    'tabs': 'file url facebook instagram flickr gdrive evernote box skydrive'
    'preferred-types': ''
    # upload settings
    'autostore': false
    'public-key': null
    'pusher-key': '79ae88bd931ea68464d9'
    'cdn-base': 'http://www.ucarecdn.com'
    'url-base': 'https://upload.uploadcare.com'
    'social-base': 'https://social.uploadcare.com'
    # maintain settings
    'script-base': if SCRIPT_BASE? then SCRIPT_BASE else ''

  presets =
    'tabs':
      all: 'file url facebook dropbox gdrive instagram flickr vk evernote box skydrive'
      default: defaults.tabs


  str2arr = (value) ->
    unless $.isArray value
      value = $.trim value
      value = if value then value.split(' ') else []
    value

  arrayOptions = (settings, keys) ->
    for key in keys
      value = source = str2arr(settings[key])
      if presets.hasOwnProperty(key)
        value = []
        for item in source
          if presets[key].hasOwnProperty(item)
            value = value.concat(str2arr(presets[key][item]))
          else
            value.push(item)
      settings[key] = utils.unique(value)
    settings

  urlOptions = (settings, keys) ->
    for key in keys when settings[key]?
      settings[key] = utils.normalizeUrl(settings[key])
    settings

  flagOptions = (settings, keys) ->
    for key in keys when settings[key]?
      value = settings[key]
      if $.type(value) == 'string'
        # "", "..." -> true
        # "false", "disabled" -> false
        value = $.trim(value).toLowerCase()
        settings[key] = not (value in ['false', 'disabled'])
      else
        settings[key] = !!value
    settings

  intOptions = (settings, keys) ->
    for key in keys when settings[key]?
      settings[key] = parseInt(settings[key])
    settings

  parseCrop = (cropValue) ->
    crop = enabled: true

    reDisabled = /^(disabled|false)$/i
    reRatio = /^([0-9]+)([x:])([0-9]+)(\s+(upscale|minimum))?$/i

    if cropValue.match reDisabled
      crop.enabled = false

    else if ratio = cropValue.toLowerCase().match reRatio
      crop.preferedSize = [+ratio[1], +ratio[3]]
      if ratio[2] == 'x'
        crop.scale = true
      if ratio[5]
        crop.upscale = true
        if ratio[5] == 'minimum'
          crop.notLess = true
    # else should raise?

    crop


  normalize = (settings) ->
    arrayOptions settings, [
      'tabs'
      'preferredTypes'
    ]
    urlOptions settings, [
      'cdnBase'
      'socialBase'
      'urlBase'
    ]
    flagOptions settings, [
      'autostore'
      'imagesOnly'
      'multiple'
      'clearable'
      'pathValue'
      'previewStep'
      'systemDialog'
    ]
    intOptions settings, [
      'multipleMax'
      'multipleMin'
    ]

    unless $.isPlainObject settings.crop
      if settings.multiple
        settings.crop = enabled: false
      else
        settings.crop = parseCrop $.trim settings.crop

    if settings.crop.enabled or settings.multiple
      settings.previewStep = true

    if settings.crop.enabled
      settings.pathValue = true

    if not utils.abilities.sendFileAPI
      settings.systemDialog = false

    settings


  # Defaults (not normalized)
  publicDefaults = {}
  for own key, value of defaults
    publicDefaults[$.camelCase(key)] = value
  expose 'defaults', publicDefaults

  # Defaults + global variables
  ns.globals = utils.once ->
    values = {}
    for own key, fallback of defaults
      value = window["UPLOADCARE_#{utils.upperCase(key)}"]
      values[$.camelCase(key)] = if value? then value else fallback

    unless values.publicKey
      utils.commonWarning('publicKey')

    normalize(values)

  # Defaults + global variables + global overrides (once from uploadcare.start)
  # Not publicly-accessible
  ns.common = utils.once (settings) ->
    result = normalize $.extend({}, ns.globals(), settings or {})
    waitForSettingsCb.fire result
    result

  # Defaults + global variables + global overrides + local overrides
  ns.build = (settings) ->
    normalize $.extend({}, ns.common(), settings or {})

  waitForSettingsCb = $.Callbacks "once memory"

  # Like build() but won't cause settings freezing if they still didn't
  ns.waitForSettings = (settings, fn) ->
    waitForSettingsCb.add (common) ->
      fn normalize $.extend({}, common, settings or {})

  class ns.CssCollector
    constructor: () ->
      @urls = []
      @styles = []

    addUrl: (url) ->
      if not /^https?:\/\//i.test(url)
        throw new Error('Embedded urls should be absolute. ' + url)

      unless url in @urls
        @urls.push url

    addStyle: (style) ->
      @styles.push style

  uploadcare.tabsCss = new ns.CssCollector
