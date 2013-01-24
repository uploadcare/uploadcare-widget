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

    ns.showPreviewDialog = (settings = {}, step1Pr, ___getNewStep1Pr) ->
      settings = utils.buildSettings settings
      $.Deferred( ->
        $.extend this, {settings, step1Pr, ___getNewStep1Pr}, previewMixin
        @__init()
      ).pipe(null, -> 'dialog was closed').promise()

    previewMixin =

      __init: ->
        @__baseRender()
        @__setStep1Pr @step1Pr
      
      __render: (data) ->
        el = $ tpl("dialog-preview-#{data.type}", data)
        @backButton = el.find '@uploadcare-dialog-preview-back'
        @okButton = el.find '@uploadcare-dialog-preview-ok'
        @imageEl = el.find '@uploadcare-dialog-preview-image'
        @container.empty().append el
        @__bind()

      __baseRender: ->
        @container = $ '<div>'

      __bind: ->
        @backButton.click => @__getNewFile()
        @okButton.click => @resolve()

      #    |         |
      #    v         v
      # loading -> loaded
      #    |         v
      #     -----> error
      __setState: (state) ->
        # TODO

      __getNewFile: ->
        @__detachFromFrame()
        @__setStep1Pr @___getNewStep1Pr()

      __setStep1Pr: (@step1Pr) ->

        @step1Pr.done (data) =>
          {fileInfo: something, rescueFileInfo} = data
          rescueFileInfo.fail ->
            # It means uploading failed
            @__setState 'error'
          useRescue = =>
            @__setState 'loading'
            rescueFileInfo.done (something) =>
              renderData = @__extractData something
              if renderData
                @__setState 'loaded'
                @__render renderData
              else
                @__setState 'error'
          renderData = @__extractData something
          if renderData
            @__setState 'loaded'
            @__render renderData
            if renderData.type == 'image'
              @imageEl.on 'error', useRescue
          else
            useRescue()

          ns.__dialogFrame.show this
        @step1Pr.fail => @reject()

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
        else if something.file
          name = something.file.name
          url = utils.createObjectUrl something.file
          unless url
            return null

        # uploadcare.uploads.fileInfo response
        else if something.fileId
          name = something.fileName
          url = "#{@settings.urlBase}/preview/?file_id=#{something.fileId}&pub_key=#{@settings.publicKey}"
          isImage = something.image

        else
          return null

        if isImage == undefined
          isImage = utils.isImage(url) or utils.isImage(name)

        type =  if isImage then 'image' else 'unknown'
          
        return {url, name, type}

      el: ->
        @container

      closed: ->
        @reject()


