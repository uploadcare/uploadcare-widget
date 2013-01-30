uploadcare.whenReady ->
  {namespace, jQuery: $, utils} = uploadcare

  namespace 'uploadcare.files', (ns) ->

    class ns.UploadedFile extends ns.BaseFile
      constructor: (settings, fileIdOrUrl) ->
        super
        @fileId = utils.uuidRegex.exec(fileIdOrUrl)[0]

        url = utils.cdnUrlModifiersRegex.exec(fileIdOrUrl)
        if url and url[1]
          @cdnUrlModifiers = url[1]

        @__uploadDf.resolve(this)

      __startUpload: ->
        # nothing to do