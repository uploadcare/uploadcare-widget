# = require uploadcare/ui/progress

uploadcare.whenReady ->
  {
    namespace,
    jQuery: $,
    utils,
    ui: {progress},
  } = uploadcare

  {t} = uploadcare.locale
  {tpl} = uploadcare.templates

  namespace 'uploadcare.widget', (ns) ->
    class ns.Template
      constructor: (@element)->
        @content = $(tpl('widget'))
        @content.css('display', 'none')
        @element.after(@content)
        @circle = new progress.Circle(@content.find('@uploadcare-widget-status'))

        @statusText = @content.find('@uploadcare-widget-status-text')
        @buttonsContainer = @content.find('@uploadcare-widget-buttons')

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

      addButton: (name, captioned = false) ->
        role = "uploadcare-widget-buttons-#{name}"
        li = $('<li>')
          .addClass(role)
          .attr('role', role)
        if captioned
          li.text(t("buttons.#{name}"))
        @buttonsContainer.append(li)
        return li

      setStatus: (status) ->
        @content.attr('data-status', status)
        form = @element.closest('@uploadcare-upload-form')
        form.trigger("uploadcare.uploader.#{status}")
        @element.trigger("uploadcare.uploader.#{status}")

      reset: ->
        @statusText.text(t('ready'))
        @circle.reset()
        @setStatus 'ready'

      loaded: ->
        @setStatus 'loaded'

      listen: (uploadDeferred) ->
        @circle.listen uploadDeferred

      error: (type) ->
        @statusText.text(t("errors.#{type || 'default'}"))
        @circle.reset()
        @setStatus 'error'

      started: ->
        @statusText.text(t('uploading'))
        @setStatus 'started'

      setFileInfo: (infos...) ->
        if infos.length > 1
          caption = t('file', infos.length)
          size = 0
          size += info.fileSize for info in infos
        else
          caption = utils.fitText(infos[0].fileName, 16)
          size = infos[0].fileSize
        size = Math.ceil(size / 1024).toString()
        @statusText.text("#{caption}, #{size} kb")
