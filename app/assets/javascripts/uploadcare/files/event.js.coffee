{
  namespace,
  jQuery: $,
  utils,
  debug
} = uploadcare

namespace 'uploadcare.files', (ns) ->

  class ns.EventFile extends ns.BaseFile
    constructor: (settings, @__file) ->
      super

      @fileId = utils.uuid()
      @fileSize = @__file.size
      @fileName = @__file.name
      @previewUrl = utils.createObjectUrl @__file

    __startUpload: ->
      targetUrl = "#{@settings.urlBase}/iframe/"

      if @fileSize > (100*1024*1024)
        @__uploadDf.reject('size', this)
        return

      formData = new FormData()
      formData.append('UPLOADCARE_PUB_KEY', @settings.publicKey)
      formData.append('UPLOADCARE_FILE_ID', @fileId)
      formData.append('file', @__file)

      fail = =>
        @__uploadDf.reject('upload', this)

      # Naked XHR for progress tracking
      xhr = new XMLHttpRequest()
      xhr.addEventListener 'loadend', =>
        fail() if xhr? && !xhr.status
      xhr.upload.addEventListener 'progress', =>
        @__loaded = event.loaded
        @fileSize = event.totalSize || event.total
        @__uploadDf.notify(@fileSize / @__loaded, this)

      # jQuery Ajax wrapper for JSON and stuff
      $.ajax
        xhr: -> xhr # Provide our XHR to jQuery
        crossDomain: true
        type: 'POST'
        url: "#{@settings.urlBase}/iframe/?jsonerrors=1"
        xhrFields: {withCredentials: true}
        headers: {'X-PINGOTHER': 'pingpong'}
        contentType: false # For correct boundary string
        processData: false
        data: formData
        dataType: 'json'
        error: fail
        success: (data) =>
          if data?.error
            debug(data.error.content)
            return fail()
          @__uploadDf.resolve(this)

      @__uploadDf.always =>
        _xhr = xhr
        xhr = null
        _xhr.abort() # Correct order to avoid errors
