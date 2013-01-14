uploadcare.whenReady ->
  {namespace, jQuery: $, utils} = uploadcare

  namespace 'uploadcare.files', (ns) ->
    class ns.EventFile
      constructor: (@file) ->

      upload: (settings) ->
        settings = utils.buildSettings settings
        targetUrl = "#{settings.urlBase}/iframe/"

        @fileId = utils.uuid()
        @fileSize = @file.size
        @fileName = @file.name

        if @fileSize > (100*1024*1024)
          @__fail()
          return

        formData = new FormData()
        formData.append('UPLOADCARE_PUB_KEY', settings.publicKey)
        formData.append('UPLOADCARE_FILE_ID', @fileId)

        formData.append('file', @file)

        # Naked XHR for progress tracking
        @xhr = new XMLHttpRequest()
        @xhr.open 'POST', targetUrl
        @xhr.withCredentials = true
        @xhr.setRequestHeader('X-PINGOTHER', 'pingpong')
        @xhr.addEventListener 'error timeout abort', @__onError
        @xhr.addEventListener 'load', @__onLoad
        @xhr.addEventListener 'loadend', => @__fail() unless @xhr.status
        @xhr.upload.addEventListener 'progress', @__onProgress
        @xhr.send formData

      cancel: -> @__cleanUp()

      __cleanUp: ->
        @xhr?.abort()
        @xhr = null

      __fail: -> @__onError()

      __onError: => $(this).trigger('uploadcare.api.uploader.error')
      __onLoad: => $(this).trigger('uploadcare.api.uploader.load')
      __onProgress: (event) =>
        @loaded = event.loaded
        @fileSize = event.totalSize || event.total
        $(this).trigger('uploadcare.api.uploader.progress')
