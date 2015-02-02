{
  namespace,
  jQuery: $,
  utils,
} = uploadcare

namespace 'uploadcare.utils.imageProcessor', (ns) ->

  URL = window.URL or window.webkitURL

  ns.reduceFile = (file, settings) ->
    # in -> file
    # out <- blob
    df = $.Deferred()

    if not URL
      df.reject('support')

    else
      start = new Date()
      img = new Image()
      img.onload = ->
        console.log('load: ' + (new Date() - start))
        op = ns.reduceImage(img, settings)
        op.fail df.reject
        op.done (canvas) ->
          start = new Date()
          utils.canvasToBlob canvas, 'image/jpeg', settings.quality or 0.95,
            (blob) ->
              console.log('to blob: ' + (new Date() - start))
              df.resolve(blob)

      img.onerror = ->
        df.reject('not image')

      img.src = URL.createObjectURL(file)

    df.promise()


  ns.reduceImage = (img, settings) ->
    # in -> image
    # out <- canvas
    df = $.Deferred()

    [w, h] = settings.size

    if img.width < w and img.height < h
      df.reject('not required')

    else
      start = new Date()

      if img.width / w > img.height / h
        h = img.height * w / img.width
      else
        w = img.width * h / img.height

      canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);

      console.log('draw: ' + (new Date() - start))
      df.resolve(canvas)

    df.promise()
