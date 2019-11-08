import uploadcare from './uploadcare.lang.en'
import { plugin } from './namespace'

import locale from '../locale'

export default {
  ...uploadcare,
  plugin,

  locales: Object.keys(locale.translations)
}
