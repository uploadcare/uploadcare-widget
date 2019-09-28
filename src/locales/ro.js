
// #
// # Please, do not use this locale as a reference for new translations.
// # It could be outdated or incomplete. Always use the latest English versions:
// # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
// #
// # Any fixes are welcome.
// #
const translate = {
  uploading: 'Se încarcă... Răbdare.',
  loadingInfo: 'Info încărcare...',
  errors: {
    default: 'Eroare',
    baddata: 'Valoare incorectă',
    size: 'Fișier prea mare',
    upload: 'Nu pot încărca',
    user: 'Încărcare anulată',
    info: 'Nu pot încărca info',
    image: 'Doar imagini, vă rog',
    createGroup: 'Nu pot crea grup de fișiere',
    deleted: 'Fișierul a fost șters'
  },
  draghere: 'Trage un fișier aici',
  file: {
    one: '%1 fișier',
    other: '%1 fișiere'
  },
  buttons: {
    cancel: 'Anulare',
    remove: 'Șterge',
    choose: {
      files: {
        one: 'Alege un fișier',
        other: 'Alege fișiere'
      },
      images: {
        one: 'Alege o imagine',
        other: 'Alege imagini'
      }
    }
  },
  dialog: {
    close: 'Închide',
    openMenu: 'Deschide meniu',
    done: 'Gata',
    showFiles: 'Arată fișiere',
    tabs: {
      names: {
        'empty-pubkey': 'Bine ai venit',
        preview: 'Previzualizare',
        file: 'Fișiere locale',
        url: 'Link direct',
        camera: 'Camera',
        facebook: 'Facebook',
        dropbox: 'Dropbox',
        gdrive: 'Google Drive',
        gphotos: 'Google Photos',
        instagram: 'Instagram',
        vk: 'VK',
        evernote: 'Evernote',
        box: 'Box',
        onedrive: 'OneDrive',
        flickr: 'Flickr',
        huddle: 'Huddle'
      },
      file: {
        drag: 'trage aici<br>fișierele',
        nodrop: 'Încarcă fișiere din computer',
        cloudsTip: 'Cloud <br>și rețle sociale',
        or: 'sau',
        button: 'Alege un fișier local',
        also: 'sau alege din'
      },
      url: {
        title: 'Fișiere din Web',
        line1: 'Ia orice fișier din Web.',
        line2: 'Trebuie să ai doar linkul.',
        input: 'Lipește linkul aici...',
        button: 'Încarcă'
      },
      camera: {
        title: 'Fișier din camera web',
        capture: 'Fă o fotografie',
        mirror: 'Mirror',
        startRecord: 'Înregistrează un video',
        stopRecord: 'Stop',
        cancelRecord: 'Anulează',
        retry: 'Cere permisiune din nou',
        pleaseAllow: {
          title: 'Te rog sa-mi dai acces la cameră',
          text: 'Ai fost rugat să dai acces la cameră de acest site.<br>' + 'Pentru a putea face fotografii cu camera, trebuie să aprobi această cerere.'
        },
        notFound: {
          title: 'Nicio cameră detectată',
          text: 'Se pare că nu ai nicio cameră atașată acestui device.'
        }
      },
      preview: {
        unknownName: 'necunoscut',
        change: 'Anulează',
        back: 'Înapoi',
        done: 'Adaugă',
        unknown: {
          title: 'Se încarcă... Te rog așteaptă previzualizarea.',
          done: 'Sari peste previzualizare și acceptă'
        },
        regular: {
          title: 'Adaug acest fișier?',
          line1: 'Ești pe punctul de a adăuga fișierul de mai sus.',
          line2: 'Te rog confirmă.'
        },
        image: {
          title: 'Adaug această imagine?',
          change: 'Anulează'
        },
        crop: {
          title: 'Decupează și adaugă aceasta imagine',
          done: 'Gata',
          free: 'gratis'
        },
        video: {
          title: 'Adaug acest video?',
          change: 'anulează'
        },
        error: {
          default: {
            title: 'Oops!',
            text: 'A intervenit o problemă la încărcare.',
            back: 'te rog încearcă din nou'
          },
          image: {
            title: 'Sunt acceptate doar imagini.',
            text: 'Te rog încearcă din nou cu un alt fișier.',
            back: 'Alege imagine'
          },
          size: {
            title: 'Fișierul selectat de tine este prea mare.',
            text: 'Te rog să încerci cu alt fișier.'
          },
          loadImage: {
            title: 'Eroare',
            text: 'Nu pot încărca imaginea'
          }
        },
        multiple: {
          title: 'Ai ales %files%.',
          question: 'Adaug %files%?',
          tooManyFiles: 'Ai ales prea multe fișiere. %max% is maximum.',
          tooFewFiles: 'Ai ales %files%. Minimul este %min% .',
          clear: 'Șterge toate',
          done: 'Adaugă',
          file: {
            preview: 'Previzualizare %file%',
            remove: 'Șterge %file%'
          }
        }
      }
    },
    footer: {
      text: 'powered by',
      link: 'uploadcare'
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

export { translate, pluralize }
