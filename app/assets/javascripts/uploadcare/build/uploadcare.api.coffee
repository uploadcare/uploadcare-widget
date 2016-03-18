# = require ../boot.coffee.erb
# = require ../utils.coffee
# = require ../settings.coffee
# = require ../locale.coffee
# = require ../files.coffee

{expose} = uploadcare

expose('globals', uploadcare.settings.common)
expose('start', uploadcare.settings.common)
expose('fileFrom')
expose('filesFrom')
expose('FileGroup')
expose('loadFileGroup')
expose('locales', (key for own key of uploadcare.locale.translations))
