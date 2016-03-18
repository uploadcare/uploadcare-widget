# = require ../boot.coffee.erb
# = require ../utils.coffee
# = require ../settings.coffee
# = require ../locale.coffee
# = require ../files.coffee

{expose} = uploadcare

expose('globals', uploadcare.settings.common)
expose('start')
expose('initialize')
expose('fileFrom')
expose('filesFrom')
expose('FileGroup')
expose('loadFileGroup')
expose('locales', (key for key of uploadcare.locale.translations))
