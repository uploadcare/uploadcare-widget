jQueryVersion = '1.7.2'

jquerySrc = "//code.jquery.com/jquery-#{jQueryVersion}.min.js"

if jQuery? and jQuery().jquery > jQueryVersion
  uploadcare.jQuery = jQuery
  return uploadcare.jQuery -> uploadcare.ready()

script = document.createElement('script')
script.addEventListener 'load', ->
  uploadcare.jQuery = jQuery.noConflict(true)
  uploadcare.jQuery -> uploadcare.ready()

script.src = jquerySrc
document.head.appendChild(script)
