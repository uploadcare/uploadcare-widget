import '../boot'
import '../vendor/jquery-xdr'
import '../utils/abilities'
import '../utils/collection'
import '../utils/image-loader'
import '../utils/warnings'
import '../utils/messages'
import '../utils'
import '../settings'
import '../locale/en'
import '../locale'
import '../files/base'
import '../files/object'
import '../files/input'
import '../vendor/pusher'
import '../utils/pusher'
import '../files/url'
import '../files/uploaded'
import '../files/group'
import '../files'
import uploadcare from '../namespace'

const { expose } = uploadcare

expose('globals', uploadcare.settings.common)
expose('start', uploadcare.settings.common)
expose('fileFrom')
expose('filesFrom')
expose('FileGroup')
expose('loadFileGroup')
expose('locales', Object.keys(uploadcare.locale.translations))

export default uploadcare.__exports
