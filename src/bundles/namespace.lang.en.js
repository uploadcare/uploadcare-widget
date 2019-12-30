import namespaceApi, { createPlugin } from './namespace.api'

import { JST, tpl } from '../templates'

// import { CropWidget } from '../ui/crop-widget'
import {
  Circle,
  BaseRenderer,
  TextRenderer,
  CanvasRenderer
} from '../ui/progress'

import {
  support,
  uploadDrop,
  watchDragging,
  receiveDrop
} from '../widget/dragdrop'

import { FileTab } from '../widget/tabs/file-tab'
import { UrlTab } from '../widget/tabs/url-tab'
import { CameraTab } from '../widget/tabs/camera-tab'
import { RemoteTab } from '../widget/tabs/remote-tab'
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

import {
  initialize,
  SingleWidget,
  MultipleWidget,
  Widget,
  start
} from '../widget/live'

const namespace = {
  ...namespaceApi,

  templates: {
    JST,
    tpl
  },

  crop: {
    // CropWidget
  },

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
  start
}

const plugin = createPlugin(namespace)

export { plugin }
export default namespace
