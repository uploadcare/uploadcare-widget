
// #
// # Please, do not use this locale as a reference for new translations.
// # It could be outdated or incomplete. Always use the latest English versions:
// # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
// #
// # Any fixes are welcome.
// #
const translate = {
  uploading: 'Przesyłanie... Proszę czekać.',
  loadingInfo: 'Ładowanie...',
  errors: {
    default: 'Błąd',
    baddata: 'Niepoprawna wartość',
    size: 'Plik zbyt duży',
    upload: 'Nie udało się przesłać',
    user: 'Przesyłanie anulowane',
    info: 'Nie udało się załadować informacji',
    image: 'Dozwolone są tylko obrazy',
    createGroup: 'Nie udało się utworzyć grupy plików',
    deleted: 'Plik został usunięty'
  },
  draghere: 'Upuść plik tutaj',
  file: {
    one: '%1 plik',
    few: '%1 pliki',
    many: '%1 plików'
  },
  buttons: {
    cancel: 'Anuluj',
    remove: 'Usuń',
    choose: {
      files: {
        one: 'Wybierz plik',
        other: 'Wybierz pliki'
      },
      images: {
        one: 'Wybierz obraz',
        other: 'Wybierz obrazy'
      }
    }
  },
  dialog: {
    close: 'Zamknij',
    openMenu: 'Otwórz menu',
    done: 'Wykonano',
    showFiles: 'Pokaż pliki',
    tabs: {
      names: {
        'empty-pubkey': 'Witaj',
        preview: 'Podgląd',
        file: 'Pliki lokalne',
        url: 'Plik z Sieci',
        camera: 'Aparat'
      },
      file: {
        drag: 'Upuść plik tutaj',
        nodrop: 'Prześlij pliki z Twojego komputera',
        cloudsTip: 'Dane w chmurze<br>i sieci społecznościowe',
        or: 'lub',
        button: 'Wybierz plik lokalny',
        also: 'Możesz również wybrać z'
      },
      url: {
        title: 'Pliki z Sieci',
        line1: 'Złap jakikolwiej plik z sieci.',
        line2: 'Podaj adres.',
        input: 'Wklej link...',
        button: 'Prześlij'
      },
      camera: {
        title: 'Plik z kamery internetowej',
        capture: 'Zrób zdjęcie',
        mirror: 'Odbicie lustrzane',
        startRecord: 'Nagraj film',
        stopRecord: 'Zakończ',
        cancelRecord: 'Anuluj',
        retry: 'Poproś ponownie o dostęp',
        pleaseAllow: {
          title: 'Prośba o udostępnienie aparatu',
          text: 'Zostałeś poproszony przez tę stronę o dostęp do aparatu. ' + 'Aby robić zdjecia, musisz zaakceptować tę prośbę.'
        },
        notFound: {
          title: 'Nie wykryto aparatu.',
          text: 'Wygląda na to, że nie masz podłączonego aparatu do tego urządzenia.'
        }
      },
      preview: {
        unknownName: 'nieznany',
        change: 'Anuluj',
        back: 'Wstecz',
        done: 'Dodaj',
        unknown: {
          title: 'Przesyłanie... Proszę czekać na podgląd.',
          done: 'Omiń podgląd i zaakceptuj.'
        },
        regular: {
          title: 'Dodać ten plik?',
          line1: 'Zamierzasz dodać nowy plik.',
          line2: 'Potwierdź, proszę.'
        },
        image: {
          title: 'Dodać ten obraz?',
          change: 'Anuluj'
        },
        crop: {
          title: 'Przytnij i dodaj ten obraz',
          done: 'Wykonano',
          free: 'wolny'
        },
        video: {
          title: 'Dodać ten film?',
          change: 'Anuluj'
        },
        error: {
          default: {
            title: 'Oops!',
            text: 'Coś poszło nie tak podczas przesyłania.',
            back: 'Spróbuj ponownie'
          },
          image: {
            title: 'Akceptowane są tylko obrazy.',
            text: 'Spróbuj ponownie z innym plikiem.',
            back: 'Wybierz obraz'
          },
          size: {
            title: 'Plik, który wybrałeś, przekracza dopuszczalny rozmiar',
            text: 'Spróbuj ponownie z innym plikiem.'
          },
          loadImage: {
            title: 'Błąd',
            text: 'Nie udało się załadować obrazu'
          }
        },
        multiple: {
          title: 'Wybrałeś %files%',
          question: 'Czy chcesz dodać wszystkie te pliki?',
          tooManyFiles: 'Wybrałeś zbyt wiele plików. Maksimum to %max%.',
          tooFewFiles: 'Wybrałeś %files%. Wymagane jest co najmniej %min%.',
          clear: 'Usuń wszystkie',
          done: 'Wykonano',
          file: {
            preview: 'Zobacz %file%',
            remove: 'Usuń %file%'
          }
        }
      }
    }
  }
}

// Pluralization rules taken from:
// http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
const pluralize = function (n) {
  var ref
  if (n === 1) {
    return 'one'
  } else if ((((ref = n % 10) >= 2 && ref <= 4)) && ((n / 10 % 10 | 0) !== 1)) {
    return 'few'
  } else {
    return 'many'
  }
}

export { translate, pluralize }
