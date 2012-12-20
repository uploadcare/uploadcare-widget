# = require uploadcare/files

uploadcare.whenReady ->
  {
    namespace,
    utils,
    files: f,
    jQuery: $
  } = uploadcare

  namespace 'uploadcare.uploader', (ns) ->
    class FileInfo
      constructor: (@fileId, @fileName, @fileSize) ->

    class UploadedFile
      constructor: (@file) ->
        @loaded = 0
        @total = 1
        @fileInfo = null
        @error = false

      upload: (settings, callback) ->
        $(@file)
          .on 'uploadcare.api.uploader.load', (e) =>
            @loaded = @total
            @fileInfo = new FileInfo(
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


    class ns.Uploader
      constructor: (@settings) ->
        @reset()

      reset: ->
        upload.cancel() for upload in @uploads if @uploads?
        @uploads = []
        @uploadDef = $.Deferred()
        @uploadDef.fail => @reset()

      upload: (args...) ->
        for file in f.toFiles(args...)
          uploadedFile = new UploadedFile(file)
          @uploads.push(uploadedFile)
          utils.defer => uploadedFile.upload(@settings, @notify)

        @uploadDef

      notify: =>
        progress = []
        info = []
        loaded = true
        error = true

        for uploadedFile in @uploads
          fileProgress = uploadedFile.progress()
          progress.push(fileProgress)

          fileInfo = uploadedFile.info()
          info.push(fileInfo)
          loaded = false if fileInfo == null
          error = false if fileInfo != false

        progressSum = 0
        progressRecs = 0
        for progressRec in progress when progressRec
          progressSum += progressRec
          progressRecs += 1

        progress.value = progressSum / progressRecs

        if error
          @uploadDef.reject()
        else if loaded
          @uploadDef.resolve(info)
        else
          @uploadDef.notify(progress)
