uploadcare.whenReady ->
  {namespace, jQuery: $, utils} = uploadcare

  namespace 'uploadcare.files', (ns) ->
    class ns.EventFile
      constructor: (@e) ->

      upload: (settings) ->
        settings = utils.buildSettings settings

        targetUrl = "#{settings.urlBase}/iframe/"

        @fileId = utils.uuid()
        if utils.abilities.canFileAPI()
          file = @e.originalEvent.dataTransfer.files[0] if @e.type == 'drop'
          file = @e.target.files[0] if @e.type == 'change'
          @__uploadFile(settings, targetUrl, file)
        else
          @__uploadInput(settings, targetUrl, @e.target)

      cancel: ->
        @xhr.abort() if @xhr?
        @iframe.off('load error') if @iframe?
        @__cleanUp()

      __uploadFile: (settings, targetUrl, file) ->
        @fileSize = file.size
        @fileName = file.name

        if @fileSize > (100*1024*1024)
          @__fail()
          return

        formData = new FormData()
        formData.append('UPLOADCARE_PUB_KEY', settings.publicKey)
        formData.append('UPLOADCARE_FILE_ID', @fileId)

        formData.append('file', file)

        # naked XHR for CORS
        @xhr = new XMLHttpRequest()
        @xhr.open 'POST', targetUrl
        @xhr.setRequestHeader('X-PINGOTHER', 'pingpong')
        @xhr.addEventListener 'error timeout abort', @__onError
        @xhr.addEventListener 'loadstart', @__onStart
        @xhr.addEventListener 'load', @__onLoad
        @xhr.addEventListener 'loadend', => @__fail() unless @xhr.status
        @xhr.upload.addEventListener 'progress', @__onProgress
        @xhr.send formData

      __uploadInput: (settings, targetUrl, input) ->
        @fileSize = null
        @fileName = null
        iframeId = "uploadcare-iframe-#{@fileId}"

        @iframe = $('<iframe>')
          .attr({
            id: iframeId
            name: iframeId
          })
          .css('display', 'none')
          .appendTo('body')
          .on('load', (e) => @__onLoad(); @__cleanUp())
          .on('error', => @__onError(); @__cleanUp())

        formParam = (name, value) ->
          $('<input>')
            .attr({
              type: 'hidden'
              name: name
            })
            .val(value)

        $(input).clone(true).insertBefore(input)

        @iframeForm = $('<form>')
          .attr({
            method: 'POST'
            action: targetUrl
            enctype: 'multipart/form-data'
            target: iframeId
          })
          .append(formParam('UPLOADCARE_PUB_KEY', settings.publicKey))
          .append(formParam('UPLOADCARE_FILE_ID', @fileId))
          .append(input)
          .css('display', 'none')
          .appendTo('body')
          .on('submit', @__onStart)
          .submit()

      __cleanUp: ->
        @iframe.remove() if @iframe?
        @iframeForm.remove() if @iframeForm?
        @xhr = null
        @iframe = null
        @iframeForm = null

      __fail: -> @__onError()

      __onError: => $(this).trigger('uploadcare.api.uploader.error')
      __onStart: => $(this).trigger('uploadcare.api.uploader.start')
      __onLoad: => $(this).trigger('uploadcare.api.uploader.load')
      __onProgress: (event) =>
        @loaded = event.loaded
        $(this).trigger('uploadcare.api.uploader.progress')
