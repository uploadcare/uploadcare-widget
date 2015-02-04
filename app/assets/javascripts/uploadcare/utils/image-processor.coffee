{
  namespace,
  jQuery: $,
  utils,
} = uploadcare

namespace 'uploadcare.utils.imageProcessor', (ns) ->

  DataView = window.DataView
  FileReader = window.FileReader?.prototype.readAsArrayBuffer && window.FileReader
  URL = window.URL or window.webkitURL
  URL = URL.createObjectURL && URL

  ns.reduceFile = (file, settings) ->
    # in -> file
    # out <- blob
    df = $.Deferred()
    exif = null
    exifTags = null

    if not (URL and DataView)
      return df.reject('support')

    op = ns.readJpegChunks(file)
    op.progress (marker, view) ->
      if marker == 0xe1
        if view.byteLength >= 14
          if view.getUint32(0) == 0x45786966 and view.getUint16(4) == 0
            exif = view.buffer
    op.always ->
      # start = new Date()
      img = new Image()
      img.onload = ->
        # console.log('load: ' + (new Date() - start))
        op = ns.reduceImage(img, settings)
        op.fail df.reject
        op.done (canvas) ->
          # start = new Date()
          utils.canvasToBlob canvas, 'image/jpeg', settings.quality or 0.95,
            (blob) ->
              if exif
                intro = new DataView(new ArrayBuffer(6))
                intro.setUint32(0, 0xffd8ffe1)
                intro.setUint16(4, exif.byteLength + 2)
                blob = new Blob([
                  intro, exif, blob.slice(2, blob.size)
                ], {type: blob.type})
              # console.log('to blob: ' + (new Date() - start))
              df.resolve(blob)

      img.onerror = ->
        df.reject('not image')

      img.src = URL.createObjectURL(file)

    df.promise()


  ns.reduceImage = (img, settings) ->
    # in -> image
    # out <- canvas
    df = $.Deferred()

    if img.width * img.height < settings.size * settings.tolerance
      return df.reject('not required')

    # start = new Date()
    sW = img.width
    sH = img.height
    ratio = sW / sH
    w = Math.round(Math.sqrt(settings.size * ratio))
    h = Math.round(settings.size / Math.sqrt(settings.size * ratio))

    x = 1.4
    maxSquare = 5000000  # ios max canvas square
    maxSize = 4096 # ie max canvas dimensions
    while sW > w
      sW = Math.round(sW / x)
      sH = Math.round(sH / x)
      if sW < w * x
        sW = w
        sH = h
      if sW * sH > maxSquare
        sW = Math.floor(Math.sqrt(maxSquare * ratio))
        sH = Math.floor(maxSquare / Math.sqrt(maxSquare * ratio))
      if sW > maxSize
        sW = maxSize
        sH = sW / ratio
      if sH > maxSize
        sH = maxSize
        sW = maxSize * sH
      canvas = document.createElement('canvas')
      canvas.width = sW
      canvas.height = sH
      canvas.getContext('2d').drawImage(img, 0, 0, sW, sH)
      img = canvas

    # console.log('draw: ' + (new Date() - start))
    df.resolve(canvas)

    df.promise()


  ns.readJpegChunks = (file) ->
    readToView = (file, cb) ->
      reader = new FileReader()
      reader.onload = ->
        cb(new DataView(reader.result))
      reader.readAsArrayBuffer(file)

    readNext = ->
      readToView file.slice(pos, pos += 4), (view) ->
        if view.byteLength != 4 or view.getUint8(0) != 0xff
          return df.reject('corrupted')

        marker = view.getUint8(1)
        if marker == 0xda # Start Of Scan
          # console.log('read jpeg chunks: ' + (new Date() - start))
          return df.resolve()
        length = view.getUint16(2) - 2

        readToView file.slice(pos, pos += length), (view) ->
          if view.byteLength != length
            return df.reject('corrupted')
          df.notify(marker, view)
          readNext()

    df = $.Deferred()

    if not (FileReader and DataView)
      return df.reject('support')

    # start = new Date()
    pos = 2

    readToView file.slice(0, 2), (view) ->
      if view.getUint16(0) != 0xffd8
        return df.reject('not jpeg')
      readNext()

    df.promise()
