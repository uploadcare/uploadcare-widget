uploadcare.whenReady ->
  {namespace, jQuery: $, utils} = uploadcare

  namespace 'uploadcare.files', (ns) ->

    class ns.EventFile extends ns.BaseFile
      constructor: (settings, @__file) ->
        super

      __startUpload: ->
        @fileId = utils.uuid()
        @fileSize = @__file.size
        @fileName = @__file.name

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
        xhr.open('POST', "#{@settings.urlBase}/iframe/?jsonerrors=1", true)
        xhr.withCredentials = true
        xhr.setRequestHeader('X-PINGOTHER', 'pingpong')
        xhr.addEventListener('error', fail)
        xhr.addEventListener('abort', fail)
        xhr.addEventListener 'load', =>
          @__uploadDf.resolve(this)
        xhr.addEventListener 'loadend', =>
          fail() if xhr? && !xhr.status
        xhr.upload.addEventListener 'progress', =>
          @__loaded = event.loaded
          @fileSize = event.totalSize || event.total
          @__uploadDf.notify(@fileSize / @__loaded, this)

        xhr.send formData

        @__uploadDf.always =>
          _xhr = xhr
          xhr = null
          _xhr.abort() # Correct order to avoid errors
