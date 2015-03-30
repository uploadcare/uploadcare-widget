do ->
  fakeButtons = [
    'div.uploadcare-link',
    'div.uploadcare-widget-button',
    'div.uploadcare-dialog-tab',
    'div.uploadcare-dialog-button',
    'div.uploadcare-dialog-button-success',
  ].join(', ')

  $(document.documentElement)
    .on 'click', fakeButtons, ->
      this.blur()
    .on 'keypress', fakeButtons, (e) ->
      # 13 = Return, 32 = Space
      if e.which == 13 or e.which == 32
        $(this).click()
        e.preventDefault()
        e.stopPropagation()
