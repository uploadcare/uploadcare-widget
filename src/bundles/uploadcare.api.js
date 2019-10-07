import $ from 'jquery'
import '../vendor/jquery-xdr'

import { presets, defaults, common } from '../settings'

import '../stylesheets'
import '../widget/submit-guard'
import '../widget/accessibility'

import { en } from '../locales'

import { fileFrom, filesFrom } from '../files'
import { FileGroup, loadFileGroup } from '../files/group-creator'

import { plugin } from './namespace.api'
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
  start: common,
  fileFrom,
  filesFrom,
  FileGroup,
  loadFileGroup,
  locales: Object.keys({ en })
}
