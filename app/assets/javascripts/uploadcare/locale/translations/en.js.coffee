uploadcare.whenReady ->
  uploadcare.namespace 'uploadcare.locale.translations', (ns) ->
    ns.en = 
      'ready': 'Select from:'
      'uploading': 'Uploading... Please wait.'
      'error': 'Error'
      'draghere': 'Drop the file here'
      'buttons':
        'cancel': 'Cancel'
        'remove': 'Remove'
        'url':
          'prompt': 'Enter file url here'