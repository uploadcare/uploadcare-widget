// #
// # Please, do not use this locale as a reference for new translations.
// # It could be outdated or incomplete. Always use the latest English versions:
// # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
// #
// # Any fixes are welcome.
// #
const translations = {
  loadingInfo: 'Φόρτωση πληροφοριών...',
  errors: {
    default: 'Σφάλμα',
    baddata: 'Λανθασμένη αξία',
    size: 'Πολύ μεγάλο αρχείο',
    upload: 'Δεν μπορεί να γίνει φόρτωση',
    user: 'Η φόρτωση ακυρώθηκε',
    info: 'Δεν μπορούν να φορτωθούν πληροφορίες',
    image: 'Μόνο εικόνες επιτρέπονται',
    createGroup: 'Δεν μπορεί να δημιουργηθεί ομάδα αρχείων',
    deleted: 'Το αρχείο διαγράφηκε'
  },
  uploading: 'Φόρτωση... Παρακαλούμε περιμένετε.',
  draghere: 'Αποθέστε ένα αρχείο εδώ',
  file: {
    one: '%1 αρχείο',
    other: '%1 αρχεία'
  },
  buttons: {
    cancel: 'Ακύρωση',
    remove: 'Κατάργηση',
    choose: {
      files: {
        one: 'Επιλέξτε ένα αρχείο',
        other: 'Επιλέξτε αρχεία'
      },
      images: {
        one: 'Επιλέξτε μία εικόνα',
        other: 'Επιλέξτε εικόνες'
      }
    }
  },
  dialog: {
    close: 'Κλείσιμο',
    openMenu: 'Άνοιγμα μενού',
    done: 'Εντάξει',
    showFiles: 'Προβολή αρχείων',
    tabs: {
      names: {
        'empty-pubkey': 'Καλώς ήρθατε',
        preview: 'Προεπισκόπηση',
        file: 'Τοπικά αρχεία',
        url: 'Απευθείας σύνδεσμος',
        camera: 'Κάμερα',
        facebook: 'Facebook',
        dropbox: 'Dropbox',
        gdrive: 'Google Drive',
        instagram: 'Instagram',
        gphotos: 'Google Photos',
        vk: 'VK',
        evernote: 'Evernote',
        box: 'Box',
        onedrive: 'OneDrive',
        flickr: 'Flickr',
        huddle: 'Huddle'
      },
      file: {
        drag: 'σύρετε & αποθέστε<br>οποιαδήποτε αρχεία',
        nodrop: 'Φορτώστε αρχεία από τον&nbsp;υπολογιστή σας',
        cloudsTip: 'Αποθήκευση νέφους<br>και κοινωνικά δίκτυα',
        or: 'ή',
        button: 'Επιλέξτε ένα τοπικό αρχείο',
        also: 'ή επιλέξτε από'
      },
      url: {
        title: 'Αρχεία από τον Ιστό',
        line1: 'Πάρτε οποιοδήποτε αρχείο από το διαδίκτυο.',
        line2: 'Γράψτε απλώς τον σύνδεσμο.',
        input: 'Επικολλήστε τον σύνδεσμό σας εδώ...',
        button: 'Φόρτωση'
      },
      camera: {
        title: 'Αρχείο από κάμερα web',
        capture: 'Τραβήξτε μια φωτογραφία',
        mirror: 'Καθρέφτης',
        startRecord: 'Εγγραφή βίντεο',
        cancelRecord: 'Ακύρωση',
        stopRecord: 'Διακοπή',
        retry: 'Νέο αίτημα για άδεια',
        pleaseAllow: {
          text: 'Έχετε δεχτεί υπόδειξη να επιτρέψετε την πρόσβαση στην κάμερα από αυτόν τον ιστότοπο.<br>Για να τραβήξετε φωτογραφίες με την κάμερά σας πρέπει να εγκρίνετε αυτό το αίτημα.',
          title: 'Παρακαλούμε επιτρέψτε την πρόσβαση στην κάμερά σας'
        },
        notFound: {
          title: 'Δεν εντοπίστηκε κάμερα',
          text: 'Φαίνεται ότι δεν έχετε κάμερα συνδεδεμένη με αυτή τη συσκευή.'
        }
      },
      preview: {
        unknownName: 'άγνωστο',
        change: 'Ακύρωση',
        back: 'Πίσω',
        done: 'Προσθήκη',
        unknown: {
          title: 'Φόρτωση... Παρακαλούμε περιμένετε για προεπισκόπηση.',
          done: 'Παράλειψη επισκόπησης και αποδοχή'
        },
        regular: {
          title: 'Να προστεθεί αυτό το αρχείο;',
          line1: 'Πρόκειται να προσθέσετε το παραπάνω αρχείο.',
          line2: 'Παρακαλούμε επιβεβαιώστε.'
        },
        image: {
          title: 'Να προστεθεί αυτή η εικόνα;',
          change: 'Ακύρωση'
        },
        crop: {
          title: 'Περικοπή και προσθήκη αυτής της εικόνας',
          done: 'Εντάξει',
          free: 'δωρεάν'
        },
        video: {
          title: 'Να προστεθεί αυτό το βίντεο;',
          change: 'Ακύρωση'
        },
        error: {
          default: {
            title: 'Ουπς!',
            back: 'Παρακαλούμε προσπαθήστε ξανά',
            text: 'Κάτι πήγε στραβά κατά τη φόρτωση.'
          },
          image: {
            title: 'Μόνο αρχεία εικόνων γίνονται δεκτά.',
            text: 'Δοκιμάστε ξανά με άλλο αρχείο.',
            back: 'Επιλέξτε εικόνα'
          },
          size: {
            title: 'Το αρχείο που επιλέξατε υπερβαίνει το όριο.',
            text: 'Δοκιμάστε ξανά με άλλο αρχείο.'
          },
          loadImage: {
            title: 'Σφάλμα',
            text: 'Δεν μπορεί να φορτωθεί η εικόνα'
          }
        },
        multiple: {
          title: 'Έχετε επιλέξει %files%',
          question: 'Προσθήκη %files%;',
          tooManyFiles:
            'Έχετε επιλέξει πάρα πολλά αρχεία. Το μέγιστο είναι %max%.',
          tooFewFiles: 'Έχετε επιλέξει %files%. Απαιτούνται τουλάχιστον %min%.',
          clear: 'Κατάργηση όλων',
          file: {
            preview: 'Προεπισκόπηση %file%',
            remove: 'Αφαίρεση %file%'
          },
          done: 'Προσθήκη'
        }
      }
    },
    footer: {
      text: 'παρέχεται από',
      link: 'uploadcare'
    }
  }
}

// Pluralization rules taken from:
// https://unicode.org/cldr/charts/34/supplemental/language_plural_rules.html
const pluralize = function (n) {
  if (n === 1) {
    return 'one'
  }
  return 'other'
}

export default { translations, pluralize }
