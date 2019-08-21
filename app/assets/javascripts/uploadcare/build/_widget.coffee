import '../boot.coffee'

# todo wtf is this??
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

# todo import all in templates.coffee
import '../templates.coffee'

# todo after templates
import '../stylesheets.coffee'

# todo wtf is this 
import '../vendor/jquery-jcrop.js'
import '../ui/crop-widget.coffee'
import '../files/base.coffee'
import '../utils/image-processor.coffee'
import '../files/object.coffee'
import '../files/input.coffee'

# todo wtf is this??
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

# todo wtf is this
import '../vendor/jquery-ordering.js'
import '../widget/tabs/preview-tab-multiple.coffee'
import '../widget/dialog.coffee'
import '../widget/base-widget.coffee'
import '../widget/widget.coffee'
import '../widget/multiple-widget.coffee'
import '../widget/live.coffee'
import '../widget/submit-guard.coffee'
import '../widget/accessibility.coffee'

import '../locale/ar.js.coffee'
import '../locale/az.js.coffee'
import '../locale/ca.js.coffee'
import '../locale/cs.js.coffee'
import '../locale/da.js.coffee'
import '../locale/de.js.coffee'
import '../locale/el.js.coffee'
import '../locale/es.js.coffee'
import '../locale/et.js.coffee'
import '../locale/fr.js.coffee'
import '../locale/he.js.coffee'
import '../locale/it.js.coffee'
import '../locale/ja.js.coffee'
import '../locale/ko.js.coffee'
import '../locale/lv.js.coffee'
import '../locale/nb.js.coffee'
import '../locale/nl.js.coffee'
import '../locale/pl.js.coffee'
import '../locale/pt.js.coffee'
import '../locale/ro.js.coffee'
import '../locale/ru.js.coffee'
import '../locale/sk.js.coffee'
import '../locale/sr.js.coffee'
import '../locale/sv.js.coffee'
import '../locale/tr.js.coffee'
import '../locale/uk.js.coffee'
import '../locale/vi.js.coffee'
import '../locale/zh-TW.js.coffee'
import '../locale/zh.js.coffee'

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
