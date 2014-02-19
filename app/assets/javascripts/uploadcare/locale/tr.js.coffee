# Note: Turkish locale by fiatux.com
uploadcare.namespace 'uploadcare.locale.translations', (ns) ->
  ns.tr =
    uploading: 'Yükleniyor... Lütfen bekleyin.'
    loadingInfo: 'Bilgiler yükleniyor...'
    errors:
      default: 'Hata'
      baddata: 'Geçersiz değer'
      size: 'Dosya çok büyük'
      upload: 'Yüklenemedi'
      user: 'Yükleme iptal edildi'
      info: 'Bilgiler getirilemedi'
      image: 'Sadece resim dosyası yüklenebilir'
      createGroup: 'Dosya grubu yaratılamıyor'
      deleted: 'Dosya silinmiş'
    draghere: 'Buraya bir dosya bırakın'
    file:
      other: '%1 dosya'
    buttons:
      cancel: 'İptal'
      remove: 'Kaldır'
      choose:
        files:
          one: 'Dosya Seçin'
          other: 'Dosya Seçin'
        images:
          one: 'Resim Dosyası Seçin'
          other: 'Resim Dosyası Seçin'
    dialog:
      done: 'Bitti'
      showFiles: 'Dosyaları Göster'
      tabs:
        file:
          drag: 'Braya bir dosya bakın'
          nodrop: 'Bilgisayarınızdan dosya yükleyin'
          or: 'or'
          button: 'Bilgisayardan bir dosya seç'
          also: 'Diğer yükleme seçenekleri'
          tabNames:
            facebook: 'Facebook'
            dropbox: 'Dropbox'
            gdrive: 'Google Drive'
            instagram: 'Instagram'
            vk: 'VK'
            evernote: 'Evernote'
            box: 'Box'
            skydrive: 'SkyDrive'
            url: 'Dış Bağlantılar'
        url:
          title: 'Webden dosyalar'
          line1: 'Webden herhangi bir dosya seçin.'
          line2: 'Dosya bağlantısını sağlayın.'
          input: 'Bağlantınızı buraya yapıştırın...'
          button: 'Yükle'
        preview:
          unknownName: 'bilinmeyen'
          change: 'İptal'
          back: 'Geri'
          done: 'Ekle'
          unknown:
            title: 'Yükleniyor... Önizleme için lütfen bekleyin.'
            done: 'Önizlemeyi geç ve kabul et'
          regular:
            title: 'Bu dosya eklensin mi?'
            line1: 'Yukarıdaki dosyayı eklemek üzeresiniz.'
            line2: 'Lütfen onaylayın.'
          image:
            title: 'Bu görsel eklensin mi?'
            change: 'İptal'
          crop:
            title: 'Bu görseli kes ve ekle'
            done: 'Bitti'
          error:
            default:
              title: 'Aman!'
              text: 'Yükleme sırasında bir hata oluştu.'
              back: 'Lütfen tekrar deneyin.'
            image:
              title: 'Sadece resim dosyaları kabul edilmektedir.'
              text: 'Lütfen başka bir dosya ile tekrar deneyin.'
              back: 'Resim dosyası seç'
            size:
              title: 'Seçtiğiniz dosya limitleri aşıyor.'
              text: 'Lütfen başka bir dosya ile tekrar deneyin.'
          multiple:
            title: '%files% dosya seçtiniz'
            question: 'Bu dosyaların hepsini eklemek istiyor musunuz?'
            tooManyFiles: 'Fazla sayıda dosya seçtiniz, en fazla %max% dosya olabilir.'
            tooFewFiles: '%files% dosya seçtiniz, en az %min% dosya olmalıdır.'
            clear: 'Hepsini kaldır'
            done: 'Bitti'
      footer:
        text: 'Dosya yükleme, saklama ve işleme servisi'
        link: 'Uploadcare.com'
    crop:
      error:
        title: 'Hata'
        text: 'Resim dosyası yüklenemedi'
      done: 'Bitti'


uploadcare.namespace 'uploadcare.locale.pluralize', (ns) ->
  ns.tr = (n) ->
    return 'other'
