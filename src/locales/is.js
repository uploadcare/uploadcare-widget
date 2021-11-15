// #
// # Icelandic translations
// #
const translations = {
  uploading: 'Hleð upp... Vinsamlegast bíðið.',
  loadingInfo: 'Hleð upp upplýsingum...',
  errors: {
    default: 'Villa',
    baddata: 'Rangt gildi',
    size: 'Skráin er of stór',
    upload: 'Ekki tókst að hlaða upp skrá',
    user: 'Hætt var við',
    info: 'Ekki tókst að sækja upplýsingar',
    image: 'Myndir eru einungis leyfðar',
    createGroup: 'Ekki tókst að búa til hóp',
    deleted: 'Skrá hefur verið eytt'
  },
  draghere: 'Dragðu skrá hingað',
  file: {
    one: '%1 skrá',
    other: '%1 skráa'
  },
  buttons: {
    cancel: 'Hætta við',
    remove: 'Fjarlægja',
    choose: {
      files: {
        one: 'Veldu skrá',
        other: 'Veldu skrár'
      },
      images: {
        one: 'Veldu mynd',
        other: 'Veldu myndir'
      }
    }
  },
  dialog: {
    close: 'Loka',
    openMenu: 'Opna valmynd',
    done: 'Búið',
    showFiles: 'Sjá skrár',
    tabs: {
      names: {
        'empty-pubkey': 'Velkomin/n/ð',
        preview: 'Forskoðun',
        file: 'Staðbundnar skrár',
        url: 'Beinn hlekkur',
        camera: 'Myndavél',
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
        drag: 'dragðu & slepptu<br>skrám',
        nodrop: 'Hlaða upp þínum skrám',
        cloudsTip: 'Skýjaþjónustur<br>og samfélagsmiðlar',
        or: 'eða',
        button: 'Veldu staðbundna skrá',
        also: 'eða veldu'
      },
      url: {
        title: 'Skrár af netinu',
        line1: 'Sæktu hvaða skrá sem er frá netinu',
        line2: 'Settu bara inn hlekk',
        input: 'Límdu hlekkinn hér...',
        button: 'Hlaða upp'
      },
      camera: {
        title: 'Skrá frá myndavél',
        capture: 'Taktu mynd',
        mirror: 'Spegill',
        startRecord: 'Taktu upp myndband',
        stopRecord: 'Stopp',
        cancelRecord: 'Hætta við',
        retry: 'Biðja aftur um heimild',
        pleaseAllow: {
          title: 'Vinsamlegast gefðu heimild til þess að nota myndavélina',
          text:
            'Þú hefur verið beðin/n/ð um að gefa heimild til myndavélanotkunar frá þessari síðu<br>' +
            'Til þess að geta tekið myndir er nauðsynlegt að gefa heimild.'
        },
        notFound: {
          title: 'Engin myndavél fannst.',
          text: 'Það lítur út fyrir að það sé engin myndavél tengd.'
        }
      },
      preview: {
        unknownName: 'óþekkt',
        change: 'Hætta við',
        back: 'Bakka',
        done: 'Bæta við',
        unknown: {
          title: 'Hleð upp ... vinsamlegast bíðið eftir forskoðun. ',
          done: 'Sleppa forskoðun og samþykkja'
        },
        regular: {
          title: 'Bæta þessari skrá við?',
          line1: 'Þú ert að fara bæta þessari skrá við.',
          line2: 'Vinsamlegast staðfestið.'
        },
        image: {
          title: 'Bæta þessari mynd við?',
          change: 'Hætta við'
        },
        crop: {
          title: 'Kroppa og bæta þessari mynd við?',
          done: 'Búið',
          free: 'frítt'
        },
        video: {
          title: 'Bæta þessu myndbandi við?',
          change: 'Hætta við'
        },
        error: {
          default: {
            title: 'Úps!',
            text: 'Eitthvað fór úrskeiðis.',
            back: 'Vinsamlegast reyndu aftur'
          },
          image: {
            title: 'Myndir eru einungis leyfðar.',
            text: 'Vinsamlegast reyndu aftur.',
            back: 'Velja mynd'
          },
          size: {
            title: 'Skráin er of stór.',
            text: 'Vinsamlegast reyndu aftur.'
          },
          loadImage: {
            title: 'Villa',
            text: 'Gat ekki hlaðið upp mynd.'
          }
        },
        multiple: {
          title: 'Þú hefur valið %files%.',
          question: 'Bæta við %files%?',
          tooManyFiles: 'Þú hefur valið of margar skrár. %max% er hámarkið.',
          tooFewFiles:
            'Þú hefur valið %files%. Að minnsta kosti %min% er lágmarkið.',
          clear: 'Fjarlægja allar skrár',
          done: 'Bæta við',
          file: {
            preview: 'Forskoða %file%',
            remove: 'Fjarlægja %file%'
          }
        }
      }
    }
  }
}

// Pluralization rules taken from:
// https://unicode.org/cldr/charts/34/supplemental/language_plural_rules.html
const pluralize = function (n) {
  if (n === 1) {
    return 'one'
  }
  return 'other'
}

export default { pluralize, translations }
