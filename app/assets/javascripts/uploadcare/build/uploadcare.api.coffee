import '../boot.coffee'

import '../vendor/jquery-xdr.js'

import '../utils/abilities.coffee'
import '../utils/collection.coffee'
import '../utils/image-loader.coffee'
import '../utils/warnings.coffee'
import '../utils/messages.coffee'
import '../utils.coffee'
import '../settings.coffee'
import '../locale/en.coffee'
import '../locale.coffee'
import '../files/base.coffee'
import '../files/object.coffee'
import '../files/input.coffee'

import '../vendor/pusher.js'

import '../utils/pusher.coffee'
import '../files/url.coffee'
import '../files/uploaded.coffee'
import '../files/group.coffee'
import '../files.coffee'

import uploadcare from '../namespace.coffee'

{expose} = uploadcare

expose('globals', uploadcare.settings.common)
expose('start', uploadcare.settings.common)
expose('fileFrom')
expose('filesFrom')
expose('FileGroup')
expose('loadFileGroup')
expose('locales', (key for key of uploadcare.locale.translations))

export default uploadcare.__exports
