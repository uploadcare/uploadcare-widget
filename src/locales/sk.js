
// #
// # Please, do not use this locale as a reference for new translations.
// # It could be outdated or incomplete. Always use the latest English versions:
// # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
// #
// # Any fixes are welcome.
// #
const translate = {
  uploading: 'Nahrávam... Prosím počkajte.',
  loadingInfo: 'Nahrávam informácie...',
  errors: {
    default: 'Chyba',
    baddata: 'Nesprávna hodnota',
    size: 'Súbor je príliš veľký',
    upload: 'Nedá sa nahrať',
    user: 'Nahrávanie bolo zrušené',
    info: 'Informácie sa nedajú nahrať',
    image: 'Povolené sú len obrázky',
    createGroup: 'Nie je možné vytvoriť priečinok',
    deleted: 'Súbor bol odstránený'
  },
  draghere: 'Sem presuňte súbor',
  file: {
    one: '%1 súbor',
    few: '%1 súbory',
    other: '%1 súborov'
  },
  buttons: {
    cancel: 'Zrušiť',
    remove: 'Odstrániť',
    choose: {
      files: {
        one: 'Vyberte súbor',
        other: 'Vyberte súbory'
      },
      images: {
        one: 'Vyberte obrázok',
        other: 'Vyberte obrázky'
      }
    }
  },
  dialog: {
    close: 'Zavrieť',
    openMenu: 'Otvoriť menu',
    done: 'Hotovo',
    showFiles: 'Ukázať súbory',
    tabs: {
      names: {
        'empty-pubkey': 'Vitajte',
        preview: 'Náhľad',
        file: 'Z počítača',
        url: 'Z internetu',
        camera: 'Kamera',
        facebook: 'Facebook',
        dropbox: 'Dropbox',
        gdrive: 'Disk Google',
        gphotos: 'Google Obrázky',
        instagram: 'Instagram',
        vk: 'VK',
        evernote: 'Evernote',
        box: 'Box',
        onedrive: 'OneDrive',
        flickr: 'Flickr',
        huddle: 'Huddle'
      },
      file: {
        drag: 'presuňte a vložte<br>akékoľvek súbory',
        nodrop: 'Nahrajte súbory z vášho&nbsp;počítača',
        cloudsTip: 'Cloud úložiská<br>a sociálne siete',
        or: 'alebo',
        button: 'Vyberte súbor z počítača',
        also: 'alebo vyberte z'
      },
      url: {
        title: 'Súbory z internetu',
        line1: 'Uložte akýkoľvek súbor z internetu.',
        line2: 'Stačí pridať odkaz na neho.',
        input: 'Vložte svoj odkaz sem...',
        button: 'Nahrať'
      },
      camera: {
        title: 'Súbor z webkamery',
        capture: 'Odfotiť',
        mirror: 'Zrkadliť',
        startRecord: 'Natočte video',
        stopRecord: 'Prestať natáčať',
        cancelRecord: 'Zrušiť',
        retry: 'Znovu požiadať o prístup',
        pleaseAllow: {
          title: 'Prosím povoľte prístup k vašej kamere',
          text: 'Boli ste vyzvaní aby ste umožnili tejto stránke prístup ku kamere.<br>' + 'Prístup musíte povolit aby ste mohli fotiť s vašou kamerou.'
        },
        notFound: {
          title: 'Kamera nebola nájdená',
          text: 'Zdá sa, že k tomuto zariadeniu nemáte pripojenú kameru.'
        }
      },
      preview: {
        unknownName: 'neznámy',
        change: 'Zrušiť',
        back: 'Späť',
        done: 'Pridať',
        unknown: {
          title: 'Nahráva sa... Prosím počkajte na náhľad.',
          done: 'Preskočiť náhľad a nahrať'
        },
        regular: {
          title: 'Pridať tento súbor?',
          line1: 'Chystáte sa pridať vyššie uvedený súbor.',
          line2: 'Prosím potvrďte váš výber.'
        },
        image: {
          title: 'Pridať tento obrázok?',
          change: 'Zrušiť'
        },
        crop: {
          title: 'Orezať a pridať túto fotku',
          done: 'Hotovo',
          free: 'obnoviť'
        },
        video: {
          title: 'Pridať toto video?',
          change: 'Zrušiť'
        },
        error: {
          default: {
            title: 'Ejha!',
            text: 'Pri nahrávaní sa vyskytla chyba.',
            back: 'Skúste to znovu'
          },
          image: {
            title: 'Je možné nahrávať len obrázky',
            text: 'Skúste to znovu s iným súborom.',
            back: 'Vybrať obrázok'
          },
          size: {
            title: 'Súbor, ktorý ste vybrali presahuje povolenú veľkosť.',
            text: 'Skúste to znovu s iným súborom.'
          },
          loadImage: {
            title: 'Chyba',
            text: 'Obrázok nie je možné vyhľadať'
          }
        },
        multiple: {
          title: 'Vybrali ste %files%.',
          question: 'Pridať %files%?',
          tooManyFiles: 'Vybrali ste príliš veľa súborov. Maximum je %max%.',
          tooFewFiles: 'Vybrali ste %files%. Potrebných je aspoň %min%.',
          clear: 'Odstrániť všetky',
          done: 'Pridať',
          file: {
            preview: 'Nahliadnuť na %file%',
            remove: 'Odstrániť %file%'
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
  } else if ((n >= 2 && n <= 4)) {
    return 'few'
  } else {
    return 'many'
  }
}

export { translate, pluralize }
