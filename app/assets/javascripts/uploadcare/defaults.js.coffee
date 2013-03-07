uploadcare.whenReady ->
  uploadcare.defaults =
    locale: window.UPLOADCARE_LOCALE
    translations: window.UPLOADCARE_LOCALE_TRANSLATIONS
    pluralize: window.UPLOADCARE_LOCALE_PLURALIZE

    publicKey: window.UPLOADCARE_PUBLIC_KEY or undefined
    pusherKey: window.UPLOADCARE_PUSHER_KEY or '79ae88bd931ea68464d9'

    urlBase: window.UPLOADCARE_URL_BASE or 'https://upload.uploadcare.com'
    socialBase: window.UPLOADCARE_SOCIAL_BASE or 'https://social.uploadcare.com'
    cdnBase: window.UPLOADCARE_CDN_BASE or 'https://ucarecdn.com'

    live: if window.UPLOADCARE_LIVE? then window.UPLOADCARE_LIVE else true
    tabs: window.UPLOADCARE_TABS or 'file url facebook dropbox gdrive instagram'
    multiple: false
    imagesOnly: undefined

    crop: if window.UPLOADCARE_CROP? then window.UPLOADCARE_CROP else 'disabled'

    previewStep: if window.UPLOADCARE_PREVIEW_STEP? then window.UPLOADCARE_PREVIEW_STEP else true
