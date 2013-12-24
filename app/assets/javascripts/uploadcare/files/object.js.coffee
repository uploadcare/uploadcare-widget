{
  namespace,
  jQuery: $,
  utils
} = uploadcare

namespace 'uploadcare.files', (ns) ->

  class ns.ObjectFile extends ns.BaseFile
    MP_MIN_SIZE: 25 * 1024 * 1024
    MP_CONCURRENCY: 4

    constructor: (settings, @__file) ->
      super

      @fileSize = @__file.size
      @fileName = @__file.name or 'original'
      @__notifyApi()

    __startUpload: ->
      if @fileSize > @MP_MIN_SIZE
        @__multipartUpload()
      else
        @__directUpload()

    __directUpload: ->
      formData = new FormData()
      formData.append('UPLOADCARE_PUB_KEY', @settings.publicKey)
      if @settings.autostore
        formData.append('UPLOADCARE_STORE', '1')
      formData.append('file', @__file)

      # jQuery Ajax wrapper for JSON and stuff
      $.ajax
        # Provide our XHR to jQuery
        xhr: =>
          # Naked XHR for progress tracking
          xhr = $.ajaxSettings.xhr()
          if xhr.upload
            xhr.upload.addEventListener 'progress', (e) =>
              @fileSize = e.totalSize || e.total
              @__uploadDf.notify(e.loaded / @fileSize)
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
        error: @__uploadDf.reject
        success: (data) =>
          if data?.file
            @fileId = data.file
            @__uploadDf.resolve()
          else
            if @settings.autostore && /autostore/i.test(data.error.content)
              utils.commonWarning('autostore')
            @__uploadDf.reject()

    __multipartUpload: ->
      @__multipartStart().done (data) =>
        @__uploadParts(data.parts).done =>
          @__multipartComplete(data.uuid).done (data) =>
            console.log data

    __multipartStart: ->
      data =
        UPLOADCARE_PUB_KEY: @settings.publicKey
        filename: @fileName
        size: @fileSize
        content_type: @__file.type or 'application/octet-stream'
      if @settings.autostore
        data.UPLOADCARE_STORE = '1'

      utils.jsonp(
        "#{@settings.urlBase}/multipart/start/?jsonerrors=1", 'POST', data
      )

    __uploadParts: (parts) ->
      blobSize = Math.ceil(@__file.size / @MP_CONCURRENCY)
      blobOffset = 0
      requests =
        for i in [0...@MP_CONCURRENCY]
          blob = @__file.slice(blobOffset, blobOffset + blobSize)
          blobOffset += blobSize
          $.ajax
            url: parts[i]
            crossDomain: true
            type: 'PUT'
            processData: false
            contentType: false
            data: blob
      $.when.apply(null, requests)

    __multipartComplete: (uuid) ->
      data =
        UPLOADCARE_PUB_KEY: @settings.publicKey
        uuid: uuid
      utils.jsonp(
        "#{@settings.urlBase}/multipart/complete/?jsonerrors=1", "POST", data
      )
