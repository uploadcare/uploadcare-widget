{namespace, jQuery: $, utils} = uploadcare

namespace 'uploadcare.files', (ns) ->

  class ns.UploadedFile extends ns.BaseFile
    constructor: (settings, fileIdOrUrl) ->
      super

      id = utils.uuidRegex.exec(fileIdOrUrl)
      if id
        @fileId = id[0]
        modifiers = utils.cdnUrlModifiersRegex.exec(fileIdOrUrl)
        @cdnUrlModifiers = modifiers[0] if modifiers
        @cdnUrl = "#{@settings.cdnBase}/#{@fileId}/#{@cdnUrlModifiers or ''}"
        @__buildPreviewUrl()
        @__uploadDf.resolve(this)
      else
        @__uploadDf.reject('baddata', this)

    __startUpload: ->
      # nothing to do


  class ns.ReadyFile extends ns.BaseFile
    constructor: (settings, @__fileData) ->
      super
      @fileId = @__fileData.file_id
      @__uploadDf.resolve()

    __startUpload: ->
      # nothing to do

    __requestInfo: ->
      @__handleFileData(@__fileData)


  class ns.DeletedFile extends ns.BaseFile
    constructor: ->
      super
      @__uploadDf.reject('deleted')

    __startUpload: ->
      # nothing to do
