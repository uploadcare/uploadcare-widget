uploadcare.whenReady ->
  uploadcare.defaults = {
    'locale': @UPLOADCARE_LOCALE or 'en'
    'public-key': @UPLOADCARE_PUBLIC_KEY or undefined
    'upload-url-base': @UPLOADCARE_URL_BASE or 'http://upload.uploadcare.com'
    'adapters': @UPLOADCARE_ADAPTERS or 'file url'
    'pusher-key': '79ae88bd931ea68464d9'
  }
