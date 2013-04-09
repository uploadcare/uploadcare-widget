{
  namespace,
  jQuery: $
} = uploadcare

namespace 'uploadcare.utils', (utils) ->

  utils.squareImage = (container, src, size, attempts = 5) ->
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
        if attempts-- > 0
          d = if src.split('?')[1] then '&' else '?'
          this.src = "#{src}#{d}#{new Date().getTime()}"
