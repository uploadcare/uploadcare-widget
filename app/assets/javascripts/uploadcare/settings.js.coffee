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
    'crop': false
    'preview-step': false
    'images-only': false
    'clearable': false
    'multiple': false
    'multiple-max': 0
    'multiple-min': 1
    'image-shrink': false
    'path-value': true
    'tabs': 'file camera url facebook gdrive dropbox instagram evernote flickr skydrive'
    'preferred-types': ''
    'input-accept-types': ''  # '' means default, null means "disable accept"
    # upload settings
    'do-not-store': false
    'public-key': null
    'pusher-key': '79ae88bd931ea68464d9'
    'cdn-base': 'http://www.ucarecdn.com'
    'url-base': 'https://upload.uploadcare.com'
    'social-base': 'https://social.uploadcare.com'
    # maintain settings
    'script-base': if SCRIPT_BASE? then SCRIPT_BASE else ''

  presets =
    'tabs':
      all: 'file camera url facebook gdrive dropbox instagram evernote flickr skydrive box vk huddle'
      default: defaults.tabs


  str2arr = (value) ->
    unless $.isArray(value)
      value = $.trim(value)
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

  parseCrop = (val) ->
    reRatio = /^([0-9]+)([x:])([0-9]+)\s*(|upscale|minimum)$/i
    ratio = reRatio.exec($.trim(val.toLowerCase())) or []

    downscale: ratio[2] == 'x'
    upscale: !! ratio[4]
    notLess: ratio[4] == 'minimum'
    preferedSize: [+ratio[1], +ratio[3]] if ratio.length

  parseShrink = (val) ->
    reShrink = /^([0-9]+)x([0-9]+)(?:\s+(\d{1,2}|100)%)?$/i
    shrink = reShrink.exec($.trim(val.toLowerCase())) or []

    if not shrink.length
      return false

    size = shrink[1] * shrink[2]

    if size > 5000000  # ios max canvas square
      utils.warnOnce("Shrinked size can not be larger than 5MP. " +
                     "You have set #{shrink[1]}x#{shrink[2]} (" +
                     "#{Math.ceil(size/1000/100) / 10}MP).")
      return false

    quality: shrink[3] / 100 if shrink[3]
    size: size

  normalize = (settings) ->
    arrayOptions settings, [
      'tabs'
      'preferredTypes'
    ]
    urlOptions settings, [
      'cdnBase'
      'socialBase'
      'urlBase'
      'scriptBase'
    ]
    flagOptions settings, [
      'doNotStore'
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

    if settings.crop != false and not $.isArray(settings.crop)
      if /^(disabled?|false|null)$/i.test(settings.crop) or settings.multiple
        settings.crop = false
      else if $.isPlainObject(settings.crop)  # old format
        settings.crop = [settings.crop]
      else
        settings.crop = $.map(settings.crop.split(','), parseCrop)

    if settings.imageShrink and not $.isPlainObject(settings.imageShrink)
      settings.imageShrink = parseShrink(settings.imageShrink)

    if settings.crop or settings.multiple
      settings.previewStep = true

    if not utils.abilities.sendFileAPI
      settings.systemDialog = false

    if settings.validators
      settings.validators = settings.validators.slice()

    settings


  # Defaults (not normalized)
  publicDefaults = {
    allTabs: presets.tabs.all
  }
  for own key, value of defaults
    publicDefaults[$.camelCase(key)] = value
  expose 'defaults', publicDefaults

  # Defaults + global variables
  ns.globals = utils.once ->
    values = {}
    for own key, fallback of defaults
      value = window["UPLOADCARE_#{utils.upperCase(key)}"]
      values[$.camelCase(key)] = if value isnt undefined then value else fallback

    unless values.publicKey
      utils.commonWarning('publicKey')

    normalize(values)

  # Defaults + global variables + global overrides (once from uploadcare.start)
  # Not publicly-accessible
  ns.common = utils.once (settings) ->
    result = normalize($.extend({}, ns.globals(), settings or {}))
    ns.waitForSettings.fire(result)
    result

  # Defaults + global variables + global overrides + local overrides
  ns.build = (settings) ->
    normalize($.extend({}, ns.common(), settings or {}))

  ns.waitForSettings = $.Callbacks("once memory")

  class ns.CssCollector
    constructor: () ->
      @urls = []
      @styles = []

    addUrl: (url) ->
      if not /^https?:\/\//i.test(url)
        throw new Error('Embedded urls should be absolute. ' + url)

      unless url in @urls
        @urls.push(url)

    addStyle: (style) ->
      @styles.push(style)

  uploadcare.tabsCss = new ns.CssCollector
