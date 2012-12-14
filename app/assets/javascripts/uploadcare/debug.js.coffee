uploadcare.debug = (args...) ->
  uploadcare.jQuery(uploadcare).trigger('uploadcare.debug', [args])
