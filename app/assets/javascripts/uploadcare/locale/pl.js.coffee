uploadcare.whenReady ->
  uploadcare.namespace 'uploadcare.locale.translations', (ns) ->
    ns.pl =
      ready: 'Prześlij z'
      uploading: 'Przesyłanie... Proszę czekać.'
      error: 'Błąd'
      draghere: 'Upuść plik tutaj'
      buttons:
        cancel: 'Anuluj'
        remove: 'Usuń'
        file: 'Prześlij z komputera'
      dialog:
        tabs:
          file:
            title: 'Mój komputer'
          url:
            title: 'Pliki z sieci'
