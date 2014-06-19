# Note: English locale is the default and used as a fallback.
uploadcare.namespace 'uploadcare.locale.translations', (ns) ->
  ns.nl =
    uploading: 'Uploaden... Even geduld.'
    loadingInfo: 'Laden informatie...'
    errors:
      default: 'Fout'
      baddata: 'Ongeldige waarde'
      size: 'Bestand is te groot'
      upload: 'Kan niet uploaden'
      user: 'Upload geannulleerd'
      info: 'Kan informatie niet laden'
      image: 'Alleen afbeeldingen toegestaan'
      createGroup: 'Kan bestandsgroep niet maken'
      deleted: 'Bestand is verwijderd'
    draghere: 'Drop hier een bestand'
    file:
      one: '%1 bestand'
      other: '%1 bestanden'
    buttons:
      cancel: 'Annuleren'
      remove: 'Verwijderen'
      choose:
        files:
          one: 'Kies een bestand'
          other: 'Kies bestanden'
        images:
          one: 'Kies een afbeelding'
          other: 'Kies afbeeldingen'
    dialog:
      done: 'Klaar'
      showFiles: 'Toon bestanden'
      tabs:
        names:
          preview: 'Voorvertoning'
          file: 'Computer'
          url: 'Directe links'
        file:
          drag: 'Drop een bestand hier'
          nodrop: 'Upload bestanden van je computer'
          or: 'of'
          button: 'Selecteer een bestand van je computer'
          also: 'Je kan ook selecteren van'
        url:
          title: 'Bestanden van het web'
          line1: 'Selecteer een bestand van het web.'
          line2: 'Voer de link in.'
          input: 'Plak de link hier...'
          button: 'Upload'
        preview:
          unknownName: 'onbekend'
          change: 'Annuleren'
          back: 'Terug'
          done: 'Toevoegen'
          unknown:
            title: 'Uploaden... Wacht op de voorvertoning.'
            done: 'Voorvertoning overslaan an accepteren'
          regular:
            title: 'Dit bestand toevoegen?'
            line1: 'Je staat op het punt bovenstaand bestand toe te voegen.'
            line2: 'Bevestig.'
          image:
            title: 'Voeg deze afbeelding toe?'
            change: 'Annuleren'
          crop:
            title: 'Afbeelding bijknippen en toevoegen'
            done: 'Klaar'
          error:
            default:
              title: 'Oeps!'
              text: 'Er is een fout opgetreden tijdens het uploaden.'
              back: 'Probeer het nog eens'
            image:
              title: 'Alleen afbeeldingen worden geaccepteerd.'
              text: 'Probeer het nog eens met een andere bestand.'
              back: 'Selecteer afbeelding'
            size:
              title: 'Het geselecteerd bestand is groter dan de limiet.'
              text: 'Probeer het nog eens met een andere bestand.'
            loadImage:
              title: 'Fout'
              text: 'Kan afbeelding niet laden'
          multiple:
            title: 'U heeft de volgende bestanden geselecteerd %files%'
            question: 'Wilt u al deze bestanden toevoegen?'
            tooManyFiles: 'U heeft teveel bestanden geselecteerd. %max% is het maximum.'
            tooFewFiles: 'U heeft de volgende bestanden geselecteerd %files%. Minimaal %min% is verplicht.'
            clear: 'Verwijder alle bestanden'
            done: 'Klaar'
      footer:
        text: 'Uploaden, opslaan en verwerken bestanden door'


# Pluralization rules taken from:
# http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
uploadcare.namespace 'uploadcare.locale.pluralize', (ns) ->
  ns.nl = (n) ->
    return 'one' if n == 1
    'other'
