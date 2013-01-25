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
        @total = 0
        @fileInfo = null
        @error = false

      upload: (settings, callback) ->
        @file.upload(settings)
          .done (file) =>
            @loaded = @total
            @fileInfo = ns.fileInfo(file.fileId, settings)
            callback()

          .fail =>
            @error = true
            callback()

          .progress (file) =>
            @loaded = file.loaded
            @total = file.fileSize
            callback()


      cancel: ->
        @file.cancel()

      progress: ->
        return 0 if @loaded == 0 # >0 when total is available
        return false if @error || @total == 0
        @loaded / @total

      info: ->
        return false if @error
        @fileInfo
