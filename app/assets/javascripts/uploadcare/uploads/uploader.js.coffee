# = require uploadcare/files
# = require ./uploaded-file

uploadcare.whenReady ->
  {
    namespace,
    utils,
    files: f,
    jQuery: $
  } = uploadcare

  namespace 'uploadcare.uploads', (ns) ->
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
          uploadedFile = new ns.UploadedFile(file)
          @uploads.push(uploadedFile)
          do (uploadedFile) =>
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
        for progressRec in progress
          progressSum += progressRec
          progressRecs += 1

        progress.value = progressSum / progressRecs

        if error
          @uploadDef.reject()
        else if loaded
          @uploadDef.resolve(info)
        else
          @uploadDef.notify(progress)
