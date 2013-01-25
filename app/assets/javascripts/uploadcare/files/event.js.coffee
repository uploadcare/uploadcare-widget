uploadcare.whenReady ->
  {namespace, jQuery: $, utils} = uploadcare

  namespace 'uploadcare.files', (ns) ->
    class ns.EventFile
      constructor: (@file) ->

      upload: (settings) ->
        settings = utils.buildSettings settings
        targetUrl = "#{settings.urlBase}/iframe/"
        dfd = $.Deferred()

        @fileId = utils.uuid()
        @fileSize = @file.size
        @fileName = @file.name

        if @fileSize > (100*1024*1024)
          dfd.reject(this)
          return dfd.promise()

        formData = new FormData()
        formData.append('UPLOADCARE_PUB_KEY', settings.publicKey)
        formData.append('UPLOADCARE_FILE_ID', @fileId)

        formData.append('file', @file)

        # Naked XHR for progress tracking
        @xhr = new XMLHttpRequest()
        @xhr.open 'POST', targetUrl
        @xhr.withCredentials = true
        @xhr.setRequestHeader('X-PINGOTHER', 'pingpong')
        @xhr.addEventListener 'error timeout abort', => dfd.reject(this)
        @xhr.addEventListener 'load', => dfd.resolve(this)
        @xhr.addEventListener 'loadend', => dfd.reject(this) unless @xhr.status
        @xhr.upload.addEventListener 'progress', =>
          @loaded = event.loaded
          @fileSize = event.totalSize || event.total
          dfd.notify(this)

        @xhr.send formData
        dfd.promise()

      cancel: -> @__cleanUp()

      __cleanUp: ->
        @xhr?.abort()
        @xhr = null
