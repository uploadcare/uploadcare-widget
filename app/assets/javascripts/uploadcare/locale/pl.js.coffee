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
        file: 'Komputer'
      dialog:
        tabs:
          file:
            title: 'Mój komputer'
          url:
            title: 'Pliki z sieci'


  uploadcare.namespace 'uploadcare.locale.pluralize', (ns) ->
    ns.en = (n) ->
      return 0 if n == 0
      return 1 if n == 1
      return 2 if (n % 10 >= 2) && (n % 10 <= 4) && (n % 100 < 10 || n % 100 >= 20)
      'n'
