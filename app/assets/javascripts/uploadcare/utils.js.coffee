# = require uploadcare/utils/abilities
# = require uploadcare/utils/pubsub

{
  namespace,
  jQuery: $
} = uploadcare

namespace 'uploadcare.utils', (ns) ->
  ns.defer = (fn) ->
    setTimeout fn, 0

  ns.once = (fn) ->
    called = false
    result = null
    ->
      unless called
        result = fn.apply(this, arguments)
        called = true
      result

  ns.bindAll = (source, methods) ->
    target = {}
    for method in methods
      do (method) ->
        fn = source[method]
        target[method] = unless $.isFunction(fn) then fn else ->
          result = fn.apply(source, arguments)
          if result == source then target else result # Fix chaining
    target

  ns.publicCallbacks = (callbacks) ->
    result = callbacks.add
    result.add = callbacks.add
    result.remove = callbacks.remove
    result

  ns.uuid = ->
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace /[xy]/g, (c) ->
      r = Math.random() * 16 | 0
      v = if c == 'x' then r else r & 3 | 8
      v.toString(16)

  ns.uuidRegex = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i
  ns.fullUuidRegex = new RegExp("^#{ns.uuidRegex.source}$", 'i')
  ns.cdnUrlModifiersRegex = /(?:-\/(?:[a-z0-9_]+\/)+)+/i

  ns.normalizeUrl = (url) ->
    url = "https://#{url}" unless url.match /^([a-z][a-z0-9+\-\.]*:)?\/\//i
    url.replace(/\/+$/, '')

  ns.buildSettings = (settings) ->
    settings = $.extend({}, uploadcare.defaults, settings or {})

    if $.type(settings.tabs) == "string"
      settings.tabs = settings.tabs.split(' ')

    settings.tabs = settings.tabs or []

    for key in ['urlBase', 'socialBase', 'cdnBase']
      settings[key] = ns.normalizeUrl(settings[key])

    # Boolean settings
    # <... foo>, <... foo="true">, <... foo="enabled">, <... foo="foo"> — On
    # <... foo="false">, <... foo="disabled"> - Off
    # <... > - Default used
    for key in ['previewStep', 'multiple', 'imagesOnly', 'pathValue']
      if typeof settings[key] is 'string'
        value = $.trim(settings[key]).toLowerCase()
        settings[key] = not (value in ['false', 'disabled'])
      else
        settings[key] = !!settings[key]

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
    if crop.match /disabled/i
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

  ns.fitText = (text, max) ->
    if text.length > max
      head = Math.ceil((max - 3) / 2)
      tail = Math.floor((max - 3) / 2)
      text.slice(0, head) + '...' + text.slice(-tail)
    else
      text

  ns.fileInput = (container, multiple, fn) ->
    container.find('input:file').remove()
    input = if multiple
      $('<input type="file" multiple>')
    else
      $('<input type="file">')

    input
      .on('change', fn)
      .css(
        position: 'absolute'
        top: 0
        opacity: 0
        margin: 0
        padding: 0
        width: 'auto'
        height: 'auto'
        cursor: container.css('cursor')
      )
    container
      .css(
        position: 'relative'
        overflow: 'hidden'
      )
      .append(input)

    # to make it posible to set `cursor:pointer` on button
    # http://stackoverflow.com/a/9182787/478603
    container.mousemove (e) ->
      {left, top} = $(this).offset()
      width = input.width()
      input.css
        left: e.pageX - left - width + 10
        top: e.pageY - top - 10


  # url = parseUrl('http://example.com/page/123?foo=bar#top')
  # url.href == 'http://example.com/page/123?foo=bar#top'
  # url.protocol == 'http:'
  # url.host == 'example.com'
  # url.pathname == '/page/123'
  # url.search == '?foo=bar'
  # url.hash == '#top'
  ns.parseUrl = (url) ->
    a = document.createElement('a')
    a.href = url
    return a

  ns.createObjectUrl = (object) ->
    URL = window.URL || window.webkitURL
    if URL
      return URL.createObjectURL(object)
    return null

  ns.inDom = (el) ->
    if el.jquery
      el = el.get(0)
    $.contains(document.documentElement, el)
