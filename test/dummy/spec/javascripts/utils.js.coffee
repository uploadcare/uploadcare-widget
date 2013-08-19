jasmine.ns 'utils', (ns) ->

  ns.toFileProperties = (fixture) ->
    fileId:           fixture.uuid
    fileName:         fixture.info.original_filename
    fileSize:         fixture.info.size
    isStored:         fixture.info.is_stored
    isImage:          fixture.info.is_image
    isReady:          fixture.info.is_ready
    imageInfo:        fixture.image_info
    cdnUrlModifiers:  fixture.cdnUrlModifiers
    previewUrl:       fixture.previewUrl

  ns.toFileInfo = (fixture, settings = uploadcare.settings.build()) ->
    uuid:             fixture.uuid
    name:             fixture.info.original_filename
    size:             fixture.info.size
    isStored:         fixture.info.is_stored
    isImage:          fixture.info.is_image
    isReady:          fixture.info.is_ready
    originalImageInfo:fixture.image_info
    cdnUrlModifiers:  fixture.cdnUrlModifiers
    previewUrl:       fixture.previewUrl
    cdnUrl: "#{settings.cdnBase}/#{fixture.uuid}/#{fixture.cdnUrlModifiers or ''}"


