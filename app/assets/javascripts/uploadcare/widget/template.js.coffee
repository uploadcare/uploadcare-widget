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

  keyClickable = (el) ->
    el.on 'click', ->
        this.blur()
      .on 'keypress', (e) ->
        # 13 = Return, 32 = Space
        if e.which == 13 or e.which == 32
          $(this).click()

  class ns.Template
    constructor: (@settings, @element)->
      @content = $(tpl('widget'))
      @element.after(@content)
      @circle = new progress.Circle(@content.find('@uploadcare-widget-status'))
      @statusText = @content.find('@uploadcare-widget-text')

    addButton: (name, caption='') ->
      keyClickable(
        $(tpl('widget-button', {name, caption}))
          .appendTo(@content)
      )


    setStatus: (status) ->
      prefix = 'uploadcare-widget-status-'
      @content.removeClass(prefix + @content.attr('data-status'))
      @content.attr('data-status', status)
      @content.addClass(prefix + status)

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
      @circle.listen(file, 'uploadProgress')
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
      name = @statusText.html(tpl('widget-file-name', info))
        .find('.uploadcare-widget-file-name')
      keyClickable(
        name.toggleClass('needsclick', @settings.systemDialog)
      )
