import $ from 'jquery'
import { version } from '../package.json'

const uploadcare = {
  version,
  jQuery: $

// utils:
//   abilities:
//     fileAPI
//     sendFileAPI
//     dragAndDrop
//     canvas
//     fileDragAndDrop
//     iOSVersion
//     Blob
//     URL
//     FileReader
//   Collection
//   UniqCollection
//   CollectionOfPromises
//   imageLoader
//   videoLoader
//   log
//   debug
//   warn
//   warnOnce
//   commonWarning
//   registerMessage
//   unregisterMessage
//   unique
//   defer
//   gcd
//   once
//   wrapToPromise
//   then
//   bindAll
//   upperCase
//   publicCallbacks
//   uuid
//   splitUrlRegex:
//   uuidRegex:
//   groupIdRegex:
//   cdnUrlRegex:
//   splitCdnUrl
//   escapeRegExp
//   globRegexp
//   normalizeUrl
//   fitText
//   fitSizeInCdnLimit
//   fitSize
//   applyCropCoordsToInfo
//   fileInput
//   fileSelectDialog
//   fileSizeLabels
//   readableFileSize
//   ajaxDefaults:
//     dataType
//     crossDomain
//     cache
//   jsonp
//   canvasToBlob
//   taskRunner
//   fixedPipe
//   isFile
//   valueToFile
//   image:
//     shrinkFile
//     shrinkImage
//     drawFileToCanvas
//     readJpegChunks
//     replaceJpegChunk
//     getExif
//     parseExifOrientation
//     hasTransparency
//   pusher:
//     getPusher
//   isFileGroup
//   valueToGroup
//   isFileGroupsEqual

// settings:
//   globals
//   common
//   build
//   waitForSettings
//   CssCollector

// tabsCss:
//   urls
//   styles

// locale:
//   translations
//   pluralize
//   rebuild
//   t

// templates:
//   JST:
//     dialog
//     dialog__panel
//     icons
//     progress__text
//     styles
//     tab-camera-capture
//     tab-camera
//     tab-file
//     tab-preview-error
//     tab-preview-image
//     tab-preview-multiple-file
//     tab-preview-multiple
//     tab-preview-regular
//     tab-preview-unknown
//     tab-preview-video
//     tab-url
//     widget-button
//     widget-file-name
//     widget
//   tpl

// crop:
//   CropWidget

// files:
//   BaseFile
//   ObjectFile
//   InputFile
//   UrlFile
//   UploadedFile
//   ReadyFile
//   FileGroup
//   SavedFileGroup

// Pusher
// FileGroup
// loadFileGroup
// fileFrom
// filesFrom

// dragdrop:
//   support
//   uploadDrop
//   receiveDrop
//   watchDragging

// ui:
//   progress:
//     Circle
//     BaseRenderer
//     TextRenderer
//     CanvasRenderer

// widget:
//   Template
//   tabs:
//     FileTab
//     UrlTab
//     CameraTab
//     RemoteTab
//     BasePreviewTab
//     PreviewTab
//     PreviewTabMultiple
//   BaseWidget
//   Widget
//   MultipleWidget

// isDialogOpened
// closeDialog
// openDialog
// openPreviewDialog
// openPanel
// registerTab
// initialize
// SingleWidget
// MultipleWidget
// Widget
// start

  __exports: {
    plugin: function (fn) {
      return fn(uploadcare)
    },
    version,
    jQuery: $
  },

  namespace: (path, fn) => {
    let target = uploadcare

    if (path) {
      const ref = path.split('.')

      for (let i = 0, len = ref.length; i < len; i++) {
        const part = ref[i]

        if (target[part]) {
          target[part] = {}
        }

        target = target[part]
      }
    }

    return fn(target)
  },

  expose: (key, value) => {
    const parts = key.split('.')
    const last = parts.pop()
    let target = uploadcare.__exports
    let source = uploadcare

    for (let i = 0, len = parts.length; i < len; i++) {
      const part = parts[i]
      if (target[part]) {
        target[part] = {}
      }

      target = target[part]
      source = source != null ? source[part] : undefined
    }

    target[last] = value || source[last]
  }
}

export default uploadcare
