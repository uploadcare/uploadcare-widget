import uploadcare from '../namespace'
import exports from './_widget'

uploadcare.expose('locales', (key for key of uploadcare.locale.translations))

export default exports
