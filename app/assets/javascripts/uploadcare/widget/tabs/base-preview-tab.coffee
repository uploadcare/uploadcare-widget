{
  ui: {progress: {Circle}},
  jQuery: $
} = uploadcare

uploadcare.namespace 'widget.tabs', (ns) ->
  class ns.BasePreviewTab

    PREFIX = '.uploadcare-dialog-preview-'

    constructor: (@container, @tabButton, @dialogApi, @settings, @name) ->
      @__initTabButtonCircle()

      notDisabled = ':not(.uploadcare-disabled-el)'
      @container.on 'click', PREFIX + 'back' + notDisabled, =>
        @dialogApi.fileColl.clear()
      @container.on('click', PREFIX + 'done' + notDisabled, @dialogApi.resolve)

    __initTabButtonCircle: ->
      circleEl = $('<div class="uploadcare-dialog-icon">')
        .appendTo(@tabButton)

      circleDf = $.Deferred()

      update = =>
        infos = @dialogApi.fileColl.lastProgresses()
        progress = 0
        for progressInfo in infos
          progress += (progressInfo?.progress or 0) / infos.length
        circleDf.notify(progress)

      @dialogApi.fileColl.onAnyProgress(update)
      @dialogApi.fileColl.onAdd.add(update)
      @dialogApi.fileColl.onRemove.add(update)
      update()

      circle = new Circle(circleEl).listen(circleDf.promise())

      @dialogApi.progress(circle.update)
