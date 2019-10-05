import $ from 'jquery'
import { version } from '../package.json'

import * as locales from './locales'

import { globals, build, common, waitForSettings, CssCollector } from './settings'
import { rebuild, t } from './locale'

import { utils, JST, tpl } from './templates'

const uploadcare = {
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
    JST,
    tpl
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
