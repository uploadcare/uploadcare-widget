// #
// # Please, do not use this locale as a reference for new translations.
// # It could be outdated or incomplete. Always use the latest English versions:
// # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
// #
// # Any fixes are welcome.
// #
const translations = {
  uploading: 'Subiendo... Por favor espere.',
  loadingInfo: 'Cargando información...',
  errors: {
    default: 'Error',
    baddata: 'Valor incorrecto',
    size: 'Archivo demasiado grande',
    upload: 'No se puede subir',
    user: 'Subida cancelada',
    info: 'No se puede cargar la información',
    image: 'Solo se permiten imágenes',
    createGroup: 'No se puede crear el grupo de archivos',
    deleted: 'El archivo fue eliminado'
  },
  draghere: 'Arrastra un archivo aquí',
  file: {
    one: '%1 archivo',
    other: '%1 archivos'
  },
  buttons: {
    cancel: 'Cancelar',
    remove: 'Eliminar',
    choose: {
      files: {
        one: 'Escoge un archivo',
        other: 'Escoge archivos'
      },
      images: {
        one: 'Escoge una imagen',
        other: 'Escoge imágenes'
      }
    }
  },
  dialog: {
    close: 'Cerrar',
    openMenu: 'Menú abierto',
    done: 'Hecho',
    showFiles: 'Mostrar archivos',
    tabs: {
      names: {
        'empty-pubkey': 'Bienvenido',
        preview: 'Previsualización',
        file: 'Archivos locales',
        url: 'Enlaces arbitrarios',
        camera: 'Cámara'
      },
      file: {
        drag: 'Arrastra un archivo aquí',
        nodrop: 'Sube fotos desde tu dispositivo',
        cloudsTip: 'Almacenamiento en la nube<br>y redes sociales',
        or: 'o',
        button: 'Elige un archivo de tu dispositivo',
        also: 'Tambien puedes seleccionarlo de'
      },
      url: {
        title: 'Archivos de la Web',
        line1: 'Coge cualquier archivo de la web.',
        line2: 'Solo danos el link.',
        input: 'Pega tu link aquí...',
        button: 'Subir'
      },
      camera: {
        title: 'Archivo desde la cámara web',
        capture: 'Hacer una foto',
        mirror: 'Espejo',
        startRecord: 'Grabar un video',
        stopRecord: 'Detener',
        cancelRecord: 'Cancelar',
        retry: 'Solicitar permisos de nuevo',
        pleaseAllow: {
          title: 'Por favor, permite el acceso a tu cámara',
          text:
            'Este sitio ha pedido permiso para acceder a la cámara. ' +
            'Para tomar imágenes con tu cámara debes aceptar esta petición.'
        },
        notFound: {
          title: 'No se ha detectado ninguna cámara',
          text:
            'Parece que no tienes ninguna cámara conectada a este dispositivo.'
        }
      },
      preview: {
        unknownName: 'desconocido',
        change: 'Cancelar',
        back: 'Atrás',
        done: 'Añadir',
        unknown: {
          title: 'Subiendo. Por favor espera para una vista previa.',
          done: 'Saltar vista previa y aceptar'
        },
        regular: {
          title: '¿Quieres subir este archivo?',
          line1: 'Estás a punto de subir el archivo de arriba.',
          line2: 'Confírmalo por favor.'
        },
        image: {
          title: '¿Quieres subir esta imagen?',
          change: 'Cancelar'
        },
        crop: {
          title: 'Cortar y añadir esta imagen',
          done: 'Listo',
          free: 'libre'
        },
        video: {
          title: '¿Añadir este video?',
          change: 'Cancelar'
        },
        error: {
          default: {
            title: 'Ups!',
            text: 'Algo salió mal durante la subida.',
            back: 'Por favor, inténtalo de nuevo.'
          },
          image: {
            title: 'Solo se aceptan archivos de imagen.',
            text: 'Por favor, inténtalo de nuevo con otro archivo.',
            back: 'Escoger imagen'
          },
          size: {
            title: 'El archivo que has seleccinado excede el límite.',
            text: 'Por favor, inténtalo de nuevo con otro archivo.'
          },
          loadImage: {
            title: 'Error',
            text: 'No puede cargar la imagen'
          }
        },
        multiple: {
          title: 'Has escogido %files%',
          question: '¿Quieres añadir todos estos archivos?',
          tooManyFiles: 'Has escogido demasiados archivos. %max% es el máximo.',
          tooFewFiles: 'Has escogido %files%. Hacen falta al menos %min%.',
          clear: 'Eliminar todo',
          done: 'Hecho',
          file: {
            preview: 'Vista previa %file%',
            remove: 'Quitar %file%'
          }
        }
      }
    },
    footer: {
      text: 'alimentado por'
    }
  }
}

// Pluralization rules taken from:
// http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
const pluralize = function(n) {
  if (n === 1) {
    return 'one'
  }
  return 'other'
}

export default { translations, pluralize }
