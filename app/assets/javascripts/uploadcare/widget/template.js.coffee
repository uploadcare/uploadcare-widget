# = require ./templates/widget
# = require ./templates/circle

uploadcare.whenReady ->
  {
    namespace,
    jQuery: $,
    utils
  } = uploadcare

  {t} = uploadcare.locale

  namespace 'uploadcare.widget', (ns) ->
    class ns.Template
      constructor: (@element)->
        @content = $(JST['uploadcare/widget/templates/widget']())
        @content.css('display', 'none')
        @element.after(@content)
        @status = new ns.Circle(@content.find('@uploadcare-widget-status'))
        @statusText = @content.find('@uploadcare-widget-status-text')
        @buttonsContainer = @content.find('@uploadcare-widget-buttons')
        @cancelButton = @buttonsContainer.find('@uploadcare-widget-buttons-cancel')
        @removeButton = @buttonsContainer.find('@uploadcare-widget-buttons-remove')

        @cancelButton.text(t('buttons.cancel'))
        @removeButton.text(t('buttons.remove'))

        @cancelButton.on 'click', => $(this).trigger('uploadcare-cancel')
        @removeButton.on 'click', => $(this).trigger('uploadcare-cancel')

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

      addButton: (name) ->
        li = $('<li>').addClass("uploadcare-widget-buttons-#{name}")
        @buttonsContainer.find('@uploadcare-widget-buttons-cancel').before(li)
        return li

      setStatus: (status) ->
        @content.attr('data-status', status)
        form = @element.closest('@uploadcare-upload-form')
        form.trigger("uploadcare-uploader#{status}")
        @element.trigger("uploadcare-uploader#{status}")

      ready: ->
        @statusText.text(t('ready'))
        @status.setValue(0, true)
        @setStatus 'ready'

      loaded: ->
        @status.setValue(1)
        @setStatus 'load'

      progress: (val, instant = false) ->
        @status.setValue(val, instant)

      error: ->
        @statusText.text(t('error'))
        @setStatus 'error'

      started: ->
        @statusText.text(t('uploading'))
        @setStatus 'start'

      setFileInfo: (fileName, fileSize) ->
        fileSize = Math.ceil(fileSize/1024).toString()
        @statusText.text("#{utils.fitText(fileName)}, #{fileSize} kb")


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
        @setValue(0, true)

      getValue: () ->
        @value

      setValue: (val, instant = false) -> # val in [0..1]
        val = 1 if val > 1
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
