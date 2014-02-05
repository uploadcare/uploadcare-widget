# = require uploadcare/ui/progress

{
  namespace,
  jQuery: $,
  utils,
  ui: {progress},
  locale: {t},
  templates: {tpl}
} = uploadcare

namespace 'uploadcare.widget', (ns) ->
  class ns.Template
    constructor: (@settings, @element)->
      @content = $(tpl('widget'))
      @element.after(@content)
      @circle = new progress.Circle(@content.find('@uploadcare-widget-status'))

      @statusText = @content.find('@uploadcare-widget-status-text')
      @buttonsContainer = @content.find('@uploadcare-widget-buttons')

      @dropArea = @content.find('@uploadcare-drop-area')

    addButton: (name, caption='') ->
      li = $ tpl('widget-button', {name, caption})
      @buttonsContainer.append(li)
      return li

    setStatus: (status) ->
      @content.attr('data-status', status)
      form = @element.closest('@uploadcare-upload-form')
      form.trigger("#{status}.uploadcare")

    reset: ->
      @circle.reset()
      @setStatus 'ready'
      @__file = null

    loaded: ->
      @setStatus 'loaded'
      @circle.reset true

    listen: (file) ->
      @__file = file
      @circle.listen file
      @setStatus 'started'
      file.progress (info) =>
        if file == @__file
          switch info.state
            when 'uploading' then @statusText.text(t('uploading'))
            when 'uploaded' then @statusText.text(t('loadingInfo'))

    error: (type) ->
      @statusText.text(t("errors.#{type || 'default'}"))
      @setStatus 'error'

    setFileInfo: (info) ->
      @statusText.html tpl('widget-file-name', info)
