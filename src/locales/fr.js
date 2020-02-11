// #
// # Please, do not use this locale as a reference for new translations.
// # It could be outdated or incomplete. Always use the latest English versions:
// # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
// #
// # Any fixes are welcome.
// #
const translations = {
  uploading: 'Envoi en cours... Merci de patienter.',
  loadingInfo: 'Chargement des informations...',
  errors: {
    default: 'Erreur',
    baddata: 'Valeur incorrecte',
    size: 'Fichier trop volumineux',
    upload: 'Envoi impossible',
    user: 'Envoi annulé',
    info: 'Impossible de charger les informations',
    image: 'Seules les images sont autorisées',
    createGroup: "Création d'1 groupe impossible",
    deleted: 'Le fichier a été supprimé'
  },
  draghere: 'Glissez-déposez un fichier ici',
  file: {
    one: '%1 fichier',
    other: '%1 fichiers'
  },
  buttons: {
    cancel: 'Annuler',
    remove: 'Supprimer',
    choose: {
      files: {
        one: 'Sélectionner un fichier',
        other: 'Sélectionner des fichiers'
      },
      images: {
        one: 'Sélectionner une image',
        other: 'Sélectionner des images'
      }
    }
  },
  dialog: {
    close: 'Fermer',
    openMenu: 'Ouvrir le menu',
    done: 'Terminer',
    showFiles: 'Voir les fichiers',
    tabs: {
      names: {
        'empty-pubkey': 'Bienvenue',
        preview: 'Avant-première',
        file: 'Fichier en local',
        url: 'Une adresse web',
        camera: 'Caméra',
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
        huddle: 'Huddle'
      },
      file: {
        drag: 'Glissez-déposez un fichier ici',
        nodrop: 'Envoyez des fichiers depuis votre ordinateur',
        cloudsTip: 'Stockage sur le cloud<br>et réseaux sociaux',
        or: 'ou',
        button: 'Choisir un fichier local',
        also: 'Vous pouvez également le sélectionner depuis'
      },
      url: {
        title: 'Fichiers depuis le Web',
        line1: "Prenez n'importe quel fichier depuis un site web.",
        line2: 'Saisissez simplement son adresse.',
        input: 'Collez le lien ici...',
        button: 'Envoi'
      },
      camera: {
        title: 'Fichier depuis la caméra',
        capture: 'Prendre une photo',
        mirror: 'Miroir',
        startRecord: 'Enregistrer une vidéo',
        stopRecord: 'Arrêter',
        cancelRecord: 'Annuler',
        retry: 'Envoyer une nouvelle demande de permission',
        pleaseAllow: {
          title: "Autorisez l'accès à votre appareil photo",
          text:
            "Vous avez été invité à autoriser l'accès à votre appareil photo. Pour prendre des photos avec votre caméra vous devez approuver cette demande."
        },
        notFound: {
          title: 'Aucun appareil photo détecté',
          text:
            "Il semblerait que vous n'ayez pas d'appareil photo connecté à cet appareil."
        }
      },
      preview: {
        unknownName: 'inconnu',
        change: 'Annuler',
        back: 'Retour',
        done: 'Ajouter',
        unknown: {
          title: 'Envoi en cours... Merci de patienter pour prévisualiser.',
          done: 'Passer la prévisualisation et accepter'
        },
        regular: {
          title: 'Ajouter ce fichier ?',
          line1: "Vous êtes sur le point d'ajouter le fichier ci-dessus.",
          line2: 'Merci de confirmer.'
        },
        image: {
          title: 'Ajouter cette image ?',
          change: 'Annuler'
        },
        crop: {
          title: 'Recadrer et ajouter cette image',
          done: 'Terminer',
          free: 'libre'
        },
        video: {
          title: 'Ajouter cette vidéo ?',
          change: 'Annuler'
        },
        error: {
          default: {
            title: 'Oups!',
            text: "Quelque chose n'a pas fonctionné pendant l'envoi.",
            back: 'Merci de bien vouloir recommencer'
          },
          image: {
            title: 'Seules les images sont acceptées.',
            text: 'Merci de bien vouloir recommencer avec un autre fichier.',
            back: 'Choisir une image'
          },
          size: {
            title: 'Le fichier sélectionné est trop volumineux.',
            text: 'Merci de bien vouloir recommencer avec un autre fichier.'
          },
          loadImage: {
            title: 'Erreur',
            text: "Impossible de charger l'image"
          }
        },
        multiple: {
          title: 'Vous avez choisi %files%',
          question: 'Voulez vous ajouter tous ces fichiers ?',
          tooManyFiles:
            'Vous avez choisi trop de fichiers. %max% est le maximum.',
          tooFewFiles: 'Vous avez choisi %fichiers%. %min% est le minimum.',
          clear: 'Tout retirer',
          done: 'Terminer',
          file: {
            preview: 'Prévisualiser %file%',
            remove: 'Supprimer %file%'
          }
        }
      }
    }
  }
}

// Pluralization rules taken from:
// https://unicode.org/cldr/charts/34/supplemental/language_plural_rules.html
const pluralize = function(n) {
  if (n === 1) {
    return 'one'
  }
  return 'other'
}

export default { translations, pluralize }
