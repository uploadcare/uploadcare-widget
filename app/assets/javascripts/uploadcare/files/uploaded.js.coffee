{namespace, jQuery: $, utils} = uploadcare

namespace 'uploadcare.files', (ns) ->

  class ns.UploadedFile extends ns.BaseFile
    constructor: (settings, fileIdOrUrl) ->
      super

      cdnUrl = utils.splitCdnUrl(fileIdOrUrl)
      if cdnUrl
        @fileId = cdnUrl[1]
        @cdnUrlModifiers = cdnUrl[2] if cdnUrl[2]
        @__uploadDf.resolve(this)
      else
        @__uploadDf.reject('baddata', this)

    __startUpload: ->
      # nothing to do


  class ns.ReadyFile extends ns.BaseFile
    constructor: (settings, __fileData) ->
      super
      @fileId = __fileData.uuid
      @__handleFileData(__fileData)
      @__uploadDf.resolve()

    __startUpload: ->
      # nothing to do


  class ns.DeletedFile extends ns.BaseFile
    constructor: ->
      super
      @__uploadDf.reject('deleted')

    __startUpload: ->
      # nothing to do
