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
      tabs:
        file: 'Mój komputer'
        url: 'Pliki z sieci'
