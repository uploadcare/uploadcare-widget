uploadcare.whenReady ->
  {namespace, jQuery, utils} = uploadcare

  namespace 'uploadcare.widget.uploaders', (ns) ->
    class ns.FileUploader extends ns.BaseUploader
      @registerAs 'file'
      constructor: (@settings) -> super

      listener: (e) =>
        e.preventDefault() if e.type == 'drop'

        if utils.abilities.canFileAPI()
          file = e.originalEvent.dataTransfer.files[0] if e.type == 'drop'
          file = e.target.files[0] if e.type == 'change'
          @__uploadFile(file)
        else
          @__uploadInput(e.target)

      cancel: ->
        @xhr.abort() if @xhr?

      __constructUuid: ->
        @fileId = utils.uuid()

      __uploadFile: (file) ->
        @__constructUuid()
        @fileSize = file.size
        @fileName = file.name

        formData = new FormData()
        formData.append('UPLOADCARE_PUB_KEY', @settings.publicKey)
        formData.append('UPLOADCARE_FILE_ID', @fileId)

        formData.append('file', file)

        # naked XHR for CORS
        @xhr = new XMLHttpRequest()
        @xhr.open 'POST', "#{@settings.urlBase}/iframe/"
        @xhr.setRequestHeader('X-PINGOTHER', 'pingpong')
        @xhr.addEventListener 'error timeout abort', @__onError
        @xhr.addEventListener 'loadstart', @__onStart
        @xhr.addEventListener 'load', @__onLoad
        @xhr.upload.addEventListener 'progress', @__onProgress

        @xhr.send formData

      __uploadInput: (input) ->
      __uploadUrl: (url) ->

      __onError: (event) => jQuery(this).trigger('uploadcare.api.uploader.error')
      __onStart: (event) => jQuery(this).trigger('uploadcare.api.uploader.start')
      __onLoad: (event) => jQuery(this).trigger('uploadcare.api.uploader.load')
      __onProgress: (event) =>
        @loaded = event.loaded
        jQuery(this).trigger('uploadcare.api.uploader.progress')
