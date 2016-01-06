{
  jQuery: $,
  utils
} = uploadcare

uploadcare.namespace 'files', (ns) ->

  class ns.UploadedFile extends ns.BaseFile
    sourceName: 'uploaded'

    constructor: (settings, fileIdOrUrl) ->
      super

      cdnUrl = utils.splitCdnUrl(fileIdOrUrl)
      if cdnUrl
        @fileId = cdnUrl[1]
        if cdnUrl[2]
          @cdnUrlModifiers = cdnUrl[2]
      else
        @__rejectApi('baddata')


  class ns.ReadyFile extends ns.BaseFile
    sourceName: 'uploaded'

    constructor: (settings, data) ->
      super
      if not data
        @__rejectApi('deleted')
      else
        @fileId = data.uuid
        @__handleFileData(data)
