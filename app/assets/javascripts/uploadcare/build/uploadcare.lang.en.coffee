import uploadcare from '../namespace.coffee'
import exports from './_widget.coffee'

uploadcare.expose('locales', (key for key of uploadcare.locale.translations))

export default exports
