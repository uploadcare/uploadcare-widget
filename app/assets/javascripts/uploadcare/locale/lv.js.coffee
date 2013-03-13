uploadcare.namespace 'uploadcare.locale.translations', (ns) ->
  ns.lv =
    ready: 'Izvēlieties failu'
    uploading: 'Augšupielādē... Lūdzu, gaidiet.'
    errors:
      default: 'Kļūda'
      image: 'Atļauti tikai attēli'
    draghere: 'Velciet failus šeit'
    file:
      zero: '0 failu'
      one: '1 fails'
      other: '%1 faili'
    buttons:
      cancel: 'Atcelt'
      remove: 'Dzēst'
      file: 'Dators'
    dialog:
      title: 'Ielādēt jebko no jebkurienes'
      poweredby: 'Darbināts ar'
      support:
        images: 'Attēli'
        audio: 'Audio'
        video: 'Video'
        documents: 'Dokumenti'
      tabs:
        file:
          title: 'Mans dators'
          line1: 'Paņemiet jebkuru failu no jūsu datora.'
          line2: 'Izvēlēties ar dialogu vai ievelciet iekšā.'
          button: 'Meklēt failus'
        url:
          title: 'Faili no tīmekļa'
          line1: 'Paņemiet jebkuru failu no tīmekļa.'
          line2: 'Tikai uzrādiet linku.'
          input: 'Ielīmējiet linku šeit...'
          button: 'Ielādēt'


uploadcare.namespace 'uploadcare.locale.pluralize', (ns) ->
  ns.lv = (n) ->
    return 'zero' if n == 0
    return 'one' if (n % 10 == 1) && (n % 100 != 11)
    'other'
