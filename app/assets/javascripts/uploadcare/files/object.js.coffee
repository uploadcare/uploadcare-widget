{
  namespace,
  jQuery: $,
  utils
} = uploadcare

namespace 'uploadcare.files', (ns) ->

  class ns.ObjectFile extends ns.BaseFile
    MP_MIN_SIZE: 25 * 1024 * 1024
    MP_PART_SIZE: 5 * 1024 * 1024
    MP_MIN_LAST_PART_SIZE: 1 * 1024 * 1024
    MP_CONCURRENCY: 4
    MP_MAX_ATTEMPTS: 3

    constructor: (settings, @__file) ->
      super

      @fileSize = @__file.size
      @fileName = @__file.name or 'original'
      @fileType = @__file.type or 'application/octet-stream'
      @__notifyApi()

    __startUpload: ->
      if @fileSize >= @MP_MIN_SIZE and utils.abilities.blob
        @multipartUpload()
      else
        @directUpload()

    __autoAbort: (xhr) ->
      @apiDeferred.fail(xhr.abort)
      xhr

    directUpload: ->
      if @fileSize > 100 * 1024 * 1024
        @__rejectApi 'size'
        return

      df = $.Deferred()

      formData = new FormData()
      formData.append('UPLOADCARE_PUB_KEY', @settings.publicKey)
      if @settings.autostore
        formData.append('UPLOADCARE_STORE', '1')
      formData.append('file', @__file, @fileName)
      formData.append('file_name', @fileName)

      @__autoAbort $.ajax
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
        xhrFields: {withCredentials: true}
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
            if @settings.autostore && /autostore/i.test(data.error.content)
              utils.commonWarning('autostore')
            df.reject()

      df

    multipartUpload: ->
      if @settings.imagesOnly
        @__rejectApi 'image'
        return

      df = $.Deferred()

      @multipartStart().done (data) =>
        @uploadParts(data.parts).done =>
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
      if @settings.autostore
        data.UPLOADCARE_STORE = '1'

      @__autoAbort utils.jsonp(
        "#{@settings.urlBase}/multipart/start/?jsonerrors=1", 'POST', data
      )

    uploadParts: (parts) ->
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

        bytesToSubmit = submittedBytes + @MP_PART_SIZE
        if @fileSize < bytesToSubmit + @MP_MIN_LAST_PART_SIZE
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

          attempts += 1
          if attempts > @MP_MAX_ATTEMPTS
            df.reject()
            return

          progress[partNo] = 0

          @__autoAbort $.ajax
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
            error: retry
            success: ->
              inProgress -= 1
              submit()
              if not inProgress
                df.resolve()

      for i in [0...@MP_CONCURRENCY]
        submit()
      df

    multipartComplete: (uuid) ->
      data =
        UPLOADCARE_PUB_KEY: @settings.publicKey
        uuid: uuid

      @__autoAbort utils.jsonp(
        "#{@settings.urlBase}/multipart/complete/?jsonerrors=1", "POST", data
      )
