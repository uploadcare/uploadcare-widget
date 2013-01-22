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

    ns.showPreview = (settings = {}, file, ___getNewFile) ->
      settings = utils.buildSettings settings
      $.Deferred( ->
        $.extend this, {settings, file, ___getNewFile}, previewMixin
        @__init()
      ).pipe(null, -> 'dialog was closed').promise()

    previewMixin =

      __init: ->
        @__setFile @file
      
      __render: ->
        @container = $ tpl 'dialog-preview'
        @backButton = @container.find '@uploadcare-dialog-preview-back'
        @okButton = @container.find '@uploadcare-dialog-preview-ok'

      __bind: ->
        @backButton.click => @__getNewFile()
        @okButton.click => @resolve()

      __getNewFile: ->
        @__detachFromFrame()
        @__setFile @___getNewFile()

      __setFile: (@file) ->
        @file.done (fileInfo) =>
          ns.__dialogFrame.show this

      el: ->
        unless @container
          @__render()
          @__bind()
        @container

      closed: ->
        @reject()


