import uploadcare from '../namespace'

// #
// # Please, do not use this locale as a reference for new translations.
// # It could be outdated or incomplete. Always use the latest English versions:
// # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
// #
// # Any fixes are welcome.
// #
uploadcare.namespace('locale.translations', function (ns) {
  ns.lv = {
    uploading: 'Augšupielādē... Lūdzu, gaidiet.',
    errors: {
      default: 'Kļūda',
      image: 'Atļauti tikai attēli'
    },
    draghere: 'Velciet failus šeit',
    file: {
      zero: '%1 failu',
      one: '%1 fails',
      other: '%1 faili'
    },
    buttons: {
      cancel: 'Atcelt',
      remove: 'Dzēst'
    },
    dialog: {
      title: 'Ielādēt jebko no jebkurienes',
      poweredby: 'Darbināts ar',
      support: {
        images: 'Attēli',
        audio: 'Audio',
        video: 'Video',
        documents: 'Dokumenti'
      },
      tabs: {
        file: {
          title: 'Mans dators',
          line1: 'Paņemiet jebkuru failu no jūsu datora.',
          line2: 'Izvēlēties ar dialogu vai ievelciet iekšā.',
          button: 'Meklēt failus'
        },
        url: {
          title: 'Faili no tīmekļa',
          line1: 'Paņemiet jebkuru failu no tīmekļa.',
          line2: 'Tikai uzrādiet linku.',
          input: 'Ielīmējiet linku šeit...',
          button: 'Ielādēt'
        }
      }
    }
  }
})

uploadcare.namespace('locale.pluralize', function (ns) {
  ns.lv = function (n) {
    if (n === 0) {
      return 'zero'
    }
    if ((n % 10 === 1) && (n % 100 !== 11)) {
      return 'one'
    }
    return 'other'
  }
})
