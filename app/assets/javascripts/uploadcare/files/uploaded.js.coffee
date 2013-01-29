uploadcare.whenReady ->
  {namespace, jQuery: $, utils} = uploadcare

  namespace 'uploadcare.files', (ns) ->

    class ns.UploadedFile extends ns.BaseFile
      constructor: (settings, fileIdOrUrl) ->
        super
        @fileId = utils.uuidRegex.exec(fileIdOrUrl)[0]
        # TODO: save url
        @__uploadDf.resolve(this)

      __startUpload: ->
        # nothing to do