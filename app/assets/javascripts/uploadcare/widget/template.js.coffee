# = require ./templates/widget
# = require uploadcare/progress

uploadcare.whenReady ->
  {
    namespace,
    jQuery: $,
    utils,
    progress
  } = uploadcare

  {t} = uploadcare.locale

  namespace 'uploadcare.widget', (ns) ->
    class ns.Template
      constructor: (@element)->
        @content = $(JST['uploadcare/widget/templates/widget']())
        @content.css('display', 'none')
        @element.after(@content)
        @circle = new progress.Circle(@content.find('@uploadcare-widget-status'))

        @statusText = @content.find('@uploadcare-widget-status-text')
        @buttonsContainer = @content.find('@uploadcare-widget-buttons')
        @cancelButton = @buttonsContainer.find('@uploadcare-widget-buttons-cancel')
        @removeButton = @buttonsContainer.find('@uploadcare-widget-buttons-remove')

        @cancelButton.text(t('buttons.cancel'))
        @removeButton.text(t('buttons.remove'))

        @cancelButton.on 'click', => $(this).trigger('uploadcare.widget.template.cancel')
        @removeButton.on 'click', => $(this).trigger('uploadcare.widget.template.remove')

        @dropArea = @content.find('@uploadcare-drop-area')

        @labels = []

      pushLabel: (label) ->
        @labels.push @statusText.text()
        @statusText.text(label)

      popLabel: ->
        @statusText.text(@labels.pop())

      addState: (state) ->
        @content.addClass("uploadcare-widget-state-#{state}")

      removeState: (state) ->
        @content.removeClass("uploadcare-widget-state-#{state}")

      addButton: (name) ->
        li = $('<li>').addClass("uploadcare-widget-buttons-#{name}")
        @buttonsContainer.find('@uploadcare-widget-buttons-cancel').before(li)
        return li

      setStatus: (status) ->
        @content.attr('data-status', status)
        form = @element.closest('@uploadcare-upload-form')
        form.trigger("uploadcare.uploader.#{status}")
        @element.trigger("uploadcare.uploader.#{status}")

      ready: ->
        @statusText.text(t('ready'))
        @circle.reset()
        @setStatus 'ready'

      loaded: ->
        @setStatus 'loaded'

      listen: (uploadDeferred) ->
        @circle.listen uploadDeferred

      error: ->
        @statusText.text(t('error'))
        @setStatus 'error'

      started: ->
        @statusText.text(t('uploading'))
        @setStatus 'started'

      setFileInfo: (fileName, fileSize) ->
        fileSize = Math.ceil(fileSize/1024).toString()
        @statusText.text("#{utils.fitText(fileName)}, #{fileSize} kb")



