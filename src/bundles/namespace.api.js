import $ from 'jquery'

import { pluralize, translations } from '../locales/en'
import { rebuild, t } from '../locale'

import { globals, build, common, waitForSettings, CssCollector } from '../settings'

import { utils } from '../templates'
import { Pusher } from '../vendor/pusher'
import { BaseFile } from '../files/base'
import { ObjectFile } from '../files/object'
import { InputFile } from '../files/input'
import { UrlFile } from '../files/url'
import { UploadedFile, ReadyFile } from '../files/uploaded'
import { FileGroup as FileGroupClass, SavedFileGroup } from '../files/group'

import { tabsCss } from '../widget/tabs/remote-tab'

import { fileFrom, filesFrom } from '../files'
import { FileGroup, loadFileGroup } from '../files/group-creator'

import { version } from '../../package.json'

const namespace = {
  version,
  jQuery: $,

  utils,

  settings: {
    globals,
    build,
    common,
    waitForSettings,
    CssCollector
  },

  locale: {
    translations: { en: translations },
    pluralize: { en: pluralize },
    rebuild,
    t
  },

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
  fileFrom,
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

function createPlugin (ns) {
  return fn => fn(ns)
}

const plugin = createPlugin(namespace)

export { plugin, createPlugin }
export default namespace
