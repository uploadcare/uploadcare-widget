uploadcare.debug = (args...) ->
  uploadcare.jQuery(uploadcare).trigger('log.uploadcare', [args])
