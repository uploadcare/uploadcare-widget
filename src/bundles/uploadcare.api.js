import { presets, defaults, common } from '../settings'
import { FileGroup, loadFileGroup } from '../files/group-creator'

import { plugin } from './namespace.api'
import { version } from '../../package.json'

export default {
  plugin,
  version,

  // Defaults (not normalized)
  defaults: {
    ...defaults,
    allTabs: presets.tabs.all
  },

  globals: common,
  start: common,
  FileGroup,
  loadFileGroup,
  locales: ['en']
}
