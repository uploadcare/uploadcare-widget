import uploadcare from './uploadcare.lang.en'
import { plugin } from './namespace'

import * as locales from '../locales'

export default {
  ...uploadcare,
  plugin,

  locales: Object.keys(locales)
}
