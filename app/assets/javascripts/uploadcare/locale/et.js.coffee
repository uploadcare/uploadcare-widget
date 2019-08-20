import uploadcare from '../namespace.coffee'

##
## Please, do not use this locale as a reference for new translations.
## It could be outdated or incomplete. Always use the latest English versions:
## https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js.coffee
##
## Any fixes are welcome.
##

uploadcare.namespace 'locale.translations', (ns) ->
  ns.et =
    uploading: 'Üleslaadimine… Palun oota.'
    loadingInfo: 'Info laadimine...'
    errors:
      default: 'Viga'
      baddata: 'Incorrect value'
      size: 'Fail on liiga suur'
      upload: 'Ei saa üles laadida'
      user: 'Üleslaadimine tühistatud'
      info: 'Ei saa infot laadida'
      image: 'Ainult pildid lubatud'
      createGroup: 'Ei saa luua failigruppi'
      deleted: 'Fail on kustutatud'
    draghere: 'Tiri fail siia'
    file:
      one: '%1 fail'
      other: '%1 failid'
    buttons:
      cancel: 'Tühista'
      remove: 'Kustuta'
      choose:
        files:
          one: 'Vali fail'
          other: 'Vali failid'
        images:
          one: 'Vali pilt'
          other: 'Vali pildid'
    dialog:
      done: 'Valmis'
      showFiles: 'Näita faile'
      tabs:
        names:
          'empty-pubkey': 'Tere'
          preview: 'Eelvaade'
          file: 'Failid Kõvakettalt'
          url: 'Veebilink'
          camera: 'Kaamera'
        file:
          drag: 'Tiri failid siia'
          nodrop: 'Lae failid arvutist'
          cloudsTip: 'Pilv<br>ja sotsiaalmeedia'
          or: 'või'
          button: 'Vali fail kõvakettalt'
          also: 'Saad samuti valida'
        url:
          title: 'Failid veebist'
          line1: 'Ükskõik mis fail otse veebist.'
          line2: 'Lihtsalt sisesta URL.'
          input: 'Kleebi link siia...'
          button: 'Lae üles'
        camera:
          capture: 'Take a photo'
          mirror: 'Mirror'
          startRecord: 'Record a video'
          stopRecord: 'Stop'
          cancelRecord: 'Cancel'
          retry: 'Request permissions again'
          pleaseAllow:
            title: 'Please allow access to your camera'
            text: 'You have been prompted to allow camera access from this site. ' +
                  'In order to take pictures with your camera you must approve this request.'
          notFound:
            title: 'No camera detected'
            text: 'Looks like you have no camera connected to this device.'
        preview:
          unknownName: 'teadmata'
          change: 'Tühista'
          back: 'Tagasi'
          done: 'Lisa'
          unknown:
            title: 'Üleslaadimine... Palun oota eelvaadet.'
            done: 'Jäta eelvaade vahele ja nõustu'
          regular:
            title: 'Lisa see fail?'
            line1: 'Oled lisamas ülaltoodud faili.'
            line2: 'Palun kinnita.'
          image:
            title: 'Lisa pilt?'
            change: 'Tühista'
          crop:
            title: 'Lõika ja lisa pilt'
            done: 'Valmis'
            free: 'vaba'
          video:
            title: 'Lisa video?'
            change: 'Tühista'
          error:
            default:
              title: 'Oihh!'
              text: 'Midagi läks üleslaadimisel valesti.'
              back: 'Palun proovi uuesti'
            image:
              title: 'Ainult pildifailid on lubatud.'
              text: 'Palun proovi uuesti teise failiga.'
              back: 'Vali pilt'
            size:
              title: 'Valitud fail ületab maksimaalse suuruse.'
              text: 'Palun proovi uuesti teise failiga.'
            loadImage:
              title: 'Viga'
              text: 'Ei saa pilti laadida'
          multiple:
            title: 'Oled valinud %files%'
            question: 'Kas sa soovid lisada kõik failid?'
            tooManyFiles: 'Oled valinud liiga suure hulga faile. %max% on maksimaalne.'
            tooFewFiles: 'Oled valinud %files%. Vähemalt %min% nõutud.'
            clear: 'Eemalda kõik'
            done: 'Valmis'


# Pluralization rules taken from:
# http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
uploadcare.namespace 'locale.pluralize', (ns) ->
  ns.et = (n) ->
    return 'one' if n == 1
    'other'
