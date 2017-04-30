{
  utils,
  jQuery: $
} = uploadcare

fakeButtons = [
  '.uploadcare--link',
  '.uploadcare--widget__button',
  '.uploadcare--menu__item',
  '.uploadcare--button',
].join(', ')

mouseFocusedClass = 'uploadcare--mouse-focused'

$(document.documentElement)
  .on 'mousedown', fakeButtons, (e) ->
    # http://wd.dizaina.net/internet-maintenance/on-outlines/
    utils.defer ->
      activeElement = document.activeElement
      if activeElement and activeElement != document.body
        $(activeElement)
          .addClass(mouseFocusedClass)
          .one 'blur', ->
            $(activeElement).removeClass(mouseFocusedClass)

  .on 'keypress', fakeButtons, (e) ->
    # 13 = Return, 32 = Space
    if e.which == 13 or e.which == 32
      $(this).click()
      e.preventDefault()
      e.stopPropagation()
