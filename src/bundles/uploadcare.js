import uploadcare from './uploadcare.lang.en'
import locale from '../locale'

export default {
  ...uploadcare,

  locales: Object.keys(locale.translations)
}
