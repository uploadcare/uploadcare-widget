import uploadcare from '../namespace'
import exports from './_widget'

uploadcare.jQuery.noConflict(true)

uploadcare.expose('locales', Object.keys(uploadcare.locale.translations))

export default exports
