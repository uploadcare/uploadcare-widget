# = require ../boot.coffee.erb
# = require ../utils.coffee
# = require ../settings.coffee
# = require ../locale.coffee
# = require ../templates.coffee
# = require ../stylesheets.coffee
# = require ../ui/crop-widget.coffee
# = require ../widget/base-widget.coffee
# = require ../widget/live.coffee
# = require ../widget/submit-guard.coffee
# = require ../widget/accessibility.coffee

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
