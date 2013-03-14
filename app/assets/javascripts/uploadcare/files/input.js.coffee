{
  namespace,
  jQuery: $,
  utils
} = uploadcare

namespace 'uploadcare.files', (ns) ->
  class ns.InputFile extends ns.BaseFile
    constructor: (settings, @__input) ->
      super
      @fileId = utils.uuid()
      @fileName = $(@__input).val().split('\\').pop()

    __startUpload: ->
      targetUrl = "#{@settings.urlBase}/iframe/"
      @__uploadDf.always => @__cleanUp()

      iframeId = "uploadcare-iframe-#{@fileId}"

      @__iframe = $('<iframe>')
        .attr({
          id: iframeId
          name: iframeId
        })
        .css('display', 'none')
        .appendTo('body')
        .on('load', => @__uploadDf.resolve(this))
        .on('error', => @__uploadDf.reject('upload', this))

      formParam = (name, value) ->
        $('<input>')
          .attr({
            type: 'hidden'
            name: name
          })
          .val(value)

      $(@__input).clone(true).insertBefore(@__input)

      $(@__input).attr 'name', 'file'

      @__iframeForm = $('<form>')
        .attr({
          method: 'POST'
          action: targetUrl
          enctype: 'multipart/form-data'
          target: iframeId
        })
        .append(formParam('UPLOADCARE_PUB_KEY', @settings.publicKey))
        .append(formParam('UPLOADCARE_FILE_ID', @fileId))
        .append(@__input)
        .css('display', 'none')
        .appendTo('body')
        .submit()

    __cleanUp: ->
      @__iframe?.off('load error').remove()
      @__iframeForm?.remove()
      @__iframe = null
      @__iframeForm = null
