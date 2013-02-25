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

    live: window.UPLOADCARE_LIVE or true
    tabs: window.UPLOADCARE_TABS or 'file url facebook dropbox gdrive instagram'
    multiple: false
    imagesOnly: undefined

    cropEnabled: window.UPLOADCARE_CROP_ENABLED or false
    cropSize: window.UPLOADCARE_CROP_SIZE or ''
    cropScale: if window.UPLOADCARE_CROP_SCALE == undefined then true else window.UPLOADCARE_CROP_SCALE
    cropUpscale: window.UPLOADCARE_CROP_UPSCALE or false

