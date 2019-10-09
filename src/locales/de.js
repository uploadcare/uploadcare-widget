
// #
// # Please, do not use this locale as a reference for new translations.
// # It could be outdated or incomplete. Always use the latest English versions:
// # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
// #
// # Any fixes are welcome.
// #

const translations = {
  uploading: 'Upload läuft… Bitte warten…',
  loadingInfo: 'Informationen werden geladen…',
  errors: {
    default: 'Fehler',
    baddata: 'Falscher Wert',
    size: 'Datei zu groß',
    upload: 'Kann nicht hochgeladen werden',
    user: 'Hochladen abgebrochen',
    info: 'Informationen können nicht geladen werden',
    image: 'Nur Bilder sind erlaubt',
    createGroup: 'Datei-Gruppe kann nicht erstellt werden',
    deleted: 'Datei wurde gelöscht'
  },
  draghere: 'Ziehen Sie eine Datei hierhin',
  file: {
    one: '%1 Datei',
    other: '%1 Dateien'
  },
  buttons: {
    cancel: 'Abbrechen',
    remove: 'Löschen',
    choose: {
      files: {
        one: 'Datei auswählen',
        other: 'Dateien auswählen'
      },
      images: {
        one: 'Bild auswählen',
        other: 'Bilder auswählen'
      }
    }
  },
  dialog: {
    close: 'Schließen',
    openMenu: 'Menü öffnen',
    done: 'Fertig',
    showFiles: 'Dateien anzeigen',
    tabs: {
      names: {
        'empty-pubkey': 'Willkommen',
        preview: 'Vorschau',
        file: 'Lokale Dateien',
        url: 'Web-Links',
        camera: 'Kamera'
      },
      file: {
        drag: 'Ziehen Sie eine Datei hierhin',
        nodrop: 'Laden Sie Dateien von Ihrem PC hoch',
        cloudsTip: 'Cloud-Speicher<br>und soziale Dienste',
        or: 'oder',
        button: 'Wählen Sie eine Datei',
        also: 'Sie können sie auch Dateien wählen aus'
      },
      url: {
        title: 'Eine Datei aus dem Web hochladen',
        line1: 'Sie können eine Datei aus dem Internet hochladen.',
        line2: 'Geben Sie hier einfach den Link ein.',
        input: 'Bitte geben Sie hier den Link ein…',
        button: 'Hochladen'
      },
      camera: {
        capture: 'Machen Sie ein Foto',
        mirror: 'Andere Kamera',
        retry: 'Berechtigungen erneut anfordern',
        pleaseAllow: {
          title: 'Bitte erlauben Sie den Zugriff auf Ihre Kamera',
          text: 'Sie wurden gebeten, dieser Website den Zugriff auf Ihre Kamera zu erlauben. Um mit Ihrer Kamera Fotos machen zu können, müssen Sie diese Erlaubnis erteilen.'
        },
        notFound: {
          title: 'Keine Kamera gefunden',
          text: 'Es sieht so aus, als hätten Sie keine Kamera an dieses Gerät angeschlossen.'
        }
      },
      preview: {
        unknownName: 'nicht bekannt',
        change: 'Abbrechen',
        back: 'Zurück',
        done: 'Hinzufügen',
        unknown: {
          title: 'Upload läuft… Bitte warten Sie auf die Vorschau.',
          done: 'Vorschau überspringen und Datei annehmen'
        },
        regular: {
          title: 'Diese Datei hinzufügen?',
          line1: 'Diese Datei wird nun hinzugefügt.',
          line2: 'Bitte bestätigen Sie.'
        },
        image: {
          title: 'Nur Bilder sind akzeptiert.',
          text: 'Bitte veruschen Sie es erneut mit einer anderen Datei.',
          back: 'Bild wählen'
        },
        error: {
          default: {
            title: 'Oops!',
            text: 'Etwas ist während dem Hochladen schief gelaufen.',
            back: 'Bitte versuchen Sie es erneut'
          },
          image: {
            title: 'Nur Bilder sind akzeptiert.',
            text: 'Bitte veruschen Sie es erneut mit einer anderen Datei.',
            back: 'Bild wählen'
          },
          size: {
            title: 'Die gewählte Datei ist zu groß.',
            text: 'Bitte versuchen Sie es erneut mit einer anderen Datei.'
          },
          loadImage: {
            title: 'Fehler',
            text: 'Das Bild kann nicht geladen werden'
          }
        },
        multiple: {
          title: 'Sie haben %files% Dateien gewählt',
          question: 'Möchten Sie all diese Dateien hinzufügen?',
          tooManyFiles: 'Sie haben zu viele Dateien gewählt. %max% ist das Maximum.',
          tooFewFiles: 'Sie haben %files% Dateien gewählt. Es sind mindestens %min% nötig.',
          clear: 'Alle löschen',
          done: 'Fertig',
          file: {
            preview: 'Vorschau: %file%',
            remove: 'Datei löschen: %file%'
          }
        }
      }
    }
  }
}

// Pluralization rules taken from:
// http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
const pluralize = function (n) {
  if (n === 1) {
    return 'one'
  }
  return 'other'
}

export { translations, pluralize }
