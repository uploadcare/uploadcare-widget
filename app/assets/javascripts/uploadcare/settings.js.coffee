{
  namespace,
  utils,
  jQuery: $
} = uploadcare

namespace 'uploadcare.settings', (ns) ->

  arrayOptions = (settings, keys) ->
    for key in keys
      value = settings[key]
      unless $.isArray(value)
        value = $.trim(value)
        settings[key] = if value then value.split(' ') else []
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
    arrayOptions settings, ['tabs']
    urlOptions settings, ['urlBase', 'socialBase', 'cdnBase']
    flagOptions settings, ['previewStep', 'multiple', 'imagesOnly', 'pathValue']

    if settings.multiple
      utils.warnOnce 'Sorry, the multiupload is not working now.'
      settings.multiple = false

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


  ns.globals = utils.once ->
    defaults =
      'cdn-base': 'https://ucarecdn.com'
      'crop': false
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
      'tabs': 'file url facebook dropbox gdrive instagram'
      'url-base': 'https://upload.uploadcare.com'

    values = {}
    for own key, fallback of defaults
      value = window["UPLOADCARE_#{utils.upperCase(key)}"]
      values[$.camelCase(key)] = if value? then value else fallback

    unless values.publicKey
      utils.warnOnce """
        Global public key not set!
        Falling back to "demopublickey".

        Add this to <head> tag to set your key:
        <meta name="uploadcare-public-key" content="your_public_key">
        """
      values.publicKey = 'demopublickey'

    normalize(values)


  ns.defaults = utils.once (settings) ->
    normalize $.extend({}, ns.globals(), settings or {})

  ns.build = (settings) ->
    normalize $.extend({}, ns.defaults(), settings or {})
