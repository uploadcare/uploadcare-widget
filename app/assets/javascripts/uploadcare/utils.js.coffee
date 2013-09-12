# = require uploadcare/utils/abilities
# = require uploadcare/utils/pusher
# = require uploadcare/utils/collection
# = require uploadcare/utils/warnings
# = require uploadcare/utils/load-plugin

{
  namespace,
  jQuery: $
} = uploadcare

namespace 'uploadcare.utils', (ns) ->

  own = Object.prototype.hasOwnProperty
  ns.own = (o, prop) ->
    own.call(o, prop)

  ns.uniq = (arr, cond = -> true) ->
    result = []
    for item in arr when cond(item) and item not in result
      result.push(item)
    result

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

  ns.wrapToPromise = (value) ->
    $.Deferred().resolve(value).promise()

  ns.remove = (array, item) ->
    if (index = array.indexOf(item)) isnt -1
      array.splice(index, 1)
      true
    else
      false

  # same as promise.then(), but if filter returns promise
  # it will be just passed forward without any special behavior
  ns.then = (pr, doneFilter, failFilter, progressFilter) ->
    df = $.Deferred()
    compose = (fn1, fn2) ->
      if fn1 and fn2
        -> fn2.call(this, fn1.apply(this, arguments))
      else
        fn1 or fn2
    pr.then(
      compose(doneFilter, df.resolve),
      compose(failFilter, df.reject),
      compose(progressFilter, df.notify)
    )
    df.promise()

  ns.bindAll = (source, methods) ->
    target = {}
    for method in methods
      do (method) ->
        fn = source[method]
        target[method] = unless $.isFunction(fn) then fn else ->
          result = fn.apply(source, arguments)
          if result == source then target else result # Fix chaining
    target

  ns.upperCase = (s) ->
    s.replace(/-/g, '_').toUpperCase()

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
  ns.groupIdRegex = new RegExp("#{ns.uuidRegex.source}~[0-9]+", 'i')
  ns.fullUuidRegex = new RegExp("^#{ns.uuidRegex.source}$", 'i')
  ns.cdnUrlModifiersRegex = /(?:-\/(?:[a-z0-9_,]+\/)+)+/i

  ns.escapeRegExp = (str) ->
    str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")

  ns.normalizeUrl = (url) ->
    url = "https://#{url}" unless url.match /^([a-z][a-z0-9+\-\.]*:)?\/\//i
    url.replace(/\/+$/, '')

  ns.fitText = (text, max) ->
    if text.length > max
      head = Math.ceil((max - 3) / 2)
      tail = Math.floor((max - 3) / 2)
      text.slice(0, head) + '...' + text.slice(-tail)
    else
      text

  ns.fitSizeInCdnLimit = (objSize) ->
    ns.fitSize(objSize, [1600, 1600])

  ns.fitSize = (objSize, boxSize, upscale) ->
    if objSize[0] > boxSize[0] or objSize[1] > boxSize[1] or upscale
      widthRatio = boxSize[0] / objSize[0]
      heightRation = boxSize[1] / objSize[1]
      if !boxSize[0] || (boxSize[1] && widthRatio > heightRation)
        [Math.round(heightRation * objSize[0]), boxSize[1]]
      else
        [boxSize[0], Math.round(widthRatio * objSize[1])]
    else
      objSize.slice()

  ns.fileInput = (container, multiple, fn) ->
    container.find('input:file').remove()
    input = if multiple
      $('<input type="file" multiple>')
    else
      $('<input type="file">')

    input
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

    input.on 'change', (e) ->
      fn(e)
      input.remove()
      ns.fileInput(container, multiple, fn)

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

  ns.readableFileSize = (value, onNaN='', prefix='', postfix='') ->
    value = parseInt(value, 10)
    return onNaN if isNaN(value)
    labels = 'B KB MB GB TB PB EB ZB YB'.split ' '
    for label, i in labels
      if value < 512 or i is labels.length - 1
        return "#{prefix}#{value} #{label}#{postfix}"
      value = Math.round(value / 1024)

  ns.imagePath = (name) ->
    uploadcare.settings.build().scriptBase + 'images/' + name

  ns.jsonp = (url, type, data) ->
    if $.isPlainObject type
      data = type
      type = 'GET'
    $.ajax({type, url, data, crossDomain: true}).then (data) ->
      if data.error
        text = data.error.content or data.error
        ns.warn("JSONP error: #{text}")
        $.Deferred().reject(text)
      else
        data
    , (_, textStatus, errorThrown) ->
      text = "#{textStatus} (#{errorThrown})"
      ns.warn("JSONP unexpected error: #{text}")
      text

  ns.plugin = (fn) ->
    fn uploadcare
