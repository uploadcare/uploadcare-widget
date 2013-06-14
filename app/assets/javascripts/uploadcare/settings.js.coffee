{
  expose
  namespace,
  utils,
  jQuery: $
} = uploadcare

namespace 'uploadcare.settings', (ns) ->

  defaults =
    'autostore': false
    'cdn-base': 'https://ucarecdn.com'
    'crop': 'disabled'
    'images-only': false
    'live': true
    'locale': null
    'locale-pluralize': null
    'locale-translations': null
    'manual-start': false
    'multiple': false
    'path-value': false
    'preview-step': false
    'public-key': null
    'pusher-key': '79ae88bd931ea68464d9'
    'social-base': 'https://social.uploadcare.com'
    'tabs': 'file url facebook gdrive instagram evernote'
    'url-base': 'https://upload.uploadcare.com'
    'script-base': if SCRIPT_BASE? then SCRIPT_BASE else ''
    'script-ext': '.min.js'

  presets =
    'tabs':
      all: 'file url facebook vk dropbox gdrive instagram evernote'
      default: defaults.tabs


  str2arr = (value) ->
    unless $.isArray(value)
      value = $.trim(value)
      value = if value then value.split(' ') else []
    value

  arrayOptions = (settings, keys) ->
    for key in keys
      value = str2arr(settings[key])
      presetList = presets[key]
      for own name, preset of presetList
        value = value.concat(str2arr(preset)) if name in value
      settings[key] = utils.uniq(value, (x) -> not utils.own(presetList, x))
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


  normalize = (settings) ->
    arrayOptions settings, [
      'tabs'
    ]
    urlOptions settings, [
      'cdnBase',
      'socialBase',
      'urlBase'
    ]
    flagOptions settings, [
      'autostore',
      'imagesOnly',
      'multiple',
      'pathValue',
      'previewStep'
    ]

    if settings.multiple
      settings.crop = 'disabled'

    settings.__cropParsed = {
      enabled: true
      scale: false
      upscale: false
      preferedSize: null
    }

    # disabled 300x200 → disabled
    # 300x200 3:2 → 3:2
    # 300x200 UPscale abc → 300x200 upscale
    # upscale → ""
    crop = '' + settings.crop
    if crop.match /(disabled|false)/i
      crop = 'disabled'
      settings.__cropParsed.enabled = false
    else if ratio = crop.match /[0-9]+\:[0-9]+/
      crop = ratio[0]
      settings.__cropParsed.preferedSize = ratio[0].replace(':', 'x')
    else if size = crop.match /[0-9]+x[0-9]+/i
      settings.__cropParsed.preferedSize = size[0]
      settings.__cropParsed.scale = true
      if crop.match(/upscale/i)
        crop = size[0] + ' upscale'
        settings.__cropParsed.upscale = true
      else
        crop = size[0]
    else
      crop = ''
    settings.crop = crop

    if settings.__cropParsed.enabled or settings.multiple
      settings.previewStep = true

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

