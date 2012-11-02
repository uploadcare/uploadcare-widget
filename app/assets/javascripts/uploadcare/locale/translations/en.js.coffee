uploadcare.whenReady ->
  uploadcare.namespace 'uploadcare.locale.translations', (ns) ->
    ns.en =
      ready: 'Upload from'
      uploading: 'Uploading... Please wait.'
      error: 'Error'
      draghere: 'Drop the file here'
      buttons:
        cancel: 'Cancel'
        remove: 'Remove'
        file: 'Upload from Computer'
      tabs:
        file: 'My computer'
        url: 'Files from the Web'
