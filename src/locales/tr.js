// #
// # Please, do not use this locale as a reference for new translations.
// # It could be outdated or incomplete. Always use the latest English versions:
// # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
// #
// # Any fixes are welcome.
// #
const translations = {
  uploading: 'Yükleniyor... Lütfen bekleyin.',
  loadingInfo: 'Bilgiler yükleniyor...',
  errors: {
    default: 'Hata',
    baddata: 'Geçersiz değer',
    size: 'Dosya çok büyük',
    upload: 'Yüklenemedi',
    user: 'Yükleme iptal edildi',
    info: 'Bilgiler getirilemedi',
    image: 'Sadece resim dosyası yüklenebilir',
    createGroup: 'Dosya grubu yaratılamıyor',
    deleted: 'Dosya silinmiş'
  },
  draghere: 'Buraya bir dosya bırakın',
  file: {
    other: '%1 dosya'
  },
  buttons: {
    cancel: 'İptal',
    remove: 'Kaldır',
    choose: {
      files: {
        one: 'Dosya Seçin',
        other: 'Dosya Seçin'
      },
      images: {
        one: 'Resim Dosyası Seçin',
        other: 'Resim Dosyası Seçin'
      }
    }
  },
  dialog: {
    done: 'Bitti',
    showFiles: 'Dosyaları Göster',
    tabs: {
      names: {
        'empty-pubkey': 'Hoş geldiniz',
        preview: 'Önizleme',
        file: 'Bilgisayar',
        url: 'Dış Bağlantılar',
        camera: 'Kamera'
      },
      file: {
        drag: 'Buraya bir dosya bırakın',
        nodrop: 'Bilgisayarınızdan dosya yükleyin',
        or: 'ya da',
        button: 'Bilgisayardan bir dosya seç',
        also: 'Diğer yükleme seçenekleri',
        cloudsTip: 'Bulut depolamalar<br>ve sosyal hizmetler'
      },
      url: {
        title: 'Webden dosyalar',
        line1: 'Webden herhangi bir dosya seçin.',
        line2: 'Dosya bağlantısını sağlayın.',
        input: 'Bağlantınızı buraya yapıştırın...',
        button: 'Yükle'
      },
      camera: {
        capture: 'Fotoğraf çek',
        mirror: 'Ayna',
        retry: 'Tekrar izin iste',
        pleaseAllow: {
          title: 'Lütfen kameranıza erişilmesine izin verin',
          text:
            'Bu siteden kamera erişimine izin vermeniz talep ediliyor. Kameranızla fotoğraf çekmek için bu isteği onaylamanız gerekmektedir.'
        },
        notFound: {
          title: 'Kamera algılanamadı',
          text: 'Bu cihaza kamera bağlantısının olmadığı görünüyor.'
        }
      },
      preview: {
        unknownName: 'bilinmeyen',
        change: 'İptal',
        back: 'Geri',
        done: 'Ekle',
        unknown: {
          title: 'Yükleniyor... Önizleme için lütfen bekleyin.',
          done: 'Önizlemeyi geç ve kabul et'
        },
        regular: {
          title: 'Bu dosya eklensin mi?',
          line1: 'Yukarıdaki dosyayı eklemek üzeresiniz.',
          line2: 'Lütfen onaylayın.'
        },
        image: {
          title: 'Bu görsel eklensin mi?',
          change: 'İptal'
        },
        crop: {
          title: 'Bu görseli kes ve ekle',
          done: 'Bitti'
        },
        error: {
          default: {
            title: 'Aman!',
            text: 'Yükleme sırasında bir hata oluştu.',
            back: 'Lütfen tekrar deneyin.'
          },
          image: {
            title: 'Sadece resim dosyaları kabul edilmektedir.',
            text: 'Lütfen başka bir dosya ile tekrar deneyin.',
            back: 'Resim dosyası seç'
          },
          size: {
            title: 'Seçtiğiniz dosya limitleri aşıyor.',
            text: 'Lütfen başka bir dosya ile tekrar deneyin.'
          },
          loadImage: {
            title: 'Hata',
            text: 'Resim dosyası yüklenemedi'
          }
        },
        multiple: {
          title: '%files% dosya seçtiniz',
          question: 'Bu dosyaların hepsini eklemek istiyor musunuz?',
          tooManyFiles:
            'Fazla sayıda dosya seçtiniz, en fazla %max% dosya olabilir.',
          tooFewFiles: '%files% dosya seçtiniz, en az %min% dosya olmalıdır.',
          clear: 'Hepsini kaldır',
          done: 'Bitti'
        }
      }
    }
  }
}

const pluralize = function(n) {
  return 'other'
}

export { translations, pluralize }
