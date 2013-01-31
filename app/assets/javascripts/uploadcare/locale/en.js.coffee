uploadcare.whenReady ->
  # Note: English locale is the default and used as a fallback.
  uploadcare.namespace 'uploadcare.locale.translations', (ns) ->
    ns.en =
      ready: 'Upload from'
      uploading: 'Uploading... Please wait.'
      errors:
        default: 'Error'
        baddata: 'Incorrect value'
        size: 'Too big'
        upload: 'Can\'t upload' 
        user: 'Upload canceled'
        info: 'Can\'t load info' 
        image: 'Only images allowed'
      draghere: 'Drop the file here'
      file:
        one: '1 file'
        other: '%1 files'
      buttons:
        cancel: 'Cancel'
        remove: 'Remove'
        file: 'Computer'
      dialog:
        title: 'Upload anything from anywhere'
        poweredby: 'Powered by'
        support:
          images: 'Images'
          audio: 'Audio'
          video: 'Video'
          documents: 'Documents'
        tabs:
          file:
            title: 'My computer'
            line1: 'Grab any file off your computer.'
            line2: 'Browse for it in a dialog or drag and drop.'
            button: 'Browse files'
          url:
            title: 'Files from the Web'
            line1: 'Grab any file off the web.'
            line2: 'Just provide the link.'
            input: 'Paste your link here...'
            button: 'Upload'


  # Pluralization rules taken from:
  # http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
  uploadcare.namespace 'uploadcare.locale.pluralize', (ns) ->
    ns.en = (n) ->
      return 'one' if n == 1
      'other'
