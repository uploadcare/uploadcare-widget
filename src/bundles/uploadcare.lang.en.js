import uploadcare from './uploadcare.api'

import '../stylesheets'
import '../widget/accessibility'

import { Circle } from '../ui/progress'

import {
  initialize,
  SingleWidget,
  MultipleWidget,
  Widget,
  start
} from '../widget/live'
import {
  closeDialog,
  openDialog,
  openPanel,
  registerTab
} from '../widget/dialog'
import { receiveDrop, support, uploadDrop } from '../widget/dragdrop'

import { plugin } from './namespace.lang.en'

export default {
  ...uploadcare,

  plugin,

  start,
  initialize,

  openDialog,
  closeDialog,
  openPanel,
  registerTab,
  Circle,
  SingleWidget,
  MultipleWidget,
  Widget,

  dragdrop: {
    receiveDrop,
    support,
    uploadDrop
  }
}
