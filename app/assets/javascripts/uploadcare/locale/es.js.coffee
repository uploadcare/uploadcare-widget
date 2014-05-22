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
    draghere: 'Arrastra los archivos hasta aquí'
    file:
      one: '%1 archivo'
      other: '%1 archivos'
    buttons:
      cancel: 'Cancelar'
      remove: 'Eliminar'
    dialog:
      tabs:
        names:
          preview: 'Avance'
          file: 'Computadora'
          url: 'Una dirección cualquiera'
        file:
          drag: 'Arrastra una archivo aquí'
          nodrop: 'Sube fotos desde tu computadora'
          or: 'o'
          button: 'Elige un archivo desde tu computadora'
          also: 'Tambien puedes seleccionarlo de'
        url:
          title: 'Archivos de la web'
          line1: 'Selecciona cualquier archivo de la web.'
          line2: 'Sólo danos el link.'
          input: 'Copia tu link aquí...'
          button: 'Subir'
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
          error:
            default:
              title: 'La subida falló'
              line1: 'Algo salio mal durante la subida.'
              line2: 'Por favor, trata de nuevo.'
            image:
              title: 'Sólo imagenes'
              line1: 'Sólo se aceptan archivos de imagenes.'
              line2: 'Por favor, trata de nuevo con otro archivo.'
            size:
              title: 'Límite de tamaño'
              line1: 'El archivo que has seleccinado sobrepasa el límite de los 100MB.'
              line2: 'Por favor trata de nuevo con otro archivo.'
      footer:
        text: 'Los archivos ha sido subidos, gestionados y procesados por'
        link: 'Uploadcare.com'
    crop:
      error:
        title: 'Error'
        text: 'No se pudo cargar la imangen'
      done: 'Listo'


uploadcare.namespace 'uploadcare.locale.pluralize', (ns) ->
  ns.es = (n) ->
    return 'one' if n == 1
    'other'
