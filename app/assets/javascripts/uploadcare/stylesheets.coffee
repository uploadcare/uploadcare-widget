import uploadcare from './namespace'

{jQuery: $} = uploadcare
{tpl} = uploadcare.templates

uploadcare.settings.waitForSettings.add (settings) ->
  css = tpl('styles', {settings})

  style = document.createElement('style')
  style.setAttribute('type', 'text/css')
  if style.styleSheet?
    style.styleSheet.cssText = css
  else
    style.appendChild(document.createTextNode(css))
  $('head').prepend(style)
