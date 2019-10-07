import $ from 'jquery'
import '../vendor/jquery-xdr'

import { presets, defaults, common } from '../settings'

import '../stylesheets'
import '../widget/submit-guard'
import '../widget/accessibility'

import { en } from '../locales'

import { Circle } from '../ui/progress'

import { tabsCss } from '../widget/tabs/remote-tab'
import { initialize, SingleWidget, MultipleWidget, Widget, start } from '../widget/live'
import { closeDialog, openDialog, openPanel, registerTab } from '../widget/dialog'
import { receiveDrop, support, uploadDrop } from '../widget/dragdrop'

import { fileFrom, filesFrom } from '../files'
import { FileGroup, loadFileGroup } from '../files/group-creator'

import { plugin } from './namespace.lang.en'
import { version } from '../../package.json'

export default {
  plugin,
  version,
  jQuery: $,

  // Defaults (not normalized)
  defaults: $.extend({
    allTabs: presets.tabs.all
  }, defaults),

  globals: common,
  start,
  initialize,
  fileFrom,
  filesFrom,
  FileGroup,
  loadFileGroup,
  openDialog,
  closeDialog,
  openPanel,
  registerTab,
  Circle,
  SingleWidget,
  MultipleWidget,
  Widget,
  tabsCss,
  locales: Object.keys({ en }),
  dragdrop: {
    receiveDrop,
    support,
    uploadDrop
  }
}
