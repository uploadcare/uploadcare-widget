# Note: English locale is the default and used as a fallback.
uploadcare.namespace 'uploadcare.locale.translations', (ns) ->
  ns.fr =
    ready: 'Envoi depuis'
    uploading: 'Envoi en cours... Merci de patientier.'
    loadingInfo: 'Chargement des informations...'
    errors:
      default: 'Erreur'
      baddata: 'Valeur incorrecte'
      size: 'Fichier trop volumineux'
      upload: 'Envoi impossible'
      user: 'Envoi annulé'
      info: 'Impossible de charger les informations'
      image: 'Seules les images sont autorisées'
      createGroup: 'Création d\'1 groupe impossible'
      deleted: 'Le fichier a été supprimé'
    draghere: 'Glissez-déposez un fichier ici'
    file:
      one: '%1 fichier'
      other: '%1 fichiers'
    buttons:
      cancel: 'Annuler'
      remove: 'Supprimer'
      file: 'Ordinateur'
    dialog:
      done: 'Terminer'
      showFiles: 'Voir les fichiers'
      tabs:
        file:
          drag: 'Glissez-déposez un fichier ici'
          nodrop: 'Envoyez des fichiers depuis votre ordinateur'
          or: 'ou'
          button: 'Choisissez un fichier depuis votre ordinateur'
          also: 'Vous pouvez également le sélectionner depuis'
          tabNames:
            facebook: 'Facebook'
            dropbox: 'Dropbox'
            gdrive: 'Google Drive'
            instagram: 'Instagram'
            vk: 'VK'
            evernote: 'Evernote'
            url: 'Une adresse web'
        url:
          title: 'Fichiers depuis le Web'
          line1: 'Prenez n\'importe quel fichier depuis un site web.'
          line2: 'Saisissez simplement son adresse.'
          input: 'Collez le lien ici...'
          button: 'Envoi'
        preview:
          unknownName: 'inconnu'
          change: 'Annuler'
          back: 'Retour'
          done: 'Ajouter'
          unknown:
            title: 'Envoi en cours... Merci de patientier pour prévisualiser.'
            done: 'Passer la prévisualisation et accepter'
          regular:
            title: 'Ajouter ce fichier ?'
            line1: 'Vous êtes sur le point d\'ajouter le fichier ci-dessus.'
            line2: 'Merci de confirmer.'
          image:
            title: 'Ajouter cette image ?'
            change: 'Annuler'
          crop:
            title: 'Recadrer et ajouter cette image'
            done: 'Terminer'
          error:
            default:
              title: 'Oups!'
              text: 'Quelque chose n\'a pas fonctionné pendant l\'envoi.'
              back: 'Merci de bien vouloir recommencer'
            image:
              title: 'Seules les images sont acceptées.'
              text: 'Merci de bien vouloir recommencer avec un autre fichier.'
              back: 'Choisir une image'
            size:
              title: 'Le fichier sélectionné est trop volumineux.'
              text: 'Merci de bien vouloir recommencer avec un autre fichier.'
          multiple:
            title: 'Vous avez choisi'
            question: 'Voulez vous ajouter tous ces fichiers ?'
            clear: 'Tout retirer'
            done: 'Terminer'
      footer:
        text: 'Envoi, stockage et traitement des fichiers par'
        link: 'Uploadcare.com'
    crop:
      error:
        title: 'Erreur'
        text: 'Impossible de charger l\'image'
      done: 'Terminer'


# Pluralization rules taken from:
# http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
uploadcare.namespace 'uploadcare.locale.pluralize', (ns) ->
  ns.fr = (n) ->
    return 'one' if n == 1
    'other'
