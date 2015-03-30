do ->
  fakeButtons = [
    'div.uploadcare-link',
    'div.uploadcare-widget-button',
    'div.uploadcare-dialog-tab',
    'div.uploadcare-dialog-button',
    'div.uploadcare-dialog-button-success',
  ].join(', ')

  mouseFocusedClass = 'uploadcare-mouse-focused'

  $(document.documentElement)
    .on 'mousedown', fakeButtons, (e) ->
      # http://wd.dizaina.net/internet-maintenance/on-outlines/
      setTimeout(->
        activeElement = document.activeElement
        if activeElement and activeElement != document.body
          $(activeElement)
            .addClass(mouseFocusedClass)
            .one 'blur', ->
              $(activeElement).removeClass(mouseFocusedClass)
      , 0)

    .on 'keypress', fakeButtons, (e) ->
      # 13 = Return, 32 = Space
      if e.which == 13 or e.which == 32
        $(this).click()
        e.preventDefault()
        e.stopPropagation()
