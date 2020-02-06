import { presets, defaults, common } from '../settings'

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
  locales: ['en']
}
