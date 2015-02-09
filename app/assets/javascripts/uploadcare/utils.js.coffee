# = require uploadcare/utils/abilities
# = require uploadcare/utils/pusher
# = require uploadcare/utils/collection
# = require uploadcare/utils/warnings

{
  namespace,
  jQuery: $
} = uploadcare

namespace 'uploadcare.utils', (ns) ->

  ns.unique = (arr) ->
    result = []
    for item in arr when item not in result
      result.push(item)
    result

  ns.imageLoader = (src) ->
    def = $.Deferred()
    $(new Image)
      .on('load', def.resolve)
      .on('error', def.reject)
      .attr('src', src)
    def.promise()

  ns.defer = (fn) ->
    setTimeout fn, 0

  ns.gcd = (a, b) ->
    while b
        c = a % b
        a = b
        b = c
    a

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
    index = $.inArray(item, array)
    if index isnt -1
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

  # Build copy of source with only specified methods.
  # Handles chaining correctly.
  ns.bindAll = (source, methods) ->
    target = {}
    $.each methods, (i, method) ->
      fn = source[method]
      if $.isFunction(fn)
        target[method] = ->
          result = fn.apply(source, arguments)
          if result == source then target else result # Fix chaining
      else
        target[method] = fn
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

  # splitUrlRegex("url") => ["url", "scheme", "host", "path", "query", "fragment"]
  ns.splitUrlRegex = /^(?:([^:\/?#]+):)?(?:\/\/([^\/?\#]*))?([^?\#]*)\??([^\#]*)\#?(.*)$/

  ns.uuidRegex = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i
  ns.groupIdRegex = new RegExp("#{ns.uuidRegex.source}~[0-9]+", 'i')
  ns.cdnUrlRegex = new RegExp("^/?(#{ns.uuidRegex.source})(?:/(-/(?:[^/]+/)+)?([^/]*))?$", 'i')
  ns.splitCdnUrl = (url) ->
    ns.cdnUrlRegex.exec ns.splitUrlRegex.exec(url)[3]

  ns.escapeRegExp = (str) ->
    str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")

  ns.globRegexp = (str, flags='i') ->
    parts = $.map(str.split('*'), ns.escapeRegExp)
    new RegExp("^" + parts.join('.+') + "$", flags)

  ns.normalizeUrl = (url) ->
    # google.com/ → http://google.com
    # /google.com/ → /google.com
    # //google.com/ → http://google.com
    # http://google.com/ → http://google.com
    scheme = document.location.protocol
    if scheme != 'http:'
      scheme = 'https:'

    parts = url.match /^([^:/?#]+:)?\/?(\/)?/
    if not parts[1]  # if no scheme
      if parts[2]  # if two slashes
        url = "#{scheme}#{url}"
      else if not parts[0] # if no one slash
        url = "#{scheme}//#{url}"
    url.replace(/\/+$/, '')

  ns.fitText = (text, max) ->
    if text.length > max
      head = Math.ceil((max - 3) / 2)
      tail = Math.floor((max - 3) / 2)
      text.slice(0, head) + '...' + text.slice(-tail)
    else
      text

  ns.fitSizeInCdnLimit = (objSize) ->
    ns.fitSize(objSize, [2048, 2048])

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

  ns.fileInput = (container, settings, fn) ->
    input = null
    accept = settings.inputAcceptTypes
    if accept is ''
      accept = if settings.imagesOnly then 'image/*' else null

    do run = ->
      input = (
        if settings.multiple
          $('<input type="file" multiple>')
        else
          $('<input type="file">')
      )
        .attr('accept', accept)
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
        .on 'change', ->
          fn(this)
          $(this).hide()
          run()

      container.append(input)

    container
      .css(
        position: 'relative'
        overflow: 'hidden'
      )
      # to make it posible to set `cursor:pointer` on button
      # http://stackoverflow.com/a/9182787/478603
      .mousemove (e) ->
        {left, top} = $(this).offset()
        width = input.width()
        input.css
          left: e.pageX - left - width + 10
          top: e.pageY - top - 10

  ns.fileSelectDialog = (container, settings, fn) ->
    accept = settings.inputAcceptTypes
    if accept is ''
      accept = if settings.imagesOnly then 'image/*' else null
    (
      if settings.multiple
        $('<input type="file" multiple>')
      else
        $('<input type="file">')
    )
      .attr('accept', accept)
      .css(
        position: 'fixed'
        bottom: 0
        opacity: 0
      )
      .on 'change', ->
        fn(this)
        $(this).remove()
      .appendTo(container)
      .focus()
      .click()
      .hide()

  ns.fileSizeLabels = 'B KB MB GB TB PB EB ZB YB'.split ' '

  ns.readableFileSize = (value, onNaN='', prefix='', postfix='') ->
    value = parseInt(value, 10)
    if isNaN(value)
      return onNaN

    digits = 2
    i = 0
    threshold = 1000 - 5 * Math.pow(10, 2 - Math.max(digits, 3))
    while value > threshold and i < ns.fileSizeLabels.length - 1
      i++
      value /= 1024

    value += 0.000000000000001;

    # number of digits after point: total number minus digits before point
    fixedTo = Math.max(0, digits - Math.floor(value).toFixed(0).length)
    # fixed → number → string, to trim trailing zeroes
    value = Number(value.toFixed(fixedTo))
    return "#{prefix}#{value} #{ns.fileSizeLabels[i]}#{postfix}"

  ns.imagePath = (name) ->
    uploadcare.settings.common().scriptBase + '/images/' + name

  ns.ajaxDefaults =
    dataType: 'json'
    crossDomain: true
    cache: false

  ns.jsonp = (url, type, data) ->
    if $.isPlainObject type
      data = type
      type = 'GET'
    $.ajax($.extend {url, type, data}, ns.ajaxDefaults).then (data) ->
      if data.error
        text = data.error.content or data.error
        ns.warn("JSONP error: #{text} while loading #{url}")
        $.Deferred().reject(text)
      else
        data
    , (_, textStatus, errorThrown) ->
      text = "#{textStatus} (#{errorThrown})"
      ns.warn("JSONP unexpected error: #{text} while loading #{url}")
      text


  ns.plugin = (fn) ->
    fn uploadcare


  ns.canvasToBlob = (canvas, type, quality, callback) ->
    if HTMLCanvasElement.prototype.toBlob
      return canvas.toBlob(callback, type, quality)

    dataURL = canvas.toDataURL(type, quality);
    dataURL = dataURL.split(',');

    binStr = atob(dataURL[1])
    arr = new Uint8Array(binStr.length)

    for i in [0...binStr.length] by 1
      arr[i] = binStr.charCodeAt(i)

    callback(new Blob( [arr], {type: /:(.+\/.+);/.exec(dataURL[0])[1]} ))


  ns.taskRunner = (capacity) ->
    running = 0
    queue = []

    release = ->
      if queue.length
        task = queue.shift()
        ns.defer ->
          task(release)
      else
        running -= 1

    run = (task) ->
      if running < capacity
        running += 1
        task(release)
      else
        queue.push(task)
