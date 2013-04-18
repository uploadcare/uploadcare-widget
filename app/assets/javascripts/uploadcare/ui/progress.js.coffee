{
  namespace,
  files,
  jQuery: $
} = uploadcare

{tpl} = uploadcare.templates

namespace 'uploadcare.ui.progress', (ns) ->
  class ns.Circle
    constructor: (@element) ->
      # should work with other jqueries
      @element = $(@element)

      @element.html(tpl('circle'))
      @pie = @element.find('@uploadcare-widget-status')
      @center = @element.find('@uploadcare-circle-center')
      @element.addClass 'uploadcare-widget-circle'

      @setColorTheme 'default'
      
      @size = Math.min(@element.width(), @element.height())
      @pie.width(@size).height(@size)

      @angleOffset = -90
      @raphael = @__initRaphael()
      @path = @raphael.path()
      @path.attr(segment: 0, stroke: false)
      @fullDelay = 500 # ms
      @__update(0, true)

      @observed = null

    listen: (file, selector = 'uploadProgress') ->
      @reset()
      selectorFn = if selector?
        (info) -> info[selector]
      else
        (x) -> x

      @observed = file

      if @observed.state() is "resolved"
        @__update 1, true
      else
        @observed
          .progress (progress) =>
            # if we are still listening to this one
            if file == @observed
              @__update selectorFn(progress)

          .done (uploadedFile) =>
            if file == @observed
              @__update 1, false
      @


    reset: (filled = false) ->
      @observed = null
      @__update (if filled then 100 else 0), true

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

    setColorTheme: (theme) ->
      if $.type(theme) is 'string'
        theme = @colorThemes[theme]
      @colorTheme = $.extend {}, @colorThemes.default, theme
      
      @pie.css 'background', @colorTheme.back
      @center.css 'background', @colorTheme.center

      if @raphael
        @__update()

    __update: (val = @currentVal, instant = false) -> # val in [0..1]
      val = 1 if val > 1
      @currentVal = val
      delay = @fullDelay * Math.abs(val - @value)
      @value = val

      if instant
        @path.attr(segment: @__segmentVal(@value))
      else do (value = @value) =>
        @path.animate {segment: @__segmentVal(value)}, delay, 'linear', =>
          # Revert value to current if changed during animation
          @__update(@value, true) if @value != value

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

