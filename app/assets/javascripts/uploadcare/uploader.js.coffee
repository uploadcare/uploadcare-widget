# = require uploadcare/files

uploadcare.whenReady ->
  {
    namespace,
    files,
    jQuery: $
  } = uploadcare

  namespace 'uploadcare.uploader', (ns) ->
    class ns.Uploader
      constructor: (@settings) ->

      upload: (args...) ->
        file = files.toFile(args...)

        uploadDef = $.Deferred ->

          $(file)
            .on 'uploadcare.api.uploader.load', (e) ->
              uploadDef.resolve(@fileId)
            .on 'uploadcare.api.uploader.error', (e) ->
              uploadDef.reject()

          file.upload(@settings)

        uploadDef.promise()


