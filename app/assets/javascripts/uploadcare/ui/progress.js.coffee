{
  namespace,
  files,
  jQuery: $,
  utils: {abilities}
} = uploadcare

{tpl} = uploadcare.templates

namespace 'uploadcare.ui.progress', (ns) ->

  class ns.Circle

    constructor: (element) ->
      if abilities.canvas
        @renderer = new ns.CanvasRenderer element
      else
        @renderer = new ns.TextRenderer element
      @observed = null

    listen: (file, selector = 'uploadProgress') ->
      @reset()
      selectorFn = if selector?
        (info) -> info[selector]
      else
        (x) -> x

      @observed = file

      if @observed.state() is "resolved"
        @renderer.setValue 1, true
      else
        @observed
          .progress (progress) =>
            # if we are still listening to this one
            if file == @observed
              @renderer.setValue selectorFn(progress)

          .always (uploadedFile) =>
            if file == @observed
              @renderer.setValue 1, false
      @

    reset: (filled = false) ->
      @observed = null
      @renderer.setValue (if filled then 1 else 0), true

    setColorTheme: (theme) ->
      @renderer.setColorTheme theme




  class ns.BaseRenderer
    constructor: (el) ->
      @element = $(el)
      @element.data 'uploadcare-progress-renderer', this
      @element.addClass 'uploadcare-widget-circle'
      @size = Math.min(@element.width(), @element.height())

    setColorTheme: (theme) ->
      if $.type(theme) is 'string'
        theme = @colorThemes[theme]
      @colorTheme = $.extend {}, @colorThemes.default, theme

    setValue: (value, instant=false) ->
      throw new Error 'not implemented'

    colorThemes:
      default:
        back: '#e1e5e7'
        front: '#d0bf26'
        center: '#ffffff'
      grey:
        back: '#c5cacd'
        front: '#a0a3a5'
      darkGrey:
        back: '#bfbfbf'
        front: '#8c8c8c'


  class ns.TextRenderer extends ns.BaseRenderer
    constructor: ->
      super

      $.extend true, @colorThemes, {
        default:
          front: '#000'
        grey:
          front: '#888'
        darkGrey:
          front: '#555'
      }

      @element.addClass 'uploadcare-widget-circle--text'
      @element.html(tpl('circle-text'))
      @background = @element.find('@uploadcare-circle-back')
      @text = @element.find('@uploadcare-circle-text')
      @setColorTheme 'default'


    setColorTheme: (theme) ->
      super
      @background.css 'background', @colorTheme.back
      @text.css 'color', @colorTheme.front

    setValue: (val) ->
      val = Math.round(val * 100)
      @text.html "#{val} %"


  class ns.CanvasRenderer extends ns.BaseRenderer

    constructor: ->
      super

      @canvasSize = @size * 2

      @setColorTheme 'default'
      @setValue 0, true

      @canvasEl = $('<canvas>')
                  .css(width: @size, height: @size)
                  .prop(width: @canvasSize, height: @canvasSize)
      @canvasCtx = @canvasEl.get(0).getContext '2d'

      @element.addClass 'uploadcare-widget-circle--canvas'
      @element.html(@canvasEl)

      @__reRender()

    setColorTheme: (theme) ->
      super
      @__reRender()

    __reRender: ->
      if @canvasCtx
        ctx = @canvasCtx
        halfSize = @canvasSize/2

        # Clear
        ctx.clearRect 0, 0, @canvasSize, @canvasSize

        # Background circle
        ctx.fillStyle = @colorTheme.back
        ctx.beginPath()
        ctx.arc(halfSize, halfSize, halfSize, 0, 2*Math.PI)
        ctx.fill()

        # Progress circle
        offset = -Math.PI / 2
        ctx.fillStyle = @colorTheme.front
        ctx.beginPath()
        ctx.moveTo(halfSize, halfSize)
        ctx.arc(halfSize, halfSize, halfSize, offset, 2*Math.PI * @val + offset)
        ctx.fill()

        # Center circle
        ctx.fillStyle = @colorTheme.center
        ctx.beginPath()
        ctx.arc(halfSize, halfSize, @canvasSize/15, 0, 2*Math.PI)
        ctx.fill()

    __animateValue: (targetValue) ->
      perStep = if targetValue > @val then 0.05 else -0.05
      @__animIntervalId = setInterval =>
        # TODO: rewrite with timers, not perStep
        newValue = @val + perStep
        if (perStep > 0 and newValue > targetValue) or (perStep < 0 and newValue < targetValue)
          newValue = targetValue
        if newValue == targetValue
          @__stopAnimation()
        @__setValue newValue
      , 25

    __stopAnimation: ->
      if @__animIntervalId
        clearInterval @__animIntervalId
        @__animIntervalId = null

    __setValue: (val) ->
      @val = val
      @__reRender()

    setValue: (val, instant = false) ->
      @__stopAnimation()
      if instant
        @__setValue(val)
      else
        @__animateValue(val)
