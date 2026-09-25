// #
// # Please, do not use this locale as a reference for new translations.
// # It could be outdated or incomplete. Always use the latest English versions:
// # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
// #
// # Any fixes are welcome.
// #
const translations = {
  uploading: 'Ladataan... Odota hetki.',
  loadingInfo: 'Ladataan tietoja...',
  errors: {
    default: 'Virhe',
    baddata: 'Virheellinen arvo',
    size: 'Tiedosto on liian suuri',
    upload: 'Lataus ei onnistu',
    user: 'Lataus peruutettu',
    info: 'Tietojen lataus ei onnistu',
    image: 'Vain kuvat ovat sallittuja',
    createGroup: 'Tiedostoryhmän luonti ei onnistu',
    deleted: 'Tiedosto on poistettu'
  },
  draghere: 'Pudota tiedosto tähän',
  file: {
    one: '%1 tiedosto',
    other: '%1 tiedostoa'
  },
  buttons: {
    cancel: 'Peruuta',
    remove: 'Poista',
    choose: {
      files: {
        one: 'Valitse tiedosto',
        other: 'Valitse tiedostot'
      },
      images: {
        one: 'Valitse kuva',
        other: 'Valitse kuvat'
      }
    }
  },
  dialog: {
    close: 'Sulje',
    openMenu: 'Avaa valikko',
    done: 'Valmis',
    showFiles: 'Näytä tiedostot',
    tabs: {
      names: {
        'empty-pubkey': 'Tervetuloa',
        preview: 'Esikatselu',
        file: 'Omat tiedostot',
        url: 'Suora linkki',
        camera: 'Kamera',
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
        huddle: 'Huddle',
        nft: 'NFT'
      },
      file: {
        drag: 'vedä ja pudota<br>tiedostoja',
        nodrop: 'Lataa tiedostoja&nbsp;tietokoneeltasi',
        cloudsTip: 'Pilvipalvelut<br>ja sosiaalinen media',
        or: 'tai',
        button: 'Valitse tiedosto',
        also: 'tai valitse palvelusta'
      },
      url: {
        title: 'Tiedostot verkosta',
        line1: 'Hae mikä tahansa tiedosto verkosta.',
        line2: 'Anna vain linkki.',
        input: 'Liitä linkki tähän...',
        button: 'Lataa'
      },
      camera: {
        camera: 'Kamera',
        title: 'Tiedosto verkkokamerasta',
        capture: 'Ota kuva',
        mirror: 'Peilaa',
        startRecord: 'Tallenna video',
        stopRecord: 'Lopeta',
        cancelRecord: 'Peruuta',
        retry: 'Pyydä käyttöoikeuksia uudelleen',
        pleaseAllow: {
          title: 'Salli kameran käyttö',
          text:
            'Sivusto pyytää lupaa käyttää kameraa.<br>' +
            'Salli pyyntö, jotta voit ottaa kuvia kameralla.'
        },
        notFound: {
          title: 'Kameraa ei löytynyt',
          text: 'Laitteeseen ei näytä olevan liitetty kameraa.'
        }
      },
      preview: {
        unknownName: 'tuntematon',
        change: 'Peruuta',
        back: 'Takaisin',
        done: 'Lisää',
        unknown: {
          title: 'Ladataan... Odota esikatselua.',
          done: 'Ohita esikatselu ja hyväksy'
        },
        regular: {
          title: 'Lisätäänkö tämä tiedosto?',
          line1: 'Olet lisäämässä yllä olevan tiedoston.',
          line2: 'Vahvista valinta.'
        },
        image: {
          title: 'Lisätäänkö tämä kuva?',
          change: 'Peruuta'
        },
        crop: {
          title: 'Rajaa ja lisää tämä kuva',
          done: 'Valmis',
          free: 'vapaa'
        },
        video: {
          title: 'Lisätäänkö tämä video?',
          change: 'Peruuta'
        },
        error: {
          default: {
            title: 'Hups!',
            text: 'Latauksessa tapahtui virhe.',
            back: 'Yritä uudelleen'
          },
          image: {
            title: 'Vain kuvatiedostot kelpaavat.',
            text: 'Yritä uudelleen toisella tiedostolla.',
            back: 'Valitse kuva'
          },
          size: {
            title: 'Valitsemasi tiedosto ylittää rajan.',
            text: 'Yritä uudelleen toisella tiedostolla.'
          },
          loadImage: {
            title: 'Virhe',
            text: 'Kuvan lataus ei onnistu'
          }
        },
        multiple: {
          title: 'Valitsit %files%.',
          question: 'Lisätäänkö %files%?',
          tooManyFiles: 'Valitsit liian monta tiedostoa. Enintään %max%.',
          tooFewFiles: 'Valitsit %files%. Vähintään %min% vaaditaan.',
          clear: 'Poista kaikki',
          done: 'Lisää',
          file: {
            preview: 'Esikatsele %file%',
            remove: 'Poista %file%'
          }
        }
      }
    },
    footer: {
      text: 'palvelun tarjoaa',
      link: 'uploadcare'
    }
  },
  serverErrors: {
    AccountBlockedError: 'Ylläpitäjän tili on estetty. Ota yhteyttä tukeen.',
    AccountUnpaidError: 'Ylläpitäjän tili on estetty. Ota yhteyttä tukeen.',
    AccountLimitsExceededError:
      'Ylläpitäjän tili on saavuttanut rajansa. Ota yhteyttä tukeen.',
    FileSizeLimitExceededError: 'Tiedosto on liian suuri.',
    MultipartFileSizeLimitExceededError: 'Tiedosto on liian suuri.',
    FileTypeForbiddenOnCurrentPlanError:
      'Tämän tyyppisten tiedostojen lataaminen ei ole sallittua.',
    DownloadFileSizeLimitExceededError: 'Ladattu tiedosto on liian suuri.'
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

export default { translations, pluralize }
