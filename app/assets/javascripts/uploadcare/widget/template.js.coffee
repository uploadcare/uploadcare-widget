# = require ./templates/widget
# = require ./templates/circle

uploadcare.whenReady ->
  {
    namespace,
    jQuery,
    # JST,
  } = uploadcare

  {t} = uploadcare.locale
  
  namespace 'uploadcare.widget', (ns) ->
    class ns.Template
      constructor: (@element)->
        @content = jQuery(JST['uploadcare/widget/templates/widget']())
        @element.after(@content)
        @status = new ns.Circle(@content.find('@uploadcare-widget-status'))
        @statusText = @content.find('@uploadcare-widget-status-text')
        @buttonsContainer = @content.find('@uploadcare-widget-buttons')
        @cancelButton = @buttonsContainer.find('@uploadcare-widget-buttons-cancel')
        @removeButton = @buttonsContainer.find('@uploadcare-widget-buttons-remove')

        @cancelButton.text(t('buttons.cancel'))
        @removeButton.text(t('buttons.remove'))

        @cancelButton.on 'click', => jQuery(this).trigger('uploadcare.widget.template.cancel')
        @removeButton.on 'click', => jQuery(this).trigger('uploadcare.widget.template.remove')

      addButton: (name) ->
        li = jQuery('<li>').addClass("uploadcare-widget-buttons-#{name}")
        @buttonsContainer.find('@uploadcare-widget-buttons-cancel').before(li)
        return li

      ready: ->
        @content.removeClass('started loaded error done')
        @statusText.text(t('ready'))
        @status.setValue(0, true)

      loaded: ->
        @status.setValue(1)
        @content.removeClass('started')
        @content.addClass('loaded')

      progress: (val) ->
        @content.removeClass('started')
        @status.setValue(val)

      error: ->
        @statusText.text(t('error'))
        @content.removeClass('started')
        @content.addClass('error')

      started: ->
        @statusText.text(t('uploading'))
        @content.addClass('started')

      setFileInfo: (fileName, fileSize) ->
        fileSize = Math.ceil(fileSize/1024).toString()
        @statusText.text("#{fileName}, #{fileSize} kb")


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
        @setValue(0)

      getValue: () ->
        @value

      setValue: (val, instant = false) -> # val in [0...1]
        
        val = 1 if val > 1
        delay = @fullDelay * Math.abs(val - @value)
        @value = val

        if instant
          @path.attr({segment: @value * 360})
        else
          @path.animate({segment: @value * 360}, delay, 'linear')

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
          # debugger
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
