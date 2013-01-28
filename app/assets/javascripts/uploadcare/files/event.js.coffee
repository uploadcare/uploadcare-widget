uploadcare.whenReady ->
  {namespace, jQuery: $, utils} = uploadcare

  namespace 'uploadcare.files', (ns) ->
    class ns.EventFile extends ns.BaseFile

      constructor: (settings, @file) ->
        super

      __upload: ->
        targetUrl = "#{@settings.urlBase}/iframe/"

        @fileId = utils.uuid()
        @fileSize = @file.size
        @fileName = @file.name

        if @fileSize > (100*1024*1024)
          @__uploadDf.reject('default')
          return

        formData = new FormData()
        formData.append('UPLOADCARE_PUB_KEY', @settings.publicKey)
        formData.append('UPLOADCARE_FILE_ID', @fileId)

        formData.append('file', @file)

        # Naked XHR for progress tracking
        @xhr = new XMLHttpRequest()
        @xhr.open 'POST', targetUrl
        @xhr.withCredentials = true
        @xhr.setRequestHeader('X-PINGOTHER', 'pingpong')
        @xhr.addEventListener 'error timeout abort', => @__uploadDf.reject('default')
        @xhr.addEventListener 'load', => @__uploadDf.resolve()
        @xhr.addEventListener 'loadend', =>
          if @xhr? && !@xhr.status
            @__uploadDf.reject('default')
        @xhr.upload.addEventListener 'progress', =>
          @__loaded = event.loaded
          @fileSize = event.totalSize || event.total
          @__uploadDf.notify @fileSize / @__loaded

        @xhr.send formData

      __cancel: ->
        xhr = @xhr
        @xhr = null
        xhr.abort() # Correct order to avoid errors
