// #
// # Please, do not use this locale as a reference for new translations.
// # It could be outdated or incomplete. Always use the latest English versions:
// # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
// #
// # Any fixes are welcome.
// #
const translations = {
  uploading: 'Uploader... Vent venligst.',
  loadingInfo: 'Henter information...',
  errors: {
    default: 'Fejl',
    baddata: 'Forkert værdi',
    size: 'Filen er for stor',
    upload: 'Kan ikke uploade / sende fil',
    user: 'Upload fortrudt',
    info: 'Kan ikke hente information',
    image: 'Kun billeder er tilladt',
    createGroup: 'Kan ikke oprette fil gruppe',
    deleted: 'Filen blev slettet'
  },
  draghere: 'Drop en fil her',
  file: {
    one: '%1 fil',
    other: '%1 filer'
  },
  buttons: {
    cancel: 'Annuller',
    remove: 'Fjern',
    choose: {
      files: {
        one: 'Vælg en fil',
        other: 'Vælg filer'
      },
      images: {
        one: 'Vælg et billede',
        other: 'Vælg billeder'
      }
    }
  },
  dialog: {
    done: 'Færdig',
    showFiles: 'Vis filer',
    tabs: {
      names: {
        preview: 'Vis',
        file: 'Computer',
        gdrive: 'Google Drev',
        url: 'Direkte link'
      },
      file: {
        drag: 'Drop en fil her',
        nodrop: 'Hent filer fra din computer',
        or: 'eller',
        button: 'Hent fil fra din computer',
        also: 'Du kan også hente fra'
      },
      url: {
        title: 'Filer fra en Web adresse',
        line1: 'Vælg en fil fra en web adresse.',
        line2: 'Skriv bare linket til filen.',
        input: 'Indsæt link her...',
        button: 'Upload / Send'
      },
      preview: {
        unknownName: 'ukendt',
        change: 'Annuller',
        back: 'Tilbage',
        done: 'Fortsæt',
        unknown: {
          title: 'Uploader / sender... Vent for at se mere.',
          done: 'Fortsæt uden at vente på resultat'
        },
        regular: {
          title: 'Tilføje fil?',
          line1: 'Du er ved at tilføje filen ovenfor.',
          line2: 'Venligst accepter.'
        },
        image: {
          title: 'Tilføj billede?',
          change: 'Annuller'
        },
        crop: {
          title: 'Beskær og tilføj dette billede',
          done: 'Udfør'
        },
        error: {
          default: {
            title: 'Hov!',
            text: 'Noget gik galt under upload.',
            back: 'Venligst prøv igen'
          },
          image: {
            title: 'Du kan kun vælge billeder.',
            text: 'Prøv igen med en billedfil.',
            back: 'Vælg billede'
          },
          size: {
            title: 'Den fil du valgte, er desværre større end tilladt.',
            text: 'Venligst prøv med en mindre fil.'
          },
          loadImage: {
            title: 'Fejl',
            text: 'Kan ikke åbne billede'
          }
        },
        multiple: {
          title: 'Du har valgt %files% filer',
          question: 'Vil du tilføje alle disse filer?',
          tooManyFiles: 'Du har valgt for mange filer. %max% er maximum.',
          tooFewFiles:
            'Du har valgt %files% filer. Men du skal vælge mindst %min%.',
          clear: 'Fjern alle',
          done: 'Fortsæt'
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
