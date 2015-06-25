uploadcare.namespace 'uploadcare.locale.translations', (ns) ->
  ns.es =
    uploading: 'Subiendo... Por favor espere.'
    loadingInfo: 'Cargando Información...'
    errors:
      default: 'Error'
      baddata: 'Valor incorrecto'
      size: 'Demasiado grande'
      upload: 'No se ha podido subir'
      user: 'Subida cancelada'
      info: 'No se pudo cargar la información'
      image: 'Sólo se permiten imagenes'
      createGroup: 'No se pudo crear el grupo de archivos'
      deleted: 'Archivo eliminado'
    draghere: 'Arrastra los archivos hasta aquí'
    file:
      one: '%1 archivo'
      other: '%1 archivos'
    buttons:
      cancel: 'Cancelar'
      remove: 'Eliminar'
      choose:
        files:
          one: 'Escoge un archivo'
          other: 'Escoge archivos'
        images:
          one: 'Escoge una imagen'
          other: 'Escoge imagenes'
    dialog:
      done: 'Hecho'
      showFiles: 'Muestra archivos'
      tabs:
        names:
          'empty-pubkey': 'Bienvenido'
          preview: 'Avance'
          file: 'Computadora'
          url: 'Una dirección arbitraria'
          camera: 'Cámara'
          facebook: 'Facebook'
          dropbox: 'Dropbox'
          gdrive: 'Google Drive'
          instagram: 'Instagram'
          vk: 'VK'
          evernote: 'Evernote'
          box: 'Box'
          skydrive: 'OneDrive'
          flickr: 'Flickr'
          huddle: 'Huddle'
        file:
          drag: 'Arrastra una archivo aquí'
          nodrop: 'Sube fotos desde tu computadora'
          cloudsTip: 'Almacenamiento en la nube<br>y redes sociales'
          or: 'o'
          button: 'Elige un archivo desde tu computadora'
          also: 'Tambien puedes seleccionarlo de'
        url:
          title: 'Archivos de la web'
          line1: 'Selecciona cualquier archivo de la web.'
          line2: 'Sólo danos el link.'
          input: 'Copia tu link aquí...'
          button: 'Subir'
        camera:
          capture: 'Realizar una foto'
          mirror: 'Espejo'
          retry: 'Pedir permisos de nuevo'
          pleaseAllow:
            title: 'Por favor, permite acceso a tu cámara'
            text: 'Este sitio ha pedido permiso para acceder a la cámara. ' +
                  'Para realizar imágenes con tu cámara debes aceptar esta petición.'
          notFound:
            title: 'No se ha detectado ninguna cámara'
            text: 'Parece que no tienes ninguna cámara conectada a este dispositivo.'
        preview:
          unknownName: 'desconocido'
          change: 'Cancelar'
          back: 'Atras'
          done: 'Subir'
          unknown:
            title: 'Subiendo. Por favor espera para una vista previa.'
            done: 'Saltar vista previa y aceptar'
          regular:
            title: '¿Quieres subir este archivo?'
            line1: 'Estás por subir el archivo de arriba.'
            line2: 'Confirma por favor.'
          image:
            title: '¿Quieres subir esta imagen?'
            change: 'Cancelar'
          crop:
            title: 'Cortar y subir esta imagen'
            done: 'Listo'
            free: 'libre'
          error:
            default:
              title: 'La subida falló'
              text: 'Algo salio mal durante la subida.'
              back: 'Por favor, trata de nuevo.'
            image:
              title: 'Sólo se aceptan archivos de imagenes.'
              text: 'Por favor, trata de nuevo con otro archivo.'
              back: 'Escoge imagen'
            size:
              title: 'El archivo que has seleccinado sobrepasa el límite de los 100MB.'
              text: 'Por favor trata de nuevo con otro archivo.'
            loadImage:
              title: 'Error'
              text: 'No se pudo cargar la imangen'
          multiple:
            title: 'Has escogido %files%'
            question: '¿Quieres añadir todos estos archivos?'
            tooManyFiles: 'Has escogido demasiados archivos. %max% es el máximo.'
            tooFewFiles: 'Has escogido %files%. Como mínimo hacen falta %min%.'
            clear: 'Eliminarlos todos'
            done: 'Hecho'
      footer:
        text: 'Los archivos ha sido subidos, gestionados y procesados por'
        link: 'Uploadcare.com'

# Pluralization rules taken from:
# http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
uploadcare.namespace 'uploadcare.locale.pluralize', (ns) ->
  ns.es = (n) ->
    return 'one' if n == 1
    'other'
