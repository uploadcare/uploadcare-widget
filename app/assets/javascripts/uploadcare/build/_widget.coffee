import '../boot'

# todo wtf is this??
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

# todo import all in templates
import '../templates'

# todo after templates
import '../stylesheets'

# todo wtf is this 
import '../vendor/jquery-jcrop'
import '../ui/crop-widget'
import '../files/base'
import '../utils/image-processor'
import '../files/object'
import '../files/input'

# todo wtf is this??
import '../vendor/pusher'
import '../utils/pusher'
import '../files/url'
import '../files/uploaded'
import '../files/group'
import '../files'
import '../widget/dragdrop'
import '../ui/progress'
import '../widget/template'
import '../widget/tabs/file-tab'
import '../widget/tabs/url-tab'
import '../widget/tabs/camera-tab'
import '../widget/tabs/remote-tab'
import '../widget/tabs/base-preview-tab'
import '../widget/tabs/preview-tab'

# todo wtf is this
import '../vendor/jquery-ordering'
import '../widget/tabs/preview-tab-multiple'
import '../widget/dialog'
import '../widget/base-widget'
import '../widget/widget'
import '../widget/multiple-widget'
import '../widget/live'
import '../widget/submit-guard'
import '../widget/accessibility'

import uploadcare from '../namespace'

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
