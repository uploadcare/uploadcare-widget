{
  namespace,
  jQuery: $,
  utils
} = uploadcare

namespace 'uploadcare.files', (ns) ->

  class ns.EventFile extends ns.BaseFile
    constructor: (settings, @__file) ->
      super

      @fileId = utils.uuid()
      @fileSize = @__file.size
      @fileName = @__file.name
      @__notifyApi()

    __startUpload: ->
      targetUrl = "#{@settings.urlBase}/iframe/"

      if @fileSize > 100 * 1024 * 1024
        @__rejectApi('size')
        return

      formData = new FormData()
      formData.append('UPLOADCARE_PUB_KEY', @settings.publicKey)
      formData.append('UPLOADCARE_FILE_ID', @fileId)
      if @settings.autostore
        formData.append('UPLOADCARE_STORE', 1)
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
        url: "#{@settings.urlBase}/iframe/?jsonerrors=1"
        xhrFields: {withCredentials: true}
        headers: {'X-PINGOTHER': 'pingpong'}
        contentType: false # For correct boundary string
        processData: false
        data: formData
        dataType: 'json'
        error: @__uploadDf.reject
        success: (data) =>
          if data?.error
            if @settings.autostore && /autostore/i.test(data.error.content)
              utils.commonWarning('autostore')
            @__uploadDf.reject()
          else
            @__uploadDf.resolve()
