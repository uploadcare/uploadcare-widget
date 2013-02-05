# = require uploadcare/core/boot
# = require uploadcare/debug
# = require uploadcare/utils
# = require uploadcare/defaults
# = require uploadcare/locale
# = require uploadcare/templates
# = require uploadcare/stylesheets
# = require uploadcare/widget/widget
# = require uploadcare/widget/submit-guard
# = require uploadcare/ui/crop/crop-widget

{expose} = uploadcare

expose 'whenReady'
uploadcare.whenReady ->
  expose 'fileFrom'
  expose 'openDialog'
  expose 'Circle', uploadcare.ui.progress.Circle
