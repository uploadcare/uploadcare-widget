{
  jQuery: $,
  utils
} = uploadcare

uploadcare.namespace 'files', (ns) ->
  class ns.InputFile extends ns.BaseFile
    sourceName: 'local-compat'

    constructor: (settings, @__input) ->
      super
      @fileId = utils.uuid()
      @fileName = $(@__input).val().split('\\').pop()
      @__notifyApi()

    __startUpload: ->
      df = $.Deferred()
      targetUrl = "#{@settings.urlBase}/iframe/"
      iframeId = "uploadcare-iframe-#{@fileId}"

      @__iframe = $('<iframe>')
        .attr({
          id: iframeId
          name: iframeId
        })
        .css('display', 'none')
        .appendTo('body')
        .on('load', df.resolve)
        .on('error', df.reject)

      formParam = (name, value) ->
        $('<input/>',
          type: 'hidden'
          name: name
          value: value
        )

      $(@__input).attr('name', 'file')

      @__iframeForm = $('<form>')
        .attr({
          method: 'POST'
          action: targetUrl
          enctype: 'multipart/form-data'
          target: iframeId
        })
        .append(formParam('UPLOADCARE_PUB_KEY', @settings.publicKey))
        .append(formParam('UPLOADCARE_FILE_ID', @fileId))
        .append(formParam('UPLOADCARE_STORE', if @settings.doNotStore then '' else 'auto'))
        .append(@__input)
        .css('display', 'none')
        .appendTo('body')
        .submit()

      df.always(@__cleanUp)

    __cleanUp: =>
      @__iframe?.off('load error').remove()
      @__iframeForm?.remove()
      @__iframe = null
      @__iframeForm = null
