# = require uploadcare/files

uploadcare.whenReady ->
  {
    namespace,
    files,
    jQuery: $
  } = uploadcare

  namespace 'uploadcare.uploader', (ns) ->
    class UploadedFile
      constructor: (@fileId, @fileName, @fileSize) ->



    class ns.Uploader
      constructor: (@settings) ->

      upload: (args...) ->
        file = files.toFile(args...)

        uploadDef = $.Deferred ->

          @fail ->
            file.cancel()

          $(file)
            .on 'uploadcare.api.uploader.load', (e) =>
              @resolve new UploadedFile(e.target.fileId, e.target.fileName, e.target.fileSize)

            .on 'uploadcare.api.uploader.error', (e) =>
              @reject()

            .on 'uploadcare.api.uploader.progress', (e) =>
              @notify(e.target.loaded, e.target.fileSize)


          file.upload(@settings)

        uploadDef #.promise()


