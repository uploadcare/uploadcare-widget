import $ from 'jquery'
import { version } from '../../package.json'

import * as locales from '../locales'

import { globals, build, common, waitForSettings, CssCollector } from '../settings'
import { rebuild, t } from '../locale'

import { utils, JST, tpl } from '../templates'
import { CropWidget } from '../ui/crop-widget'
import { Circle, BaseRenderer, TextRenderer, CanvasRenderer } from '../ui/progress'
import { Pusher } from '../vendor/pusher'
import { BaseFile } from '../files/base'
import { ObjectFile } from '../files/object'
import { InputFile } from '../files/input'
import { UrlFile } from '../files/url'
import { UploadedFile, ReadyFile } from '../files/uploaded'
import { FileGroup as FileGroupClass, SavedFileGroup } from '../files/group'

import { fileFrom, filesFrom } from '../files'
import { FileGroup, loadFileGroup } from '../files/group-creator'
import { support, uploadDrop, watchDragging, receiveDrop } from '../widget/dragdrop'

import { FileTab } from '../widget/tabs/file-tab'
import { UrlTab } from '../widget/tabs/url-tab'
import { CameraTab } from '../widget/tabs/camera-tab'
import { RemoteTab, tabsCss } from '../widget/tabs/remote-tab'
import { BasePreviewTab } from '../widget/tabs/base-preview-tab'
import { PreviewTab } from '../widget/tabs/preview-tab'
import { PreviewTabMultiple } from '../widget/tabs/preview-tab-multiple'

import { Template as TemplateClass } from '../widget/template'
import { BaseWidget as BaseWidgetClass } from '../widget/base-widget'
import { Widget as WidgetClass } from '../widget/widget'
import { MultipleWidget as MultipleWidgetClass } from '../widget/multiple-widget'

import {
  isDialogOpened,
  closeDialog,
  openDialog,
  openPreviewDialog,
  openPanel,
  registerTab
} from '../widget/dialog'

import { initialize, SingleWidget, MultipleWidget, Widget, start } from '../widget/live'

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

  tabsCss,

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
    CropWidget
  },

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

  dragdrop: {
    support,
    uploadDrop,
    watchDragging,
    receiveDrop
  },

  ui: {
    progress: {
      Circle,
      BaseRenderer,
      TextRenderer,
      CanvasRenderer
    }
  },

  widget: {
    tabs: {
      FileTab,
      UrlTab,
      CameraTab,
      RemoteTab,
      BasePreviewTab,
      PreviewTab,
      PreviewTabMultiple
    },

    Template: TemplateClass,
    BaseWidget: BaseWidgetClass,
    Widget: WidgetClass,
    MultipleWidget: MultipleWidgetClass
  },

  isDialogOpened,
  closeDialog,
  openDialog,
  openPreviewDialog,
  openPanel,
  registerTab,
  initialize,
  SingleWidget,
  MultipleWidget,
  Widget,
  start,

  __exports: {},

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

function plugin (fn) {
  return fn(uploadcare)
}

export { plugin }
export default uploadcare
