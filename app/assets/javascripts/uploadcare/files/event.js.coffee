uploadcare.whenReady ->
  {namespace, jQuery: $, utils} = uploadcare

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

        # Naked XHR for progress tracking
        @__xhr = new XMLHttpRequest()
        @__xhr.open 'POST', targetUrl
        @__xhr.withCredentials = true
        @__xhr.setRequestHeader('X-PINGOTHER', 'pingpong')
        @__xhr.addEventListener 'error timeout abort', => @__uploadDf.reject('upload', this)
        @__xhr.addEventListener 'load', => @__uploadDf.resolve(this)
        @__xhr.addEventListener 'loadend', =>
          if @__xhr? && !@__xhr.status
            @__uploadDf.reject('upload', this)
        @__xhr.upload.addEventListener 'progress', =>
          @__loaded = event.loaded
          @fileSize = event.totalSize || event.total
          @__uploadDf.notify(@fileSize / @__loaded, this)

        @__xhr.send formData

        @__uploadDf.always =>
          xhr = @__xhr
          @__xhr = null
          xhr.abort() # Correct order to avoid errors
