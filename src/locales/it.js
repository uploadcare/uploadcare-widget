
// #
// # Please, do not use this locale as a reference for new translations.
// # It could be outdated or incomplete. Always use the latest English versions:
// # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
// #
// # Any fixes are welcome.
// #
const translations = {
  uploading: 'Caricamento in corso... Si prega di attendere.',
  loadingInfo: 'Caricamento informazioni in corso...',
  errors: {
    default: 'Errore',
    baddata: 'Valore errato',
    size: 'Il file è troppo grande',
    upload: 'Impossibile fare l’upload',
    user: 'Upload cancellato',
    info: 'Impossibile caricare le informazioni',
    image: 'Sono ammesse solo immagini',
    createGroup: 'Impossibile creare gruppo di file',
    deleted: 'Il file è stato eliminato'
  },
  draghere: 'Trascina un file qui',
  file: {
    one: 'file %1',
    other: 'file %1'
  },
  buttons: {
    cancel: 'Cancella',
    remove: 'Rimuovi',
    choose: {
      files: {
        one: 'Seleziona un file',
        other: 'Seleziona file'
      },
      images: {
        one: 'Seleziona un’immagine',
        other: 'Seleziona immagini'
      }
    }
  },
  dialog: {
    done: 'Fatto',
    showFiles: 'Mostra file',
    tabs: {
      names: {
        'empty-pubkey': 'Benvenuto',
        preview: 'Anteprima',
        file: 'File locali',
        url: 'Link arbitrari',
        camera: 'Fotocamera'
      },
      file: {
        drag: 'Trascina un file qui',
        nodrop: 'Carica file dal tuo computer',
        cloudsTip: 'Salvataggi nel cloud<br>e servizi sociali',
        or: 'o',
        button: 'Seleziona un file locale',
        also: 'Puoi anche scegliere da'
      },
      url: {
        title: 'File dal web',
        line1: 'Preleva un file dal web.',
        line2: 'È sufficiente fornire il link.',
        input: 'Incolla il tuo link qui...',
        button: 'Carica'
      },
      camera: {
        capture: 'Scatta una foto',
        mirror: 'Specchio',
        retry: 'Richiedi di nuovo le autorizzazioni',
        pleaseAllow: {
          title: 'Consenti l’accesso alla tua fotocamera',
          text: 'Ti è stato richiesto di consentire l’accesso alla fotocamera da questo sito. Per scattare le foto con la tua fotocamera devi accettare questa richiesta.'
        },
        notFound: {
          title: 'Nessuna fotocamera rilevata',
          text: 'Non risulta che tu non abbia una fotocamera collegata a questo dispositivo.'
        }
      },
      preview: {
        unknownName: 'sconosciuto',
        change: 'Cancella',
        back: 'Indietro',
        done: 'Aggiungi',
        unknown: {
          title: 'Caricamento in corso... Attendi l’anteprima.',
          done: 'Salta l’anteprima e accetta'
        },
        regular: {
          title: 'Vuoi aggiungere questo file?',
          line1: 'Stai per aggiungere il file sopra.',
          line2: 'Conferma.'
        },
        image: {
          title: 'Vuoi aggiungere questa immagine?',
          change: 'Cancella'
        },
        crop: {
          title: 'Ritaglia e aggiungi questa immagine',
          done: 'Fatto',
          free: 'gratis'
        },
        error: {
          default: {
            title: 'Ops!',
            text: 'Si è verificato un problema durante l’upload.',
            back: 'Si prega di riprovare'
          },
          image: {
            title: 'Sono accettati solo file immagine.',
            text: 'Riprova con un altro file.',
            back: 'Scegli immagine'
          },
          size: {
            title: 'Il file selezionato supera il limite.',
            text: 'Riprova con un altro file.'
          },
          loadImage: {
            title: 'Errore',
            text: 'Impossibile caricare l’immagine'
          }
        },
        multiple: {
          title: 'Hai selezionato %files%',
          question: 'Vuoi aggiungere tutti questi file?',
          tooManyFiles: 'Hai selezionato troppi file. %max% è il massimo.',
          tooFewFiles: 'Hai selezionato %files%. È richiesto almeno %min%.',
          clear: 'Rimuovi tutto',
          done: 'Fatto'
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
