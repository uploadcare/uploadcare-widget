import uploadcare from '../namespace'

uploadcare.namespace('utils.abilities', function (ns) {
  var ios, ref, url, ver

  ns.fileAPI = !!(window.File && window.FileList && window.FileReader)

  ns.sendFileAPI = !!(window.FormData && ns.fileAPI)

  // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/draganddrop.js
  ns.dragAndDrop = (function () {
    var el
    el = document.createElement('div')
    return ('draggable' in el) || ('ondragstart' in el && 'ondrop' in el)
  })()

  // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas.js
  ns.canvas = (function () {
    var el
    el = document.createElement('canvas')
    return !!(el.getContext && el.getContext('2d'))
  })()

  ns.fileDragAndDrop = ns.fileAPI && ns.dragAndDrop

  ns.iOSVersion = null

  ios = /^[^(]+\(iP(?:hone|od|ad);\s*(.+?)\)/.exec(navigator.userAgent)

  if (ios) {
    ver = /OS (\d)_(\d)/.exec(ios[1])

    if (ver) {
      ns.iOSVersion = +ver[1] + ver[2] / 10
    }
  }

  ns.Blob = false

  try {
    if (new window.Blob()) {
      ns.Blob = window.Blob
    }
  } catch (error) {}

  url = window.URL || window.webkitURL || false

  ns.URL = url && url.createObjectURL && url

  ns.FileReader = ((ref = window.FileReader) != null ? ref.prototype.readAsArrayBuffer : undefined) && window.FileReader
})
