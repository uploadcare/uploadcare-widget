import '../boot.coffee'

import '../vendor/jquery-xdr.js'
import '../utils/abilities.coffee'
import '../utils/collection.coffee'
import '../utils/image-loader.coffee'
import '../utils/warnings.coffee'
import '../utils/messages.coffee'
import '../utils.coffee'
import '../settings.coffee'
import '../locale/en.js.coffee'
import '../locale.coffee'

import '../templates.coffee'

import '../stylesheets.coffee'

import '../vendor/jquery-jcrop.js'
import '../ui/crop-widget.coffee'
import '../files/base.coffee'
import '../utils/image-processor.coffee'
import '../files/object.coffee'
import '../files/input.coffee'

import '../vendor/pusher.js'
import '../utils/pusher.coffee'
import '../files/url.coffee'
import '../files/uploaded.coffee'
import '../files/group.coffee'
import '../files.coffee'
import '../widget/dragdrop.coffee'
import '../ui/progress.coffee'
import '../widget/template.coffee'
import '../widget/tabs/file-tab.coffee'
import '../widget/tabs/url-tab.coffee'
import '../widget/tabs/camera-tab.coffee'
import '../widget/tabs/remote-tab.coffee'
import '../widget/tabs/base-preview-tab.coffee'
import '../widget/tabs/preview-tab.coffee'

import '../vendor/jquery-ordering.js'
import '../widget/tabs/preview-tab-multiple.coffee'
import '../widget/dialog.coffee'
import '../widget/base-widget.coffee'
import '../widget/widget.coffee'
import '../widget/multiple-widget.coffee'
import '../widget/live.coffee'
import '../widget/submit-guard.coffee'
import '../widget/accessibility.coffee'

import uploadcare from '../namespace.coffee'

{expose} = uploadcare

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
