
// #
// # Please, do not use this locale as a reference for new translations.
// # It could be outdated or incomplete. Always use the latest English versions:
// # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
// #
// # Any fixes are welcome.
// #
const translate = {
  uploading: 'Nahrávám... Malý moment.',
  loadingInfo: 'Nahrávám informace...',
  errors: {
    default: 'Chyba',
    baddata: 'Neplatná hodnota',
    size: 'Soubor je příliš velký',
    upload: 'Nelze nahrát',
    user: 'Nahrávání zrušeno',
    info: 'Nelze nahrát informace',
    image: 'Lze nahrát pouze obrázky',
    createGroup: 'Nelze vytvořit adresář',
    deleted: 'Soubor byl smazán'
  },
  draghere: 'Přetáhněte soubor sem',
  file: {
    one: '%1 soubor',
    few: '%1 soubory',
    many: '%1 souborů'
  },
  buttons: {
    cancel: 'Zrušit',
    remove: 'Odstranit',
    choose: {
      files: {
        one: 'Vyberte soubor',
        other: 'Vyberte soubory'
      },
      images: {
        one: 'Vyberte obrázek',
        other: 'Vyberte obrázky'
      }
    }
  },
  dialog: {
    done: 'Hotovo',
    showFiles: 'Zobrazit soubory',
    tabs: {
      names: {
        'empty-pubkey': 'Vítejte',
        preview: 'Náhled',
        file: 'Soubor z počítače',
        url: 'Soubor z internetu',
        camera: 'Webkamera',
        facebook: 'Facebook',
        dropbox: 'Dropbox',
        gdrive: 'Google Drive',
        instagram: 'Instagram',
        vk: 'VK',
        evernote: 'Evernote',
        box: 'Box',
        onedrive: 'OneDrive',
        flickr: 'Flickr',
        huddle: 'Huddle'
      },
      file: {
        drag: 'Přetáhněte soubor sem',
        nodrop: 'Nahrajte soubory z vašeho počítače',
        cloudsTip: 'Cloudové úložiště<br>a sociální sítě',
        or: 'nebo',
        button: 'Vyberte soubor z počítače',
        also: 'Můžete také nahrát soubor z'
      },
      url: {
        title: 'Soubory z internetu',
        line1: 'Nahrajte jakýkoliv soubor z internetu.',
        line2: 'Stačí vložit odkaz.',
        input: 'Odkaz vložte zde...',
        button: 'Nahrát'
      },
      camera: {
        capture: 'Pořídit fotografii',
        mirror: 'Zrcadlo',
        retry: 'Znovu požádat o povolení',
        pleaseAllow: {
          title: 'Prosím povolte přístup k webkameře',
          text: 'Byl(a) jste požádán(a) o přístup k webkameře. ' + 'Abyste mohl(a) pořídit fotografii, musíte přístup povolit.'
        },
        notFound: {
          title: 'Nebyla nalezena webkamera',
          text: 'Zdá se, že k tomuto zařízení není připojena žádná webkamera.'
        }
      },
      preview: {
        unknownName: 'neznámý',
        change: 'Zrušit',
        back: 'Zpět',
        done: 'Přidat',
        unknown: {
          title: 'Nahrávám... Prosím vyčkejte na náhled.',
          done: 'Přeskočit náhled a odeslat'
        },
        regular: {
          title: 'Přidat tento soubor?',
          line1: 'Tímto přidáte výše vybraný soubor.',
          line2: 'Prosím potvrďte.'
        },
        image: {
          title: 'Přidat tento obrázek?',
          change: 'Zrušit'
        },
        crop: {
          title: 'Oříznout a přidat tento obrázek',
          done: 'Hotovo',
          free: 'zdarma'
        },
        error: {
          default: {
            title: 'Jejda!',
            text: 'Něco se v průběhu nahrávání nepodařilo.',
            back: 'Zkuste to prosím znovu.'
          },
          image: {
            title: 'Lze nahrávat pouze obrázky.',
            text: 'Zkuste to prosím s jiným souborem.',
            back: 'Vyberte obrázek'
          },
          size: {
            title: 'Soubor přesahuje povolenou velikost.',
            text: 'Prosím zkuste to s jiným souborem.'
          },
          loadImage: {
            title: 'Chyba',
            text: 'Nelze nahrát obrázek'
          }
        },
        multiple: {
          title: 'Bylo vybráno %files% souborů',
          question: 'Chcete přidat všechny tyto soubory?',
          tooManyFiles: 'Bylo vybráno moc souborů. Maximum je %max%',
          tooFewFiles: 'Bylo vybráno %files% souborů. Musíte vybrat minimálně %min%',
          clear: 'Odstranit vše',
          done: 'Hotovo'
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
  } else if ((n >= 2 && n <= 4)) {
    return 'few'
  } else {
    return 'many'
  }
}

export { translate, pluralize }
