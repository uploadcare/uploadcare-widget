import uploadcare from '../namespace'
import exports from './_widget'

uploadcare.expose('locales', Object.keys(uploadcare.locale.translations))

export default exports
