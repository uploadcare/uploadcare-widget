##
## Please, do not use this locale as a reference for new translations.
## It could be outdated or incomplete. Always use the latest English versions:
## https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js.coffee
##
## Any fixes are welcome.
##

uploadcare.namespace 'locale.translations', (ns) ->
  ns.sv =
    uploading: 'Laddar... Var god vänta.'
    loadingInfo: 'Laddar info...'
    errors:
      default: 'Error'
      baddata: 'Felaktigt värde'
      size: 'Filen är för stor'
      upload: 'Kan inte ladda upp'
      user: 'Uppladdning avbruten'
      info: 'Kan inte ladda informationen'
      image: 'Endast bilder tillåtna'
      createGroup: 'Kan inte skapa filgrupp'
      deleted: 'Fil raderad'
    draghere: 'Dra filen hit'
    file:
      one: '%1 fil'
      other: '%1 filer'
    buttons:
      cancel: 'Avbryt'
      remove: 'Ta bort'
      choose:
        files:
          one: 'Välj fil'
          other: 'Välj filer'
        images:
          one: 'Välj en fil'
          other: 'Välj filer'
    dialog:
      done: 'Klar'
      showFiles: 'Visa filer'
      tabs:
        names:
          'empty-pubkey': 'Välkommen'
          preview: 'Förhandsgranskning'
          file: 'Lokala filer'
          url: 'Direkta länkar'
          camera: 'Kamera'
        file:
          drag: 'Släpp en fil hit'
          nodrop: 'Ladda upp filer från din dator'
          cloudsTip: 'Cloud storages<br>och sociala nätverk'
          or: 'eller'
          button: 'Välj en lokal fil'
          also: 'Du kan också välja den från'
        url:
          title: 'Filer från webben'
          line1: 'Välj en fil från en web adress.'
          line2: 'Agge bara länken til filen.'
          input: 'Klistra in din länk här...'
          button: 'Ladda upp'
        camera:
          capture: 'Ta ett foto'
          mirror: 'Spegel'
          retry: 'Begär tillstånd igen'
          pleaseAllow:
            title: 'Vänligen ge tillgång till din kamera'
            text: 'Du har uppmanats att tillåta att denna webbplats får tillgång till din kamera.' +
                  'För att ta bilder med din kamera måste du godkänna denna begäran.'
          notFound:
            title: 'Ingen kamera funnen'
            text: 'Det varkar som att du inte har något kamera ansluten till denna enheten.'
        preview:
          unknownName: 'okänd'
          change: 'Avbryt'
          back: 'Tillbaka'
          done: 'Lägg till'
          unknown:
            title: 'Laddar... Vänligen vänta på förhandsgranskning.'
            done: 'Skippa förhandsgranskning och acceptera'
          regular:
            title: 'Lägg till denna filen?'
            line1: 'Du håller på att lägga till filen ovan.'
            line2: 'Vänligen bekräfta.'
          image:
            title: 'Lägg till denna bilden?'
            change: 'Avbryt'
          crop:
            title: 'Beskär och lägg till denna bild'
            done: 'Klar'
            free: 'free'
          error:
            default:
              title: 'Oops!'
              text: 'Någonting gick fel under uppladdningen.'
              back: 'Vänligen försök igen'
            image:
              title: 'Endast bildfiler accepteras.'
              text: 'Vänligen försök igen med en annan fil.'
              back: 'Välj bild'
            size:
              title: 'Filen du har valt är för stor.'
              text: 'Vänligen försök igen med en annan fil.'
            loadImage:
              title: 'Error'
              text: 'Kan inte ladda bild'
          multiple:
            title: 'Du har valt %files%'
            question: 'Vill du lägga till alla dessa filer?'
            tooManyFiles: 'Du har valt för många filer. %max% är max.'
            tooFewFiles: 'Du har valt %files%. Minst %min% krävs.'
            clear: 'Ta bort alla'
            done: 'Klar'


# Pluralization rules taken from:
# http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
uploadcare.namespace 'locale.pluralize', (ns) ->
  ns.sv = (n) ->
    return 'one' if n == 1
    'other'
