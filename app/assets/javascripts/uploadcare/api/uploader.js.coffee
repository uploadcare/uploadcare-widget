uploadcare.whenReady ->
  {namespace, jQuery, utils} = uploadcare

  namespace 'uploadcare.api', (ns) ->
    class ns.Uploader
      constructor: (@settings) ->

      listener: (e) =>
        if utils.abilities.canFileAPI()
          file = e.dataTransfer.files[0] if e.type == 'drop'
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
        @fileName = if file.name.length > 16
          file.name.slice(0, 8) + '...' + file.name.slice(-8)
        else
          file.name

        formData = new FormData()
        formData.append('UPLOADCARE_PUB_KEY', @settings['public-key'])
        formData.append('UPLOADCARE_FILE_ID', @fileId)

        formData.append('file', file)

        # naked xhr for COPS

        @xhr = new XMLHttpRequest
        @xhr.open 'POST', "#{@settings['upload-url-base']}/iframe/"
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

      # I'm not sure we need remote file info, since we use XHR2 and local file info
      __getFileInfo: =>
        jQuery.ajax("#{@settings['upload-url-base']}/info/", 
          data: 
            fileId:  @fileId
            pub_key: @settings['public-key']
          dataType: 'jsonp'
        )