uploadcare.whenReady ->
  uploadcare.defaults =
    locale: window.UPLOADCARE_LOCALE
    translations: window.UPLOADCARE_LOCALE_TRANSLATIONS
    pluralize: window.UPLOADCARE_LOCALE_PLURALIZE

    publicKey: window.UPLOADCARE_PUBLIC_KEY or undefined
    pusherKey: window.UPLOADCARE_PUSHER_KEY or '79ae88bd931ea68464d9'

    urlBase: window.UPLOADCARE_URL_BASE or 'https://upload.uploadcare.com'
    socialBase: window.UPLOADCARE_SOCIAL_BASE or 'https://social.uploadcare.com'

    tabs: window.UPLOADCARE_TABS or 'url file facebook instagram'
    multiple: false
    imagesOnly: undefined
