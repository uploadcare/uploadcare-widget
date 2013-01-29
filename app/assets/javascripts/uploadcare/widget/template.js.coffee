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
      constructor: (@settings, @element)->
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

      addButton: (name, caption) ->
        role = "uploadcare-widget-buttons-#{name}"
        li = $('<li>')
          .addClass(role)
          .attr('role', role)
        if caption?
          li.text(caption)
        @buttonsContainer.append(li)
        return li

      setStatus: (status) ->
        @content.attr('data-status', status)
        form = @element.closest('@uploadcare-upload-form')
        form.trigger("#{status}.uploadcare")

      reset: ->
        @statusText.text(t('ready'))
        @circle.reset()
        @setStatus 'ready'

      loaded: ->
        @setStatus 'loaded'
        @circle.reset true

      listen: (uploadDeferred) ->
        @circle.listen uploadDeferred

      error: (type='default') ->
        errorText = t("errors.#{type}") or t("errors.default")
        @statusText.text(errorText)
        @circle.reset()
        @setStatus 'error'

      started: ->
        @statusText.text(t('uploading'))
        @setStatus 'started'

      setFileInfo: (file) ->
        caption = utils.fitText(file.fileName, 16)
        size = file.fileSize

        if file.isStored
          href = "#{@settings.cdnBase}/#{file.fileId}/#{file.fileName}"
          caption = "<a href='#{href}' target='_blank'>#{caption}</a>"

        size = Math.ceil(size / 1024).toString()
        @statusText.html "#{caption}, #{size} kb"
