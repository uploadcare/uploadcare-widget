# = require ../vendor/jquery.2.2.4.min.js
# = require ./_widget.coffee
# = require_directory ../locale

uploadcare.jQuery.noConflict(true)

uploadcare.expose('locales', (key for key of uploadcare.locale.translations))
