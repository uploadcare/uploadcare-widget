# = require ./file-info

uploadcare.whenReady ->
  {
    namespace,
    jQuery: $
  } = uploadcare

  namespace 'uploadcare.uploads', (ns) ->
    class ns.UploadedFile
      constructor: (@file) ->
        @loaded = 0
        @total = 1
        @fileInfo = null
        @error = false

      upload: (settings, callback) ->
        $(@file)
          .on 'uploadcare.api.uploader.load', (e) =>
            @loaded = @total
            @fileInfo = new ns.FileInfo(
              e.target.fileId,
              e.target.fileName,
              e.target.fileSize
            )
            callback()

          .on 'uploadcare.api.uploader.error', (e) =>
            @error = true
            callback()

          .on 'uploadcare.api.uploader.progress', (e) =>
            @loaded = e.target.loaded
            @total = e.target.fileSize
            callback()

        @file.upload(settings)

      cancel: ->
        @file.cancel()

      progress: ->
        return false if @error || @total == 0
        @loaded / @total

      info: ->
        return false if @error
        @fileInfo
