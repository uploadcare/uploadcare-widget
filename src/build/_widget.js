import $ from 'jquery'
import '../vendor/jquery-xdr'

import { presets, defaults } from '../settings'

import '../stylesheets'
import '../widget/submit-guard'
import '../widget/accessibility'

import uploadcare from '../namespace'

const { expose } = uploadcare

// Defaults (not normalized)
expose('defaults', $.extend({
  allTabs: presets.tabs.all
}, defaults))

expose('globals', uploadcare.settings.common)
expose('start')
expose('initialize')
expose('fileFrom')
expose('filesFrom')
expose('FileGroup')
expose('loadFileGroup')
expose('openDialog')
expose('closeDialog')
expose('openPanel')
expose('registerTab')
expose('Circle', uploadcare.ui.progress.Circle)
expose('SingleWidget')
expose('MultipleWidget')
expose('Widget')
expose('tabsCss')
expose('dragdrop.support')
expose('dragdrop.receiveDrop')
expose('dragdrop.uploadDrop')

export default uploadcare.__exports
