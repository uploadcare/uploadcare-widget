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

    if not URL
      df.reject('support')

    else
      ns.readJpegChunks(file).progress (marker, view) ->
        console.log(marker, view.byteLength)

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
          console.log('read jpeg chunks: ' + (new Date() - start))
          return df.resolve()
        length = view.getUint16(2) - 2

        readToView file.slice(pos, pos += length), (view) ->
          if view.byteLength != length
            return df.reject('corrupted')
          df.notify(marker, view)
          readNext()

    df = $.Deferred()

    if not (FileReader and DataView)
      df.reject('support')

    else
      pos = 2
      start = new Date()

      readToView file.slice(0, 2), (view) ->
        if view.getUint16(0) != 0xffd8
          return df.reject('not jpeg')

        readNext()

    df.promise()
