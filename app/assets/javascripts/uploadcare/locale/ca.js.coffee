##
## Please, do not use this locale as a reference for new translations.
## It could be outdated or incomplete. Always use the latest English versions:
## https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js.coffee
##
## Any fixes are welcome.
##

uploadcare.namespace 'uploadcare.locale.translations', (ns) ->
  ns.ca =
    uploading: 'Carregant... Si us plau esperi.'
    loadingInfo: 'Carregant informació...'
    errors:
      default: 'Error'
      baddata: 'Valor incorrecte'
      size: 'Massa gran'
      upload: 'No s\'ha pogut carregar'
      user: 'Carrega cancel·lada'
      info: 'No s\'ha pogut carregar la informació'
      image: 'Només es permeten imatges'
    draghere: 'Arrossega els fitxers fins aquí'
    file:
      one: '%1 fitxer'
      other: '%1 fitxers'
    buttons:
      cancel: 'Cancel·lar'
      remove: 'Eliminar'
    dialog:
      tabs:
        names:
          preview: 'Avanci'
          file: 'Ordinador'
          url: 'Una adreça qualsevol'
        file:
          drag: 'Arrossega un fitxer aquí'
          nodrop: 'Carrega fotos des del teu ordinador'
          or: 'o'
          button: 'Escull un fitxer des del teu ordinador'
          also: 'També pots seleccionar-lo de'
        url:
          title: 'Fitxers de la web'
          line1: 'Selecciona qualsevol fitxer de la web.'
          line2: 'Només proporcioni el link.'
          input: 'Copiï el link aquí...'
          button: 'Pujar'
        preview:
          unknownName: 'desconegut'
          change: 'Cancel·lar'
          back: 'Endarrere'
          done: 'Pujar'
          unknown:
            title: 'Carregant. Si us plau esperi per la visualització prèvia.'
            done: 'Saltar visualització prèvia i acceptar'
          regular:
            title: 'Vols pujar aquest fitxer?'
            line1: 'Estàs a punt de pujar el fitxer superior.'
            line2: 'Confirmi si us plau.'
          image:
            title: 'Vols pujar aquesta imatge?'
            change: 'Cancel·lar'
          crop:
            title: 'Tallar i pujar aquesta imatge'
            done: 'Fet'
          error:
            default:
              title: 'La pujada ha fallat'
              line1: 'S\'ha produït un error durant la pujada.'
              line2: 'Si us plau, provi-ho de nou.'
            image:
              title: 'Només imatges'
              line1: 'Només s\'accepten fitxers d\'imatges.'
              line2: 'Si us plau, provi-ho de nou amb un altre fitxer.'
            size:
              title: 'Límit de mida'
              line1: 'El fitxer que has seleccionat sobrepassa el límit dels 100MB.'
              line2: 'Si us plau provi-ho de nou amb un altre fitxer.'
            loadImage:
              title: 'Error'
              text: 'No s\'ha pogut carregar la imatge'
      footer:
        text: 'Els fitxers han estat carregats, gestionats i processats per'


uploadcare.namespace 'uploadcare.locale.pluralize', (ns) ->
  ns.ca = (n) ->
    return 'one' if n == 1
    'other'
