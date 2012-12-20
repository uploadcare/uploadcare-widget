# = require uploadcare/files

uploadcare.whenReady ->
  {
    namespace,
    files: f,
    jQuery: $
  } = uploadcare

  namespace 'uploadcare.uploader', (ns) ->
    class UploadedFile
      constructor: (@fileId, @fileName, @fileSize) ->

    class UploadProgress
      constructor: (@loaded, @total) ->
        @value = @loaded / @total

    class ns.Uploader
      constructor: (@settings) ->

      upload: (args...) ->
        files = f.toFiles(args...)
        file = files[0] # FIXME

        uploadDef = $.Deferred ->

          @fail ->
            file.cancel()

          $(file)
            .on 'uploadcare.api.uploader.load', (e) =>
              @resolve new UploadedFile(e.target.fileId, e.target.fileName, e.target.fileSize)

            .on 'uploadcare.api.uploader.error', (e) =>
              @reject()

            .on 'uploadcare.api.uploader.progress', (e) =>
              @notify new UploadProgress(e.target.loaded, e.target.fileSize)

          file.upload(@settings)

        uploadDef
