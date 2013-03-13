# = require uploadcare/ui/progress

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

    addButton: (name, caption='') ->
      li = $ tpl('widget-button', {name, caption})
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

    error: (type) ->
      @statusText.text(t("errors.#{type || 'default'}"))
      @circle.reset()
      @setStatus 'error'

    started: ->
      @statusText.text(t('uploading'))
      @setStatus 'started'

    setFileInfo: (file) ->
      name = utils.fitText(file.fileName, 16)
      size = Math.ceil(file.fileSize / 1024).toString()
      @statusText.html tpl('widget-file-name', {name, size})
