{
  namespace,
  ui: {progress: {Circle}},
  jQuery: $
} = uploadcare

namespace 'uploadcare.widget.tabs', (ns) ->
  class ns.BasePreviewTab

    PREFIX = '@uploadcare-dialog-preview-'

    constructor: (@container, @tabButton, @dialogApi, @settings) ->
      @__initTabButtonCircle()

      notDisabled = ':not(.uploadcare-disabled-el)'
      @container.on('click', PREFIX + 'back' + notDisabled, =>
        @dialogApi.fileColl.clear())
      @container.on('click', PREFIX + 'done' + notDisabled, @dialogApi.done)

    __initTabButtonCircle: ->
      size = 28
      circleEl = $('<div>')
        .appendTo(@tabButton)
        .css(
          position: 'absolute'
          top: '50%'
          left: '50%'
          marginTop: size / -2
          marginLeft: size / -2
          width: size
          height: size
        )

      circleDf = $.Deferred()

      update = =>
        infos = @dialogApi.fileColl.lastProgresses()
        progress = 0
        for progressInfo in infos
          progress += (progressInfo?.progress or 0) / infos.length
        circleDf.notify {progress}

      @dialogApi.fileColl.onAnyProgress.add update
      @dialogApi.fileColl.onAdd.add update
      @dialogApi.fileColl.onRemove.add update

      circle = new Circle(circleEl).listen circleDf.promise(), 'progress'

      updateTheme = ->
        circle.setColorTheme(
          if tabActive
            'default'
          else 
            if buttonHovered
              'darkGrey'
            else
              'grey'
        )

      tabActive = false
      @dialogApi.onSwitched.add (_, switchedToMe) =>
        tabActive = switchedToMe
        updateTheme()

      buttonHovered = false
      @tabButton.hover ->
        buttonHovered = true
        updateTheme()
      , ->
        buttonHovered = false
        updateTheme()



