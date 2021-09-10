import { isWindowDefined } from './is-window-defined'

// utils.abilities
const fileAPI =
  isWindowDefined() && !!(window.File && window.FileList && window.FileReader)

const sendFileAPI = isWindowDefined() && !!(window.FormData && fileAPI)

// https://github.com/Modernizr/Modernizr/blob/master/feature-detects/draganddrop.js
const dragAndDrop =
  isWindowDefined() &&
  (function() {
    var el
    el = document.createElement('div')
    return 'draggable' in el || ('ondragstart' in el && 'ondrop' in el)
  })()

// https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas.js
const canvas =
  isWindowDefined() &&
  (function() {
    var el
    el = document.createElement('canvas')
    return !!(el.getContext && el.getContext('2d'))
  })()

const fileDragAndDrop = fileAPI && dragAndDrop

let iOSVersion = null

// TODO: don't access to navigator in module scope (NODE don't have navigator)
const ios =
  isWindowDefined() &&
  /^[^(]+\(iP(?:hone|od|ad);\s*(.+?)\)/.exec(navigator.userAgent)

if (ios) {
  const ver = /OS (\d*)_(\d*)/.exec(ios[1])

  if (ver) {
    iOSVersion = +ver[1] + ver[2] / 10
  }
}

let Blob = false

try {
  if (isWindowDefined() && new window.Blob()) {
    Blob = window.Blob
  }
} catch (error) {}

const url = isWindowDefined() && (window.URL || window.webkitURL || false)

const URL = url && url.createObjectURL && url

const FileReader =
  isWindowDefined() &&
  ((window.FileReader != null
    ? window.FileReader.prototype.readAsArrayBuffer
    : undefined) &&
    window.FileReader)

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
