uploadcare.whenReady ->
  uploadcare.namespace 'uploadcare.locale.translations', (ns) ->
    ns.en =
      ready: 'Upload from'
      uploading: 'Uploading... Please wait.'
      error: 'Error'
      draghere: 'Drop the file here'
      file:
        zero: '0 files'
        one: '1 file'
        two: '2 files'
        few: '%1 files'
        many: '%1 files'
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
  #
  # Note: English locale is used as a fallback and needs translations
  # for all possible pluralization variants: zero, one, two, few, many, other.
  uploadcare.namespace 'uploadcare.locale.pluralize', (ns) ->
    ns.en = (n) ->
      return 'one' if n == 1
      'other'
