import '../boot.coffee'

# todo wtf is this??
# import '../vendor/jquery-xdr.coffee'
import '../utils/abilities.coffee'
import '../utils/collection.coffee'
import '../utils/image-loader.coffee'
import '../utils/warnings.coffee'
import '../utils/messages.coffee'
import '../utils.coffee'
import '../settings.coffee'
import '../locale.coffee'
import '../locale/en.coffee'

# todo import all in templates.coffee
# import '../templates.coffee'
# import '../templates/dialog.coffee'
# import '../templates/dialog__panel.coffee'
# import '../templates/icons.coffee'
# import '../templates/progress__text.coffee'
# import '../templates/styles.coffee'
# import '../templates/tab-camera-capture.coffee'
# import '../templates/tab-camera.coffee'
# import '../templates/tab-file.coffee'
# import '../templates/tab-preview-error.coffee'
# import '../templates/tab-preview-image.coffee'
# import '../templates/tab-preview-multiple-file.coffee'
# import '../templates/tab-preview-multiple.coffee'
# import '../templates/tab-preview-regular.coffee'
# import '../templates/tab-preview-unknown.coffee'
# import '../templates/tab-preview-video.coffee'
# import '../templates/tab-url.coffee'
# import '../templates/widget-button.coffee'
# import '../templates/widget-file-name.coffee'
# import '../templates/widget.coffee'

# todo after templates
# import '../stylesheets.coffee'

# todo wtf is this 
# import '../vendor/jquery-jcrop.js'
import '../ui/crop-widget.coffee'
import '../files/base.coffee'
import '../utils/image-processor.coffee'
import '../files/object.coffee'
import '../files/input.coffee'

# import '../vendor/pusher.js'
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
# import '../vendor/jquery-ordering.js'
import '../widget/tabs/preview-tab-multiple.coffee'
import '../widget/dialog.coffee'
import '../widget/base-widget.coffee'
import '../widget/widget.coffee'
import '../widget/multiple-widget.coffee'
import '../widget/live.coffee'
import '../widget/submit-guard.coffee'
import '../widget/accessibility.coffee'

import '../locale/ar.coffee'
import '../locale/az.coffee'
import '../locale/ca.coffee'
import '../locale/cs.coffee'
import '../locale/da.coffee'
import '../locale/de.coffee'
import '../locale/el.coffee'
import '../locale/es.coffee'
import '../locale/et.coffee'
import '../locale/fr.coffee'
import '../locale/he.coffee'
import '../locale/it.coffee'
import '../locale/ja.coffee'
import '../locale/ko.coffee'
import '../locale/lv.coffee'
import '../locale/nb.coffee'
import '../locale/nl.coffee'
import '../locale/pl.coffee'
import '../locale/pt.coffee'
import '../locale/ro.coffee'
import '../locale/ru.coffee'
import '../locale/sk.coffee'
import '../locale/sr.coffee'
import '../locale/sv.coffee'
import '../locale/tr.coffee'
import '../locale/uk.coffee'
import '../locale/vi.coffee'
import '../locale/zh-TW.coffee'
import '../locale/zh.coffee'
import uploadcare from '../namespace.coffee'

{expose} = uploadcare

# expose('globals', uploadcare.settings.common)
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
# expose('Circle', uploadcare.ui.progress.Circle)
expose('SingleWidget')
expose('MultipleWidget')
expose('Widget')
expose('tabsCss')
expose('dragdrop.support')
expose('dragdrop.receiveDrop')
expose('dragdrop.uploadDrop')

export default uploadcare.__exports
