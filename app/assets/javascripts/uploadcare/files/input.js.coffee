uploadcare.whenReady ->
  {namespace, jQuery: $, utils} = uploadcare

  namespace 'uploadcare.files', (ns) ->
    class ns.InputFile
      constructor: (@input) ->

      upload: (settings) ->
        settings = utils.buildSettings settings
        targetUrl = "#{settings.urlBase}/iframe/"

        @fileId = utils.uuid()
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

      cancel: -> @__cleanUp()

      __cleanUp: ->
        @iframe?.off('load error').remove()
        @iframeForm?.remove()
        @iframe = null
        @iframeForm = null

      __onError: => $(this).trigger('uploadcare.api.uploader.error')
      __onLoad: => $(this).trigger('uploadcare.api.uploader.load')
