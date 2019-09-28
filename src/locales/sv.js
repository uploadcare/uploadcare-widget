
// #
// # Please, do not use this locale as a reference for new translations.
// # It could be outdated or incomplete. Always use the latest English versions:
// # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
// #
// # Any fixes are welcome.
// #
const translate = {
  uploading: 'Laddar... Var god vänta.',
  loadingInfo: 'Laddar info...',
  errors: {
    default: 'Fel',
    baddata: 'Felaktigt värde',
    size: 'Filen är för stor',
    upload: 'Kan inte ladda upp',
    user: 'Uppladdning avbruten',
    info: 'Kan inte ladda informationen',
    image: 'Endast bilder tillåtna',
    createGroup: 'Kan inte skapa filgrupp',
    deleted: 'Fil raderad'
  },
  draghere: 'Dra filen hit',
  file: {
    one: '%1 fil',
    other: '%1 filer'
  },
  buttons: {
    cancel: 'Avbryt',
    remove: 'Ta bort',
    choose: {
      files: {
        one: 'Välj fil',
        other: 'Välj filer'
      },
      images: {
        one: 'Välj en bild',
        other: 'Välj bilder'
      }
    }
  },
  dialog: {
    done: 'Klar',
    showFiles: 'Visa filer',
    tabs: {
      names: {
        'empty-pubkey': 'Välkommen',
        preview: 'Förhandsgranskning',
        file: 'Lokala filer',
        url: 'Direkta länkar',
        camera: 'Kamera'
      },
      file: {
        drag: 'Släpp filen här',
        nodrop: 'Ladda upp filer från din dator',
        cloudsTip: 'Molnlagring<br>och sociala nätverk',
        or: 'eller',
        button: 'Välj en lokal fil',
        also: 'Du kan också välja den från'
      },
      url: {
        title: 'Filer från webben',
        line1: 'Välj en fil från en webbadress.',
        line2: 'Ange bara länken till filen.',
        input: 'Klistra in din länk här...',
        button: 'Ladda upp'
      },
      camera: {
        capture: 'Ta ett foto',
        mirror: 'Spegel',
        retry: 'Begär tillstånd igen',
        pleaseAllow: {
          title: 'Vänligen ge tillgång till din kamera',
          text: 'Du har uppmanats att tillåta att denna webbplats får tillgång till din kamera.' + 'För att ta bilder med din kamera måste du godkänna denna begäran.'
        },
        notFound: {
          title: 'Ingen kamera hittades',
          text: 'Det verkar som att du inte har någon kamera ansluten till denna enheten.'
        }
      },
      preview: {
        unknownName: 'okänd',
        change: 'Avbryt',
        back: 'Tillbaka',
        done: 'Lägg till',
        unknown: {
          title: 'Laddar... Vänligen vänta på förhandsgranskning.',
          done: 'Skippa förhandsgranskning och acceptera'
        },
        regular: {
          title: 'Lägg till denna filen?',
          line1: 'Du håller på att lägga till filen ovan.',
          line2: 'Vänligen bekräfta.'
        },
        image: {
          title: 'Lägg till denna bilden?',
          change: 'Avbryt'
        },
        crop: {
          title: 'Beskär och lägg till denna bild',
          done: 'Klar',
          free: 'fri'
        },
        error: {
          default: {
            title: 'Oops!',
            text: 'Någonting gick fel under uppladdningen.',
            back: 'Vänligen försök igen'
          },
          image: {
            title: 'Endast bildfiler accepteras.',
            text: 'Vänligen försök igen med en annan fil.',
            back: 'Välj bild'
          },
          size: {
            title: 'Filen du har valt är för stor.',
            text: 'Vänligen försök igen med en annan fil.'
          },
          loadImage: {
            title: 'Fel',
            text: 'Kan inte ladda bild'
          }
        },
        multiple: {
          title: 'Du har valt %files%',
          question: 'Vill du lägga till alla dessa filer?',
          tooManyFiles: 'Du har valt för många filer. %max% är max.',
          tooFewFiles: 'Du har valt %files%. Minst %min% krävs.',
          clear: 'Ta bort alla',
          done: 'Klar'
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

export { translate, pluralize }
