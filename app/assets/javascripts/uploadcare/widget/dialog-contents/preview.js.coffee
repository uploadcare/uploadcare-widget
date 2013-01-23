uploadcare.whenReady ->
  {
    namespace,
    utils,
    files,
    jQuery: $
  } = uploadcare

  {t} = uploadcare.locale
  {tpl} = uploadcare.templates

  namespace 'uploadcare.widget', (ns) ->

    ns.showPreviewDialog = (settings = {}, file, ___getNewFile) ->
      settings = utils.buildSettings settings
      $.Deferred( ->
        $.extend this, {settings, file, ___getNewFile}, previewMixin
        @__init()
      ).pipe(null, -> 'dialog was closed').promise()

    previewMixin =

      __init: ->
        @__setFile @file
      
      __render: (data) ->
        @container = $ tpl("dialog-preview-#{data.type}", data)
        @backButton = @container.find '@uploadcare-dialog-preview-back'
        @okButton = @container.find '@uploadcare-dialog-preview-ok'
        @__bind()

      __bind: ->
        @backButton.click => @__getNewFile()
        @okButton.click => @resolve()

      __getNewFile: ->
        @__detachFromFrame()
        @__setFile @___getNewFile()

      __setFile: (@file) ->
        @file.done (something) =>
          @__render @__extractData something
          ns.__dialogFrame.show this
        @file.fail => @reject()

      __extractData: (something) ->
        if $.isArray something
          something = something[0]

        url = name = null

        # FIXME: silly data type detection

        # uploadcare.files.UrlFile
        if something.url
          url = something.url
          name = null

        # uploadcare.files.EventFile
        if something.file
          name = something.file.name
          url = utils.createObjectUrl something.file

        # uploadcare.uploads.fileInfo response
        if something.fileId
          name = something.fileName
          url = "#{@settings.urlBase}/preview/?file_id=#{something.fileId}&pub_key=#{@settings.publicKey}"
          isImage = something.image

        if isImage == undefined
          isImage = utils.isImage(url) or utils.isImage(name)

        type = 'unknown'

        if isImage
          type = 'image'
          
        # if isImage and %crop%
        #   type = 'crop'

        return {url, name, isImage, type}

      el: ->
        @container

      closed: ->
        @reject()


