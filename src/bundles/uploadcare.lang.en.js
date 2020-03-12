import '../stylesheets'
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

export default {
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
