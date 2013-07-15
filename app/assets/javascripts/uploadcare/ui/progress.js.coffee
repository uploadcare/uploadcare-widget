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
      @element = $ el
      @element.data 'uploadcare-progress-renderer', this
      @element.addClass 'uploadcare-widget-circle'
      @size = Math.min(@element.width(), @element.height())
    setColorTheme: (theme) ->
      if $.type(theme) is 'string'
        theme = @colorThemes[theme]
      @colorTheme = $.extend {}, @colorThemes.default, theme
    setValue: (value, instant=false) -> throw new Error 'not implemented'
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

      @element.addClass 'uploadcare-widget-circle--canvas'
      @element.html(tpl('circle-canvas'))

      @setColorTheme 'default'
      @setValue 0, true

      @canvasEl = @element.find('canvas').get(0)
      @canvasEl.width = @size
      @canvasEl.height = @size
      @canvasCtx = @canvasEl.getContext '2d'

      @__reRender()

    setColorTheme: (theme) ->
      super
      @__reRender()

    __reRender: ->
      if @canvasCtx
        ctx = @canvasCtx

        # Clear
        ctx.clearRect 0, 0, @size, @size

        # Background circle
        ctx.fillStyle = @colorTheme.back
        ctx.beginPath()
        ctx.arc(@size/2, @size/2, @size/2, 0, 2*Math.PI)
        ctx.fill()

        # Progress circle
        offset = -Math.PI / 2
        ctx.fillStyle = @colorTheme.front
        ctx.beginPath()
        ctx.moveTo(@size/2, @size/2)
        ctx.arc(@size/2, @size/2, @size/2, offset, 2*Math.PI * @val + offset)
        ctx.fill()

        # Center circle
        ctx.fillStyle = @colorTheme.center
        ctx.beginPath()
        ctx.arc(@size/2, @size/2, @size/15, 0, 2*Math.PI)
        ctx.fill()

    __animateValue: (targetValue) ->
      perStep = if targetValue > @val then 0.05 else -0.05
      @__animIntervalId = setInterval =>
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


  class ns.RaphaelRenderer extends ns.BaseRenderer
    constructor: ->
      super

      @element.addClass 'uploadcare-widget-circle--raphael'
      @element.html(tpl('circle-raphael'))
      @pie = @element.find('@uploadcare-circle-back')
      @center = @element.find('@uploadcare-circle-center')

      @setColorTheme 'default'

      @pie.width(@size).height(@size)

      @angleOffset = -90
      @raphael = @__initRaphael()
      @path = @raphael.path()
      @path.attr(segment: 0, stroke: false)
      @fullDelay = 500 # ms
      @setValue(0, true)

    setColorTheme: (theme) ->
      super

      @pie.css 'background', @colorTheme.back
      @center.css 'background', @colorTheme.center

      if @raphael
        @setValue()

    setValue: (val = @currentVal, instant = false) -> # val in [0..1]
      val = 1 if val > 1
      @currentVal = val
      delay = @fullDelay * Math.abs(val - @value)
      @value = val

      if instant
        @path.attr(segment: @__segmentVal(@value))
      else do (value = @value) =>
        @path.animate {segment: @__segmentVal(value)}, delay, 'linear', =>
          # Revert value to current if changed during animation
          @setValue(@value, true) if @value != value

    __segmentVal: (value) ->
      # Supposed to be = 360 * value,
      # but filling to 360 sometimes doesn't work to IE.
      # There probably is a correct solution to this.
      360 * if value < 1 then value else 0.99999999

    __initRaphael: ->
      raphael = uploadcare.Raphael @pie.get(0), @size, @size
      size = @size
      angleOffset = @angleOffset

      getColor = =>
        @colorTheme.front

      raphael.customAttributes.segment = (angle) ->
        x = size / 2
        y = size / 2
        r = size / 2
        a1 = 0
        a2 = angle
        a1 += angleOffset
        a2 += angleOffset

        flag = (a2 - a1) > 180
        a1 = (a1 % 360) * Math.PI / 180
        a2 -= 0.00001
        a2 = (a2 % 360) * Math.PI / 180

        {
          path: [
            ["M", x, y]
            ["l", r * Math.cos(a1), r * Math.sin(a1)]
            ["A", r, r, 0, +flag, 1, x + r * Math.cos(a2), y + r * Math.sin(a2)], ["z"]
          ]
          fill: getColor()
        }
      return raphael

