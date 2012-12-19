# = require uploadcare/widget/templates/circle

uploadcare.whenReady ->
  {
    namespace,
    files,
    jQuery: $
  } = uploadcare

  namespace 'uploadcare.progress', (ns) ->
    class ns.Circle
      constructor: (@element) ->
        @element.append(JST['uploadcare/widget/templates/circle']())
        @pie = @element.find('@uploadcare-widget-status')
        @element.addClass 'uploadcare-widget-circle'
        @width = @element.width()
        @color = @__getSegmentColor()
        @angleOffset = -90
        @raphael = @__initRaphael()
        @path = @raphael.path()
        @path.attr(segment: 0, stroke: false)
        @fullDelay = 500 # ms
        @update(0, true)

      update: (val, instant = false) -> # val in [0..1]
        val = 1 if val > 1
        delay = @fullDelay * Math.abs(val - @value)
        @value = val

        if instant
          @path.attr(segment: @__segmentVal(@value))
        else do (value = @value) =>
          @path.animate {segment: @__segmentVal(value)}, delay, 'linear', =>
            # Revert value to current if changed during animation
            @update(@value, true) if @value != value

      __segmentVal: (value) ->
        # Supposed to be = 360 * value,
        # but filling to 360 sometimes doesn't work to IE.
        # There probably is a correct solution to this.
        360 * if value < 1 then value else 0.99999999

      __getSegmentColor: ->
        @pie.addClass('uploadcare-widget-circle-active')
        color = @pie.css('background-color')
        @pie.removeClass('uploadcare-widget-circle-active')
        return color

      __initRaphael: ->
        raphael = uploadcare.Raphael @pie.get(0), @width, @width
        color = @color
        width = @width
        angleOffset = @angleOffset

        raphael.customAttributes.segment = (angle) ->
          x = width / 2
          y = width / 2
          r = width / 2
          a1 = 0
          a2 = angle
          a1 += angleOffset
          a2 += angleOffset

          flag = (a2 - a1) > 180
          a1 = (a1 % 360) * Math.PI / 180
          a2 -= 0.00001
          a2 = (a2 % 360) * Math.PI / 180

          {
            path: [["M", x, y], ["l", r * Math.cos(a1), r * Math.sin(a1)], ["A", r, r, 0, +flag, 1, x + r * Math.cos(a2), y + r * Math.sin(a2)], ["z"]],
            fill: color
          }
        return raphael

