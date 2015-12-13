# = require ./boot
# = require ./utils
# = require ./settings
# = require ./locale
# = require ./templates
# = require_directory ./templates
# = require ./stylesheets
# = require ./ui/crop-widget
# = require ./widget/base-widget
# = require ./widget/live
# = require ./widget/submit-guard
# = require ./widget/accessibility

{expose} = uploadcare

expose('globals', uploadcare.settings.common)
expose('start')
expose('initialize')
expose('fileFrom')
expose('filesFrom')
expose('FileGroup')
expose('loadFileGroup')
expose('locales', (key for own key of uploadcare.locale.translations))
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
