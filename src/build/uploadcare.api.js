import $ from 'jquery'
import '../vendor/jquery-xdr'

import { presets, defaults } from '../settings'

import '../files/base'
import '../files/object'
import '../files/input'
import '../files/url'
import '../files/uploaded'
import '../files/group'
import '../files'
import uploadcare from '../namespace'

const { expose } = uploadcare

// Defaults (not normalized)
expose('defaults', $.extend({
  allTabs: presets.tabs.all
}, defaults))

expose('globals', uploadcare.settings.common)
expose('start', uploadcare.settings.common)
expose('fileFrom')
expose('filesFrom')
expose('FileGroup')
expose('loadFileGroup')
expose('locales', Object.keys(uploadcare.locale.translations))

export default uploadcare.__exports
