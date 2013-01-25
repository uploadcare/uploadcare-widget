{namespace} = uploadcare

namespace 'uploadcare', (ns) ->
  ns.__readyCallbacks = []

  ns.whenReady = (callback) ->
    ns.__readyCallbacks.push(callback)

  ns.ready = ->
    callback() for callback in ns.__readyCallbacks
    ns.whenReady = (callback) -> callback()



jQueryVersion = '1.7.2'

jquerySrc = "https://ajax.googleapis.com/ajax/libs/jquery/#{jQueryVersion}/jquery.min.js"

if jQuery? and jQuery().jquery > jQueryVersion
  uploadcare.jQuery = jQuery
  return uploadcare.jQuery -> uploadcare.ready()

script = document.createElement('script')
script.setAttribute('src', jquerySrc)

load = ->
  uploadcare.jQuery = jQuery.noConflict(true)
  uploadcare.jQuery -> uploadcare.ready()

if document.addEventListener?
  script.addEventListener('load', load, false)
else
  script.attachEvent 'onreadystatechange', ->
    load() if script.readyState == 'loaded' || script.readyState == 'complete'

first = document.getElementsByTagName('script')[0]
first.parentNode.insertBefore(script, first)
