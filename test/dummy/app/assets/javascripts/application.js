// = require uploadcare/widget
UPLOADCARE_PUBLIC_KEY = 'demopublickey';
UPLOADCARE_URL_BASE = 'https://upload.staging0.uploadcare.com';
UPLOADCARE_PUSHER_KEY = 'a2dfe15c549a403f58ee';

// UPLOADCARE_SOCIAL_BASE = 'http://0.0.0.0:5000';
UPLOADCARE_SOCIAL_BASE = 'http://social.staging0.uploadcare.com/'
UPLOADCARE_CDN_BASE = 'http://staging0.ucarecdn.com/'

setTimeout(function() {
    uploadcare.jQuery(uploadcare).on('uploadcare.debug', function(e, args){
        console.log(args);
    });
}, 1000);


