import uploadcare from './namespace.coffee'

{
  expose
  utils,
  jQuery: $,
  version
} = uploadcare

uploadcare.namespace 'settings', (ns) ->

  defaults =
    # developer hooks
    live: true
    manualStart: false
    locale: null
    localePluralize: null
    localeTranslations: null
    # widget & dialog settings
    systemDialog: false
    crop: false
    previewStep: false
    imagesOnly: false
    clearable: false
    multiple: false
    multipleMax: 1000
    multipleMin: 1
    multipleMaxStrict: false
    imageShrink: false
    pathValue: true
    tabs: 'file camera url facebook gdrive gphotos dropbox instagram evernote flickr onedrive'
    preferredTypes: ''
    inputAcceptTypes: ''  # '' means default, null means "disable accept"
    # upload settings
    doNotStore: false
    publicKey: null
    secureSignature: ''
    secureExpire: ''
    pusherKey: '79ae88bd931ea68464d9'
    cdnBase: 'https://ucarecdn.com'
    urlBase: 'https://upload.uploadcare.com'
    socialBase: 'https://social.uploadcare.com'
    previewProxy: null
    previewUrlCallback: null
    # fine tuning
    imagePreviewMaxSize: 25 * 1024 * 1024
    multipartMinSize: 10 * 1024 * 1024
    multipartPartSize: 5 * 1024 * 1024
    multipartMinLastPartSize: 1024 * 1024
    multipartConcurrency: 4
    multipartMaxAttempts: 3
    parallelDirectUploads: 10
    passWindowOpen: false
    # camera recording
    audioBitsPerSecond: null
    videoBitsPerSecond: null
    # maintain settings
    scriptBase: "//ucarecdn.com/widget/#{version}/uploadcare/"
    debugUploads: false
    integration: ''

  transforms =
    multipleMax:
      from: 0
      to: 1000

  constraints =
    multipleMax:
      min: 1
      max: 1000

  presets =
    tabs:
      all: 'file camera url facebook gdrive gphotos dropbox instagram evernote flickr onedrive box vk huddle'
      default: defaults.tabs

  # integration setting from data attributes of script tag
  script = document.currentScript || do ->
    scripts = document.getElementsByTagName('script')
    scripts[scripts.length - 1]
  integration = $(script).data('integration')
  if integration isnt undefined
    defaults = $.extend(defaults, {integration})

  str2arr = (value) ->
    if not $.isArray(value)
      value = $.trim(value)
      value = if value
          value.split(' ')
        else
          []
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
      if typeof value is 'string'
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

  integrationToUserAgent = (settings) ->
    settings['_userAgent'] =
      "UploadcareWidget/#{version}/#{settings['publicKey']} (JavaScript#{
        if settings['integration'] then "; #{settings['integration']}" else ''
      })"
    settings

  transformOptions = (settings, transforms) ->
    for key, transform of transforms when settings[key]?
      settings[key] = transform.to if settings[key] == transform.from
    settings

  constrainOptions = (settings, constraints) ->
    for key, {min, max} of constraints when settings[key]?
      settings[key] = Math.min(Math.max(settings[key], min), max);
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

  defaultPreviewUrlCallback = (url, info) ->
    if not @previewProxy
      return url

    addQuery = not /\?/.test(@previewProxy)
    addName = addQuery or not /\=$/.test(@previewProxy)
    addAmpersand = not addQuery and not /[\&\?\=]$/.test(@previewProxy)

    queryPart = encodeURIComponent(url)
    if addName then queryPart = 'url=' + queryPart
    if addAmpersand then queryPart = '&' + queryPart
    if addQuery then queryPart = '?' + queryPart

    return @previewProxy + queryPart

  normalize = (settings) ->
    arrayOptions(settings, [
      'tabs'
      'preferredTypes'
    ])
    urlOptions(settings, [
      'cdnBase'
      'socialBase'
      'urlBase'
      'scriptBase'
    ])
    flagOptions(settings, [
      'doNotStore'
      'imagesOnly'
      'multiple'
      'clearable'
      'pathValue'
      'previewStep'
      'systemDialog'
      'debugUploads'
      'multipleMaxStrict'
    ])
    intOptions(settings, [
      'multipleMax'
      'multipleMin'
      'multipartMinSize'
      'multipartPartSize'
      'multipartMinLastPartSize'
      'multipartConcurrency'
      'multipartMaxAttempts'
      'parallelDirectUploads'
    ])
    transformOptions(settings, transforms)
    constrainOptions(settings, constraints)
    integrationToUserAgent(settings)

    if settings.crop != false and not $.isArray(settings.crop)
      if /^(disabled?|false|null)$/i.test(settings.crop)
        settings.crop = false
      else if $.isPlainObject(settings.crop)  # old format
        settings.crop = [settings.crop]
      else
        settings.crop = $.map(('' + settings.crop).split(','), parseCrop)

    if settings.imageShrink and not $.isPlainObject(settings.imageShrink)
      settings.imageShrink = parseShrink(settings.imageShrink)

    if settings.crop or settings.multiple
      settings.previewStep = true

    if not utils.abilities.sendFileAPI
      settings.systemDialog = false

    if settings.validators
      settings.validators = settings.validators.slice()

    if settings.previewProxy and not settings.previewUrlCallback
      settings.previewUrlCallback = defaultPreviewUrlCallback

    skydriveIndex = settings.tabs.indexOf('skydrive')

    if skydriveIndex != -1
      settings.tabs[skydriveIndex] = 'onedrive'

    settings


  # Defaults (not normalized)
  expose('defaults', $.extend({
    allTabs: presets.tabs.all
  }, defaults))

  # global variables only
  ns.globals = ->
    scriptSettings = {}
    for key of defaults
      value = window["UPLOADCARE_#{utils.upperCase(key)}"]
      if value isnt undefined
        scriptSettings[key] = value
    scriptSettings

  # Defaults + global variables + global overrides (once from uploadcare.start)
  # Not publicly-accessible
  ns.common = utils.once (settings, ignoreGlobals) ->
    if not ignoreGlobals
      defaults = $.extend(defaults, ns.globals())
    result = normalize($.extend(defaults, settings or {}))
    ns.waitForSettings.fire(result)
    result

  # Defaults + global variables + global overrides + local overrides
  ns.build = (settings) ->
    result = $.extend({}, ns.common())
    if not $.isEmptyObject(settings)
      result = normalize($.extend(result, settings))
    result

  ns.waitForSettings = $.Callbacks("once memory")

  class ns.CssCollector
    constructor: () ->
      @urls = []
      @styles = []

    addUrl: (url) ->
      if not /^https?:\/\//i.test(url)
        throw new Error('Embedded urls should be absolute. ' + url)

      if not (url in @urls)
        @urls.push(url)

    addStyle: (style) ->
      @styles.push(style)

  uploadcare.tabsCss = new ns.CssCollector

  defaults['_emptyKeyText'] = """<div class="uploadcare--tab__content">
  <div class="uploadcare--text uploadcare--text_size_large uploadcare--tab__title">Hello!</div>
  <div class="uploadcare--text">Your <a class="uploadcare--link" href="https://uploadcare.com/dashboard/">public key</a> is not set.</div>
  <div class="uploadcare--text">Add this to the &lt;head&gt; tag to start uploading files:</div>
  <div class="uploadcare--text uploadcare--text_pre">&lt;script&gt;
UPLOADCARE_PUBLIC_KEY = 'your_public_key';
&lt;/script&gt;</div>
</div>"""
