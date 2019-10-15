// #
// # Please, do not use this locale as a reference for new translations.
// # It could be outdated or incomplete. Always use the latest English versions:
// # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
// #
// # Any fixes are welcome.
// #
const translations = {
  uploading: 'Carregant... Si us plau esperi.',
  loadingInfo: 'Carregant informació...',
  errors: {
    default: 'Error',
    baddata: 'Valor incorrecte',
    size: 'Massa gran',
    upload: "No s'ha pogut carregar",
    user: 'Carrega cancel·lada',
    info: "No s'ha pogut carregar la informació",
    image: 'Només es permeten imatges',
    createGroup: "No es pot crear el grup d'arxius",
    deleted: 'Fitxer eliminat'
  },
  draghere: 'Arrossega els fitxers fins aquí',
  file: {
    one: '%1 fitxer',
    other: '%1 fitxers'
  },
  buttons: {
    cancel: 'Cancel·lar',
    remove: 'Eliminar',
    choose: {
      files: {
        one: 'Escull un fitxer',
        other: 'Escull fitxers'
      },
      images: {
        one: 'Escull una imatge',
        other: 'Escull imatges'
      }
    }
  },
  dialog: {
    done: 'Fet',
    showFiles: 'Mostra fitxers',
    tabs: {
      names: {
        'empty-pubkey': 'Benvingut',
        preview: 'Avanci',
        file: 'Ordinador',
        url: 'Enllaços arbitraris',
        camera: 'Càmera'
      },
      file: {
        drag: 'Arrossega un fitxer aquí',
        nodrop: 'Carrega fitxers des del teu ordinador',
        cloudsTip: 'Emmagatzematge al núvol<br>i xarxes socials',
        or: 'o',
        button: 'Escull un fitxer des del teu ordinador',
        also: 'També pots seleccionar-lo de'
      },
      url: {
        title: 'Fitxers de la web',
        line1: 'Selecciona qualsevol fitxer de la web.',
        line2: 'Només proporcioni el link.',
        input: 'Copiï el link aquí...',
        button: 'Pujar'
      },
      camera: {
        capture: 'Realitza una foto',
        mirror: 'Mirall',
        retry: 'Demanar permisos una altra vegada',
        pleaseAllow: {
          title: 'Si us plau, permet accés a la teva càmera',
          text:
            "Aquest lloc t'ha demanat de permetre accés a la càmera. " +
            "Per tal de realitzar imatges amb la teva càmera has d'acceptar aquesta petició."
        },
        notFound: {
          title: "No s'ha detectat cap càmera",
          text: 'Sembla que no tens cap càmera connectada a aquest dispositiu.'
        }
      },
      preview: {
        unknownName: 'desconegut',
        change: 'Cancel·lar',
        back: 'Endarrere',
        done: 'Pujar',
        unknown: {
          title: 'Carregant. Si us plau esperi per la visualització prèvia.',
          done: 'Saltar visualització prèvia i acceptar'
        },
        regular: {
          title: 'Vols pujar aquest fitxer?',
          line1: 'Estàs a punt de pujar el fitxer superior.',
          line2: 'Confirmi, si us plau.'
        },
        image: {
          title: 'Vols pujar aquesta imatge?',
          change: 'Cancel·lar'
        },
        crop: {
          title: 'Tallar i pujar aquesta imatge',
          done: 'Fet',
          free: 'lliure'
        },
        error: {
          default: {
            title: 'La pujada ha fallat!',
            text: "S'ha produït un error durant la pujada.",
            back: 'Si us plau, provi-ho de nou.'
          },
          image: {
            title: "Només s'accepten fitxers d'imatges.",
            text: 'Si us plau, provi-ho de nou amb un altre fitxer.',
            back: 'Escull imatge'
          },
          size: {
            title:
              'La mida del fitxer que has seleccionat sobrepassa el límit.',
            text: 'Si us plau, provi-ho de nou amb un altre fitxer.'
          },
          loadImage: {
            title: 'Error',
            text: "No s'ha pogut carregar la imatge"
          }
        },
        multiple: {
          title: "N'has escollit %files%",
          question: 'Vols afegir tots aquests fitxers?',
          tooManyFiles: 'Has escollit massa fitxers. %max% és el màxim.',
          tooFewFiles: 'Has escollit %files%. Com a mínim en calen %min%.',
          clear: 'Eliminar-los tots',
          done: 'Fet'
        }
      }
    }
  }
}

// Pluralization rules taken from:
// http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
const pluralize = function(n) {
  if (n === 1) {
    return 'one'
  }
  return 'other'
}

export { translations, pluralize }
