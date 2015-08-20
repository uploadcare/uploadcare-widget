##
## Please, do not use this locale as a reference for new translations.
## It could be outdated or incomplete. Always use the latest English versions:
## https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js.coffee
##
## Any fixes are welcome.
##

uploadcare.namespace 'locale.translations', (ns) ->
  ns.pl =
    uploading: 'Przesyłanie... Proszę czekać.'
    errors:
      default: 'Błąd'
    draghere: 'Upuść plik tutaj'
    buttons:
      cancel: 'Anuluj'
      remove: 'Usuń'
    dialog:
      tabs:
        file:
          title: 'Mój komputer'
        url:
          title: 'Pliki z sieci'


uploadcare.namespace 'locale.pluralize', (ns) ->
  ns.pl = (n) ->
    return 'one' if n == 1
    return 'few' if (n % 10 in [2..4]) && (n % 100 not in [12..14])
    return 'many' if (n != 1) && (n % 10 not in [2..4] || n % 100 in [12..14])
    'other'
