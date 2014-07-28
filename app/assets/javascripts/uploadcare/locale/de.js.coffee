# Note: English locale is the default and used as a fallback.
uploadcare.namespace 'uploadcare.locale.translations', (ns) ->
  ns.de =
    uploading: 'Hochladen... Bitte warten.'
    loadingInfo: 'Laden der Informationen...'
    errors:
      default: 'Error'
      baddata: 'Falscher Wert'
      size: 'Datei zu groß'
      upload: 'Kann nicht hochgeladen werden'
      user: 'Hochladen abgebrochen'
      info: 'Informationen können nicht geladen werden'
      image: 'Nur Bilder sind erlaubt'
      createGroup: 'Datei-Gruppe kann nicht erstellt werden'
      deleted: 'Datei wurde gelöscht'
    draghere: 'Ziehen Sie eine Datei hier hinein'
    file:
      one: '%1 Datei'
      other: '%1 Dateien'
    buttons:
      cancel: 'Abbrechen'
      remove: 'Löschen'
      choose:
        files:
          one: 'Wählen Sie eine Datei'
          other: 'Wählen Sie die Dateien'
        images:
          one: 'Wählen Sie ein Bild'
          other: 'Wählen Sie Bilder'
    dialog:
      done: 'Fertig'
      showFiles: 'Dateien anzeigen'
      tabs:
        names:
          preview: 'Vorschau'
          file: 'Computer'
          facebook: 'Facebook'
          dropbox: 'Dropbox'
          gdrive: 'Google Drive'
          instagram: 'Instagram'
          vk: 'VK'
          evernote: 'Evernote'
          box: 'Box'
          skydrive: 'OneDrive'
          flickr: 'Flickr'
          url: 'Web-Links'
        file:
          drag: 'Ziehen Sie eine Datei hier hinein'
          nodrop: 'Laden Sie Dateien von Ihrem PC hoch'
          or: 'oder'
          button: 'Wählen Sie eine Datei von Ihrem PC'
          also: 'Sie köhnen es auch wählen von'
        url:
          title: 'Dateien vom Web'
          line1: 'Holen Sie sich irgendeine Datei vom Web.'
          line2: 'Geben Sie einfach den Link an.'
          input: 'Bitte geben Sie den Link hier an...'
          button: 'Hochladen'
        preview:
          unknownName: 'nicht bekannt'
          change: 'Abbrechen'
          back: 'Zurück'
          done: 'Hinzufügen'
          unknown:
            title: 'Hochladen... Bitte warten Sie auf die Vorschau.'
            done: 'Vorschau überspringen und Datei annehmen'
          regular:
            title: 'Diese Datei hinzufügen?'
            line1: 'Diese Datei wird nun hinzugefügt.'
            line2: 'Bitte bestätigen Sie.'
          image:
            title: 'Dieses Bild hinzufügen?'
            change: 'Abbrechen'
          crop:
            title: 'Dieses Bild beschneiden und hinzufügen'
            done: 'Fertig'
            free: 'frei'
          error:
            default:
              title: 'Oops!'
              text: 'Etwas ist während dem Hochladen schief gelaufen.'
              back: 'Bitte versuchen Sie es erneut'
            image:
              title: 'Nur Bilder sind akzeptiert.'
              text: 'Bitte veruschen Sie es erneut mit einer anderen Datei.'
              back: 'Bild wählen'
            size:
              title: 'Die gewählte Datei überschreitet das Limit.'
              text: 'Bitte veruschen Sie es erneut mit einer anderen Datei.'
            loadImage:
              title: 'Fehler'
              text: 'Das Bild kann nicht geladen werden'
          multiple:
            title: 'Sie haben %files% Dateien gewählt'
            question: 'Möchten Sie all diese Datein hinzufügen?'
            tooManyFiles: 'Sie haben zu viele Dateien gewählt. %max% ist das Maximum.'
            tooFewFiles: 'Sie haben %files% Dateien. Es sind mindestens %min% nötig.'
            clear: 'Alle löschen'
            done: 'Fertig'
      footer:
        text: 'Hochladen, Speichern und Verarbeitung der Dateien durch'
        link: 'Uploadcare.com'


# Pluralization rules taken from:
# http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
uploadcare.namespace 'uploadcare.locale.pluralize', (ns) ->
  ns.de = (n) ->
    return 'one' if n == 1
    'other'
