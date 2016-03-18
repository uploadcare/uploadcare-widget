# = require ./_widget.coffee
# = require_directory ../locale

uploadcare.expose('locales', (key for key of uploadcare.locale.translations))
