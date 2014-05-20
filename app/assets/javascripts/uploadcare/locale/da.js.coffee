# Note: English locale is the default and used as a fallback.
uploadcare.namespace 'uploadcare.locale.translations', (ns) ->
  ns.da =
    uploading: 'Uploader... Vent venligst.'
    loadingInfo: 'Henter information...'
    errors:
      default: 'Fejl'
      baddata: 'Forkert værdi'
      size: 'Filen er for stor'
      upload: 'Kan ikke uploade / sende fil'
      user: 'Upload fortrudt'
      info: 'Kan ikke hente information'
      image: 'Kun billeder er tilladt'
      createGroup: 'Kan ikke oprette fil gruppe'
      deleted: 'Filen blev slettet'
    draghere: 'Drop en fil her'
    file:
      one: '%1 fil'
      other: '%1 filer'
    buttons:
      cancel: 'Annuller'
      remove: 'Fjern'
      choose:
        files:
          one: 'Vælg en fil'
          other: 'Vælg filer'
        images:
          one: 'Vælg et billede'
          other: 'Vælg billeder'
    dialog:
      done: 'Færdig'
      showFiles: 'Vis filer'
      tabs:
        names:
          preview: 'Vis'
          file: 'Komputer'
          facebook: 'Facebook'
          dropbox: 'Dropbox'
          gdrive: 'Google Drev'
          instagram: 'Instagram'
          vk: 'VK'
          evernote: 'Evernote'
          box: 'Box'
          skydrive: 'SkyDrive'
          url: 'Arbitrary Links'
        file:
          drag: 'Drop en fil her'
          nodrop: 'Hent filer fra din komputer'
          or: 'eller'
          button: 'Hent fil fra din komputer'
          also: 'Du kan også hente fra'
        url:
          title: 'Filer fra en Web adresse'
          line1: 'Vælg en fil fra en web adresse.'
          line2: 'Skriv bare linket til filen.'
          input: 'Indsæt link her...'
          button: 'Upload / Send'
        preview:
          unknownName: 'ukendt'
          change: 'Annuller'
          back: 'Tilbage'
          done: 'Fortsæt'
          unknown:
            title: 'Uploader / sender... Vent for at se mere.'
            done: 'Fortsæt uden at vente på resultat'
          regular:
            title: 'Tilføje fil?'
            line1: 'Du er ved at tilføje filen ovenfor.'
            line2: 'Venligst accepter.'
          image:
            title: 'Tilføj billede?'
            change: 'Annuller'
          crop:
            title: 'Beskær og tilføj dette billede'
            done: 'Udfør'
          error:
            default:
              title: 'Hov!'
              text: 'Noget gik galt under upload.'
              back: 'Venligst prøv igen'
            image:
              title: 'Du kan kun vælge billeder.'
              text: 'Prøv igen med en billedfil.'
              back: 'Vælg billede'
            size:
              title: 'Den fil du valgte, er desværre større end tilladt.'
              text: 'Venligst prøv med en mindre fil.'
          multiple:
            title: 'Du har valgt %files% filer'
            question: 'Vil du tilføje alle disse filer?'
            tooManyFiles: 'Du har valgt for mange filer. %max% er maximum.'
            tooFewFiles: 'Du har valgt %files% filer. Men du skal vælge mindst %min%.'
            clear: 'Fjern alle'
            done: 'Fortsæt'
      footer:
        text: 'Uploader, gemmer og behandler filer ved hjælp af'
        link: 'Uploadcare.com'
    crop:
      error:
        title: 'Fejl'
        text: 'Kan ikke åbne billede'
      done: 'Fortsæt'


# Pluralization rules taken from:
# http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
uploadcare.namespace 'uploadcare.locale.pluralize', (ns) ->
  ns.da = (n) ->
    return 'one' if n == 1
    'other'
