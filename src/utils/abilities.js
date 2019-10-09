// utils.abilities
const fileAPI = !!(window.File && window.FileList && window.FileReader)

const sendFileAPI = !!(window.FormData && fileAPI)

// https://github.com/Modernizr/Modernizr/blob/master/feature-detects/draganddrop.js
const dragAndDrop = (function () {
  var el
  el = document.createElement('div')
  return 'draggable' in el || ('ondragstart' in el && 'ondrop' in el)
})()

// https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas.js
const canvas = (function () {
  var el
  el = document.createElement('canvas')
  return !!(el.getContext && el.getContext('2d'))
})()

const fileDragAndDrop = fileAPI && dragAndDrop

let iOSVersion = null

// TODO: don't access to navigator in module scope (NODE don't have navigator)
const ios = /^[^(]+\(iP(?:hone|od|ad);\s*(.+?)\)/.exec(navigator.userAgent)

if (ios) {
  const ver = /OS (\d)_(\d)/.exec(ios[1])

  if (ver) {
    iOSVersion = +ver[1] + ver[2] / 10
  }
}

let Blob = false

try {
  if (new window.Blob()) {
    Blob = window.Blob
  }
} catch (error) {}

const url = window.URL || window.webkitURL || false

const URL = url && url.createObjectURL && url

const FileReader =
  (window.FileReader != null
    ? window.FileReader.prototype.readAsArrayBuffer
    : undefined) && window.FileReader

export {
  FileReader,
  URL,
  Blob,
  iOSVersion,
  fileDragAndDrop,
  canvas,
  dragAndDrop,
  sendFileAPI,
  fileAPI
}
