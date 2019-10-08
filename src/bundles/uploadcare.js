import uploadcare from './uploadcare.api'
import { plugin } from './namespace'

import * as locales from '../locales'

export default {
  ...uploadcare,
  plugin,

  locales: Object.keys(locales)
}
