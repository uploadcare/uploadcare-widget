import $ from 'jquery'

// utils
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
} from '../utils/abilities'

import {
  Collection,
  UniqCollection,
  CollectionOfPromises
} from '../utils/collection'

import { registerMessage, unregisterMessage } from '../utils/messages'
import { imageLoader, videoLoader } from '../utils/image-loader'
import { log, debug, warn, warnOnce } from '../utils/warnings'
import { getPusher } from '../utils/pusher'

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
} from '../utils'

// import {
//   shrinkFile,
//   shrinkImage,
//   drawFileToCanvas,
//   readJpegChunks,
//   replaceJpegChunk,
//   getExif,
//   parseExifOrientation,
//   hasTransparency
// } from '../utils/image-processor'

import { isFile, valueToFile } from '../utils/files'
import { isFileGroup, valueToGroup, isFileGroupsEqual } from '../utils/groups'

import locale from '../locale'

import {
  globals,
  build,
  common,
  waitForSettings,
  CssCollector
} from '../settings'

import { Pusher } from '../vendor/pusher'
import { BaseFile } from '../files/base'
import { ObjectFile } from '../files/object'
import { InputFile } from '../files/input'
import { UrlFile } from '../files/url'
import { UploadedFile, ReadyFile } from '../files/uploaded'
import { FileGroup as FileGroupClass, SavedFileGroup } from '../files/group'

import { tabsCss } from '../widget/tabs/remote-tab'

import { filesFrom } from '../files'
import { FileGroup, loadFileGroup } from '../files/group-creator'

import { version } from '../../package.json'

const namespace = {
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

    isFile,
    valueToFile,

    // image: {
      // shrinkFile,
      // shrinkImage,
      // drawFileToCanvas,
      // readJpegChunks,
      // replaceJpegChunk,
      // getExif,
      // parseExifOrientation,
      // hasTransparency
    // },

    pusher: {
      getPusher
    },

    isFileGroup,
    valueToGroup,
    isFileGroupsEqual
  },

  settings: {
    globals,
    build,
    common,
    waitForSettings,
    CssCollector
  },

  locale,

  tabsCss,

  files: {
    BaseFile,
    ObjectFile,
    InputFile,
    UrlFile,
    UploadedFile,
    ReadyFile,
    FileGroup: FileGroupClass,
    SavedFileGroup
  },

  Pusher,

  FileGroup,
  loadFileGroup,
  filesFrom,

  __exports: {},

  namespace: (path, fn) => {
    let target = namespace

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
    let target = namespace.__exports
    let source = namespace

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

function createPlugin(ns) {
  return fn => fn(ns)
}

const plugin = createPlugin(namespace)

export { plugin, createPlugin }
export default namespace
