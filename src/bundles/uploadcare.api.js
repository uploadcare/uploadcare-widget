import $ from 'jquery'
import '../utils/jquery-ajax-retry'
import '../vendor/jquery-xdr'

import { presets, defaults, common } from '../settings'
import { fileFrom, filesFrom } from '../files'
import { FileGroup, loadFileGroup } from '../files/group-creator'

import { plugin } from './namespace.api'
import { version } from '../../package.json'

export default {
  plugin,
  version,
  jQuery: $,

  // Defaults (not normalized)
  defaults: {
    ...defaults,
    allTabs: presets.tabs.all
  },

  globals: common,
  start: common,
  fileFrom,
  filesFrom,
  FileGroup,
  loadFileGroup,
  locales: ['en']
}
