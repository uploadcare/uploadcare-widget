{
  namespace,
  files,
  jQuery: $,
  utils: {abilities},
  templates: {tpl},
} = uploadcare

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

    update: =>
      @renderer.update()


  class ns.BaseRenderer
    constructor: (el) ->
      @element = $(el)
      @element.data 'uploadcare-progress-renderer', this
      @element.addClass 'uploadcare-widget-circle'

    update: ->


  class ns.TextRenderer extends ns.BaseRenderer
    constructor: ->
      super
      @element.addClass 'uploadcare-widget-circle--text'
      @element.html(tpl('circle-text'))
      @text = @element.find('@uploadcare-circle-text')

    setValue: (val) ->
      val = Math.round(val * 100)
      @text.html "#{val} %"


  class ns.CanvasRenderer extends ns.BaseRenderer

    constructor: ->
      super
      @canvasSize = Math.floor(Math.min(@element.width(), @element.height())) * 2

      @canvasEl = $('<canvas>')
                  .prop(width: @canvasSize, height: @canvasSize)
      @canvasCtx = @canvasEl.get(0).getContext '2d'

      @element.addClass 'uploadcare-widget-circle--canvas'
      @element.html(@canvasEl)

      @setValue 0, true

    update: ->
      if @canvasCtx
        ctx = @canvasCtx
        half = @canvasSize/2

        arc = (radius, val) ->
          offset = -Math.PI / 2
          ctx.beginPath()
          ctx.moveTo(half, half)
          ctx.arc(half, half, radius, offset, offset + 2 * Math.PI * val, false)
          ctx.fill()

        # Clear
        ctx.clearRect(0, 0, @canvasSize, @canvasSize)

        # Background circle
        ctx.globalCompositeOperation = 'source-over'
        ctx.fillStyle = @element.css('border-left-color')
        arc(half - .5, 1)

        # Progress circle
        ctx.fillStyle = @element.css('color')
        arc(half, @val)

        # Make a hole
        ctx.globalCompositeOperation = 'xor'
        arc(half / 7, 1)

    __animateValue: (target) ->
      val = @val
      start = new Date()
      speed = if target > val then 2 else -2
      @__animIntervalId = setInterval =>
        current = val + (new Date() - start) / 1000 * speed
        current = (if speed > 0 then Math.min else Math.max)(current, target)
        if current == target
          @__stopAnimation()
        @__setValue current
      , 15

    __stopAnimation: ->
      if @__animIntervalId
        clearInterval @__animIntervalId
        @__animIntervalId = null

    __setValue: (val) ->
      @val = val
      @update()

    setValue: (val, instant = false) ->
      @__stopAnimation()
      if instant
        @__setValue(val)
      else
        @__animateValue(val)
