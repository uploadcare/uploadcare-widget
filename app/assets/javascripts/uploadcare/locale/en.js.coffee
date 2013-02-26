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
        tabs:
          file:
            drag: 'Drop a file here'
            or: 'or'
            button: 'Choose a file from your computer'
            also: 'You can also choose it from'
            tabNames:
              facebook: 'Facebook'
              dropbox: 'Dropbox'
              gdrive: 'Google Drive'
              instagram: 'Instagram'
              url: 'Arbitrary Links'
          url:
            title: 'Files from the Web'
            line1: 'Grab any file off the web.'
            line2: 'Just provide the link.'
            input: 'Paste your link here...'
            button: 'Upload'
          preview:
            unknownName: 'unknown'
            change: 'Change file'
            back: 'Back'
            done: 'Select'
            unknown:
              title: 'Uploading. Please wait for a preview.'
              done: 'Skip preview and accept'
            regular:
              title: 'Upload this file?'
              line1: 'You are about to upload the file above.'
              line2: 'Please confirm.'
            image:
              title: 'Upload this image?'
              change: 'Change image'
            error:
              default:
                title: 'Uploading failed'
                line1: 'Something went wrong during uploading.'
                line2: 'Please try again.'
              image:
                title: 'Images only'
                line1: 'Only image files can be accepted.'
                line2: 'Please try again with another file.'
              size:
                title: 'Size limit'
                line1: 'The file you selected exceed the 100MB limit.'
                line2: 'Please try again with another file.'
        footer:
          text: 'Uploading, Storing and Processing files by'
          link: 'Uploadcare.com'


  # Pluralization rules taken from:
  # http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
  uploadcare.namespace 'uploadcare.locale.pluralize', (ns) ->
    ns.en = (n) ->
      return 'one' if n == 1
      'other'
