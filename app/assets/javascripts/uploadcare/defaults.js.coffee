uploadcare.whenReady ->
  uploadcare.defaults = {
    locale: window.UPLOADCARE_LOCALE or 'en'
    publicKey: window.UPLOADCARE_PUBLIC_KEY or undefined
    urlBase: window.UPLOADCARE_URL_BASE or 'https://upload.uploadcare.com'
    socialBase: window.UPLOADCARE_SOCIAL_BASE or 'https://social.uploadcare.com'
    tabs: window.UPLOADCARE_TABS or 'url file instagram'
    pusherKey: window.UPLOADCARE_PUSHER_KEY or '79ae88bd931ea68464d9'
  }

# lazy loaded function
uploadcare.debug = (args...) -> uploadcare.jQuery(uploadcare).trigger('uploadcare.debug', [args])

