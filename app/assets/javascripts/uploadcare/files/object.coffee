# = require ../vendor/jquery-xdr.js
# = require ../utils/image-processor.coffee

{
  jQuery: $,
  utils
} = uploadcare

uploadcare.namespace 'files', (ns) ->

  class ns.ObjectFile extends ns.BaseFile
    _directRunner = null
    sourceName: 'local'

    constructor: (settings, @__file) ->
      super

      @fileName = @__file.name or 'original'
      @__notifyApi()

    setFile: (file) =>
      if file
        @__file = file
      if not @__file
        return
      @fileSize = @__file.size
      @fileType = @__file.type or 'application/octet-stream'
      if @settings.debugUploads
        utils.debug("Use local file.", @fileName, @fileType, @fileSize)
      @__runValidators()
      @__notifyApi()

    __startUpload: ->
      @apiDeferred.always =>
        @__file = null

      if @__file.size >= @settings.multipartMinSize and utils.abilities.blob
        @setFile()
        return @multipartUpload()

      ios = utils.abilities.iOSVersion
      if not @settings.imageShrink or (ios and ios < 8)
        @setFile()
        return @directUpload()

      # if @settings.imageShrink
      df = $.Deferred()
      resizeShare = .4
      utils.imageProcessor.shrinkFile(@__file, @settings.imageShrink)
        .progress (progress) ->
          df.notify(progress * resizeShare)
        .done(@setFile)
        .fail =>
          @setFile()
          resizeShare = resizeShare * .1
        .always =>
          df.notify(resizeShare)
          @directUpload()
            .done(df.resolve)
            .fail(df.reject)
            .progress (progress) ->
              df.notify(resizeShare + progress * (1 - resizeShare))
      return df

    __autoAbort: (xhr) ->
      @apiDeferred.fail(xhr.abort)
      xhr

    directRunner: (task) ->
      if not _directRunner
        _directRunner = utils.taskRunner(@settings.parallelDirectUploads)
      _directRunner(task)

    directUpload: ->
      df = $.Deferred()

      if not @__file
        @__rejectApi('baddata')
        return df
      if @fileSize > 100 * 1024 * 1024
        @__rejectApi('size')
        return df

      @directRunner (release) =>
        df.always(release)
        if @apiDeferred.state() != 'pending'
          return

        formData = new FormData()
        formData.append('UPLOADCARE_PUB_KEY', @settings.publicKey)
        formData.append('UPLOADCARE_STORE', if @settings.doNotStore then '' else 'auto')
        formData.append('file', @__file, @fileName)
        formData.append('file_name', @fileName)

        @__autoAbort($.ajax(
          xhr: =>
            # Naked XHR for progress tracking
            xhr = $.ajaxSettings.xhr()
            if xhr.upload
              xhr.upload.addEventListener 'progress', (e) =>
                df.notify(e.loaded / e.total)
              , false
            xhr
          crossDomain: true
          type: 'POST'
          url: "#{@settings.urlBase}/base/?jsonerrors=1"
          headers: {'X-PINGOTHER': 'pingpong'}
          contentType: false # For correct boundary string
          processData: false
          data: formData
          dataType: 'json'
          error: df.reject
          success: (data) =>
            if data?.file
              @fileId = data.file
              df.resolve()
            else
              df.reject()
        ))

      df

    multipartUpload: ->
      df = $.Deferred()

      if not @__file
        return df
      if @settings.imagesOnly
        @__rejectApi('image')
        return df

      @multipartStart().done (data) =>
        @uploadParts(data.parts, data.uuid).done =>
          @multipartComplete(data.uuid).done (data) =>
            @fileId = data.uuid
            @__handleFileData(data)
            df.resolve()
          .fail(df.reject)
        .progress(df.notify)
        .fail(df.reject)
      .fail(df.reject)

      df

    multipartStart: ->
      data =
        UPLOADCARE_PUB_KEY: @settings.publicKey
        filename: @fileName
        size: @fileSize
        content_type: @fileType
        part_size: @settings.multipartPartSize
        UPLOADCARE_STORE: if @settings.doNotStore then '' else 'auto'

      @__autoAbort utils.jsonp(
         "#{@settings.urlBase}/multipart/start/?jsonerrors=1", 'POST', data
        ).fail (reason) =>
          if @settings.debugUploads
            utils.log("Can't start multipart upload.", reason, data)

    uploadParts: (parts, uuid) ->
      progress = []
      lastUpdate = $.now()
      updateProgress = (i, loaded) =>
        progress[i] = loaded

        if $.now() - lastUpdate < 250
          return
        lastUpdate = $.now()

        total = 0
        for loaded in progress
          total += loaded
        df.notify(total / @fileSize)

      df = $.Deferred()

      inProgress = 0
      submittedParts = 0
      submittedBytes = 0
      submit = =>
        if submittedBytes >= @fileSize
          return

        bytesToSubmit = submittedBytes + @settings.multipartPartSize
        if @fileSize < bytesToSubmit + @settings.multipartMinLastPartSize
          bytesToSubmit = @fileSize

        blob = @__file.slice(submittedBytes, bytesToSubmit)
        submittedBytes = bytesToSubmit
        partNo = submittedParts
        inProgress += 1
        submittedParts += 1

        attempts = 0
        do retry = =>
          if @apiDeferred.state() != 'pending'
            return

          progress[partNo] = 0

          @__autoAbort($.ajax(
            xhr: =>
              # Naked XHR for progress tracking
              xhr = $.ajaxSettings.xhr()
              if xhr.upload
                xhr.upload.addEventListener 'progress', (e) =>
                  updateProgress(partNo, e.loaded)
                , false
              xhr
            url: parts[partNo]
            crossDomain: true
            type: 'PUT'
            processData: false
            contentType: @fileType
            data: blob
            error: =>
              attempts += 1
              if attempts > @settings.multipartMaxAttempts
                if @settings.debugUploads
                  utils.info("Part ##{partNo} and file upload is failed.", uuid)
                df.reject()
              else
                if @settings.debugUploads
                  utils.debug("Part ##{partNo}(#{attempts}) upload is failed.", uuid)
                retry()

            success: ->
              inProgress -= 1
              submit()
              if not inProgress
                df.resolve()
          ))

      for i in [0...@settings.multipartConcurrency]
        submit()
      df

    multipartComplete: (uuid) ->
      data =
        UPLOADCARE_PUB_KEY: @settings.publicKey
        uuid: uuid

      @__autoAbort utils.jsonp(
          "#{@settings.urlBase}/multipart/complete/?jsonerrors=1", "POST", data
        ).fail (reason) =>
          if @settings.debugUploads
            utils.log("Can't complete multipart upload.",
                      uuid, @settings.publicKey, reason)
