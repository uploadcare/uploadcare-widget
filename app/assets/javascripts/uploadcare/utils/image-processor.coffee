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
        exifTags = ns.parseExifTags(view)
        if exifTags?
          exif = view.buffer
    op.always ->
      # start = new Date()
      img = new Image()
      img.onload = ->
        # console.log('load: ' + (new Date() - start))
        if exifTags and exifTags[0x0112] >= 5
          # transpose size
          settings = $.extend(
            {}, settings, {size: [settings.size[1], settings.size[0]]}
          )
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

    [w, h] = settings.size

    if img.width < w and img.height < h
      return df.reject('not required')

    # start = new Date()

    if img.width / w > img.height / h
      h = img.height * w / img.width
    else
      w = img.width * h / img.height

    canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    canvas.getContext('2d').drawImage(img, 0, 0, w, h);

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


  ns.parseExifTags = (view) ->
    if view.byteLength < 6 + 2
      return
    if view.getUint32(0) != 0x45786966 or view.getUint16(4) != 0
      return

    tiffOffset = 6
    if view.getUint16(tiffOffset) == 0x4949
      littleEnd = true
    else if view.getUint16(tiffOffset) == 0x4d4d
      littleEnd = false
    else
      return

    if view.getUint16(tiffOffset + 2, littleEnd) != 0x002a
      return

    entryOffset = view.getUint32(tiffOffset + 4, littleEnd)
    if entryOffset < 8
      return
    entryOffset += tiffOffset + 2

    entries = view.getUint16(entryOffset - 2, littleEnd)
    tags = {}

    for i in [0...entries]
      tag = view.getUint16(entryOffset, littleEnd)
      value = readTagValue(view, entryOffset + 2, littleEnd)
      if value?
        tags[tag] = value
      entryOffset += 12
    tags


  readTagValue = (view, entryOffset, littleEnd) ->
    type = view.getUint16(entryOffset, littleEnd)
    numValues = view.getUint32(entryOffset += 2, littleEnd)
    valueOffset = view.getUint32(entryOffset += 4, littleEnd) + 6

    if type == 2  # ascii, 8-bit byte
      offset = if numValues > 4 then valueOffset else entryOffset
      buffer = view.buffer.slice(offset, offset + numValues - 1)
      return String.fromCharCode.apply(null, new Uint8Array(buffer))

    if numValues == 1
      switch type
        # byte, 8-bit unsigned int
        # undefined, 8-bit byte, value depending on field
        when 1, 7
          return view.getUint8(entryOffset)

        when 3  # short, 16 bit int
          return view.getUint16(entryOffset, littleEnd)

        when 4  # long, 32 bit int
          return view.getUint32(entryOffset, littleEnd)

        when 5  # rational = two long values, first is numerator, second is denominator
          return view.getUint32(valueOffset, littleEnd) / view.getUint32(valueOffset + 4, littleEnd)

        when 9  # slong, 32 bit signed int
          return view.getInt32(entryOffset, littleEnd)

        when 10  # signed rational, two slongs, first is numerator, second is denominator
          return view.getInt32(valueOffset, littleEnd) / view.getInt32(valueOffset + 4, littleEnd)
