import $ from 'jquery'
import { version } from '../package.json'

import {
  FileReader,
  URL,
  Blob,
  iOSVersion,
  fileDragAndDrop,
  canvas,
  dragAndDrop,
  sendFileAPI,
  fileAPI
} from './utils/abilities'

import {
  Collection,
  UniqCollection,
  CollectionOfPromises
} from './utils/collection'

import * as locales from './locales'

import { registerMessage, unregisterMessage } from './utils/messages'
import { imageLoader, videoLoader } from './utils/image-loader'
import { log, debug, warn, warnOnce } from './utils/warnings'
import { getPusher } from './utils/pusher'

import {
  unique,
  defer,
  gcd,
  once,
  wrapToPromise,
  then,
  bindAll,
  upperCase,
  publicCallbacks,
  uuid,
  splitUrlRegex,
  uuidRegex,
  groupIdRegex,
  cdnUrlRegex,
  splitCdnUrl,
  escapeRegExp,
  globRegexp,
  normalizeUrl,
  fitText,
  fitSizeInCdnLimit,
  fitSize,
  applyCropCoordsToInfo,
  fileInput,
  fileSelectDialog,
  fileSizeLabels,
  readableFileSize,
  ajaxDefaults,
  jsonp,
  canvasToBlob,
  taskRunner,
  fixedPipe
} from './utils'

import { globals, build, common, waitForSettings, CssCollector } from './settings'
import { rebuild, t } from './locale'

import {
  shrinkFile,
  shrinkImage,
  drawFileToCanvas,
  readJpegChunks,
  replaceJpegChunk,
  getExif,
  parseExifOrientation,
  hasTransparency
} from './utils/image-processor'

const uploadcare = {
  version,
  jQuery: $,

  utils: {
    abilities: {
      fileAPI,
      sendFileAPI,
      dragAndDrop,
      canvas,
      fileDragAndDrop,
      iOSVersion,
      Blob,
      URL,
      FileReader
    },

    Collection,
    UniqCollection,
    CollectionOfPromises,

    imageLoader,
    videoLoader,

    log,
    debug,
    warn,
    warnOnce,

    //   commonWarning

    registerMessage,
    unregisterMessage,

    unique,
    defer,
    gcd,
    once,
    wrapToPromise,
    then,
    bindAll,
    upperCase,
    publicCallbacks,
    uuid,
    splitUrlRegex,
    uuidRegex,
    groupIdRegex,
    cdnUrlRegex,
    splitCdnUrl,
    escapeRegExp,
    globRegexp,
    normalizeUrl,
    fitText,
    fitSizeInCdnLimit,
    fitSize,
    applyCropCoordsToInfo,
    fileInput,
    fileSelectDialog,
    fileSizeLabels,
    readableFileSize,
    ajaxDefaults,
    jsonp,
    canvasToBlob,
    taskRunner,
    fixedPipe,

    //   isFile
    //   valueToFile

    image: {
      shrinkFile,
      shrinkImage,
      drawFileToCanvas,
      readJpegChunks,
      replaceJpegChunk,
      getExif,
      parseExifOrientation,
      hasTransparency
    },

    pusher: {
      getPusher
    }

    //   isFileGroup
    //   valueToGroup
    //   isFileGroupsEqual

  },

  settings: {
    globals,
    build,
    common,
    waitForSettings,
    CssCollector
  },

  // TODO: move to separete file
  tabsCss: new CssCollector(),

  locale: {
    translations: Object.keys(locales).reduce((translations, lang) => {
      translations[lang] = locales[lang].translations

      return translations
    }, {}),

    pluralize: Object.keys(locales).reduce((pluralize, lang) => {
      pluralize[lang] = locales[lang].pluralize

      return pluralize
    }, {}),

    rebuild,
    t
  },

  templates: {
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
  },

  crop: {
    //   CropWidget
  },

  files: {
    //   BaseFile
    //   ObjectFile
    //   InputFile
    //   UrlFile
    //   UploadedFile
    //   ReadyFile
    //   FileGroup
    //   SavedFileGroup
  },

  // Pusher
  // FileGroup
  // loadFileGroup
  // fileFrom
  // filesFrom

  dragdrop: {
    //   support
    //   uploadDrop
    //   receiveDrop
    //   watchDragging
  },

  ui: {
    progress: {
    //     Circle
    //     BaseRenderer
    //     TextRenderer
    //     CanvasRenderer
    }
  },

  widget: {
    tabs: {
    //     FileTab
    //     UrlTab
    //     CameraTab
    //     RemoteTab
    //     BasePreviewTab
    //     PreviewTab
    //     PreviewTabMultiple
    }
  //   Template
  //   BaseWidget
  //   Widget
  //   MultipleWidget
  },

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

        if (!target[part]) {
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
      if (!target[part]) {
        target[part] = {}
      }

      target = target[part]
      source = source != null ? source[part] : undefined
    }

    target[last] = value || source[last]
  }
}

export default uploadcare
