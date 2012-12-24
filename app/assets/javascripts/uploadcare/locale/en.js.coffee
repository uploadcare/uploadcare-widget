uploadcare.whenReady ->
  uploadcare.namespace 'uploadcare.locale.translations', (ns) ->
    ns.en =
      ready: 'Upload from'
      uploading: 'Uploading... Please wait.'
      error: 'Error'
      draghere: 'Drop the file here'
      file:
        0: 'No files'
        1: '1 file'
        2: '2 files'
        n: '%1 files'
      buttons:
        cancel: 'Cancel'
        remove: 'Remove'
        file: 'Upload from Computer'
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


  uploadcare.namespace 'uploadcare.locale.pluralize', (ns) ->
    ns.en = (n) ->
      switch n
        when 0 then 0
        when 1 then 1
        else 'n'
