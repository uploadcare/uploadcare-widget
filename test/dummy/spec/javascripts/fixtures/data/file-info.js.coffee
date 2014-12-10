jasmine.ns 'fixtures', (ns) ->

  ns.fileInfo =
    kitty:
      uuid: '11e85a4c-30c2-430b-8fba-1c60a18bded8'
      cdnUrlModifiers: ''
      originalUrl: 'http://example.com/kitty.jpg'
      info:
        original_filename: 'kitty.jpg'
        size: 100
        is_image: true
        is_stored: false
        is_ready: true
        image_info:
          width: 1145
          geo_location: null
          datetime_original: null
          height: 725
    doc:
      uuid: '0701908a-725c-42ed-89b0-d7b9a911f1f2'
      cdnUrlModifiers: ''
      originalUrl: 'http://example.com/doc.doc'
      info:
        original_filename: 'doc.doc'
        size: 500
        is_image: false
        is_stored: false
        is_ready: true
        image_info: null
