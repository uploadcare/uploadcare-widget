{
  namespace,
  jQuery: $
} = uploadcare

namespace 'uploadcare.utils', (utils) ->

  utils.squareImage = (container, src, size, __attempts = 5) ->
    container = $ container

    unless size?
      size = container.width()

    container.css
      position: 'relative'
      overflow: 'hidden'

    img = new Image()
    img.src = src
    $(img).hide().appendTo(container)

    $(img).on 
      load: ->
        if @width > @height
          @width = @width * size / @height
          @height = size
        else
          @height = @height * size / @width
          @width = size
        $(this)
          .css(
            top: Math.round (@height - size) / -2
            left: Math.round (@width - size) / -2
          ).fadeIn()
      error: ->
        if __attempts > 0
          __attempts--
          this.src = "#{src}&#{new Date().getTime()}"
