// #
// # Please, do not use this locale as a reference for new translations.
// # It could be outdated or incomplete. Always use the latest English versions:
// # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
// #
// # Any fixes are welcome.
// #
const translations = {
  uploading: 'Завантаження... Зачекайте.',
  loadingInfo: 'Завантаження інформації...',
  errors: {
    default: 'Помилка',
    baddata: 'Неправильне значення',
    size: 'Завеликий файл',
    upload: 'Помилка завантаження',
    user: 'Завантаження скасовано',
    info: 'Помилка завантаження інформації',
    image: 'Дозволені лише зображення',
    createGroup: 'Неможливо створити групу файлів',
    deleted: 'Файл видалено'
  },
  draghere: 'Перетягніть файл сюди',
  file: {
    one: '%1 файл',
    few: '%1 файли',
    many: '%1 файлів'
  },
  buttons: {
    cancel: 'Cкасувати',
    remove: 'Видалити',
    choose: {
      files: {
        one: 'Вибрати файл',
        other: 'Вибрати файли'
      },
      images: {
        one: 'Вибрати зображення',
        other: 'Вибрати зображення'
      }
    }
  },
  dialog: {
    close: 'Закрити',
    openMenu: 'Відкрити меню',
    done: 'Готово',
    showFiles: 'Показати файли',
    tabs: {
      names: {
        'empty-pubkey': 'Вітання',
        preview: 'Попередній перегляд',
        file: 'Локальні файли',
        url: 'Пряме посилання',
        camera: 'Камера',
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
        drag: 'Перетягніть<br>будь-які файли',
        nodrop: "Завантаження файлів з вашого комп'ютера",
        cloudsTip: 'Хмарні сховища<br>та соціальні мережі',
        or: 'або',
        button: 'Обрати локальний файл',
        also: 'або обрати з'
      },
      url: {
        title: 'Файли з інших сайтів',
        line1: 'Візьміть будь-який файл з Інтернету..',
        line2: 'Вкажіть тут посилання.',
        input: 'Вставте ваше посилання тут...',
        button: 'Завантажити'
      },
      camera: {
        title: 'Файл із відеокамери',
        capture: 'Зробити знімок',
        mirror: 'Віддзеркалити',
        startRecord: 'Записати відео',
        stopRecord: 'Стоп',
        cancelRecord: 'Cкасувати',
        retry: 'Повторний запит дозволу',
        pleaseAllow: {
          title: 'Будь ласка, надайте доступ до вашої камери',
          text:
            'Вам буде запропоновано дозволити доступ до камери з цього сайту.<br>' +
            'Для того, щоб фотографувати за допомогою камери, ви повинні схвалити цей запит.'
        },
        notFound: {
          title: 'Камера не виявлена',
          text: 'Схоже, у вас немає камери, підключеної до цього пристрою.'
        }
      },
      preview: {
        unknownName: 'невідомо',
        change: 'Cкасувати',
        back: 'Назад',
        done: 'Додати'
      },
      unknown: {
        title: 'Завантаження... Зачекайте на попередній перегляд.',
        done: 'Пропустити перегляд і прийняти'
      },
      regular: {
        title: 'Додати цей файл?',
        line1: 'Ви збираєтеся додати файл вище.',
        line2: 'Будь ласка, підтвердіть.'
      },
      image: {
        title: 'Додати це зображення?',
        change: 'Cкасувати'
      },
      crop: {
        title: 'Обрізати та додати це зображення',
        done: 'Готово',
        free: 'довільно'
      },
      video: {
        title: 'Додати це відео?',
        change: 'Cкасувати'
      },
      error: {
        default: {
          title: 'Ой!',
          text: 'Під час завантаження сталася помилка.',
          back: 'Будь ласка, спробуйте ще раз'
        },
        image: {
          title: 'Приймаються лише файли зображень.',
          text: 'Повторіть спробу з іншим файлом.',
          back: 'Виберіть зображення'
        },
        size: {
          title: 'Розмір вибраного файлу перевищує ліміт.',
          text: 'Повторіть спробу з іншим файлом.'
        },
        loadImage: {
          title: 'Помилка',
          text: 'Помилка завантаження зображення'
        },
        multiple: {
          title: 'Ви вибрали %files%.',
          question: 'Додати %files%?',
          tooManyFiles:
            'Ви вибрали забагато файлів. Максимальна кількість %max%.',
          tooFewFiles: 'Ви вибрали %files%. Мінімальна кількість %min%.',
          clear: 'Видалити все',
          done: 'Додати'
        },
        file: {
          preview: 'Попередній перегляд %file%',
          remove: 'Видалити %file%'
        }
      }
    },
    footer: {
      text: 'працює на',
      link: 'uploadcare'
    }
  }
}

// Pluralization rules taken from:
// https://unicode.org/cldr/charts/34/supplemental/language_plural_rules.html
const pluralize = function(n) {
  if (((n / 10) % 10 | 0) === 1 || n % 10 === 0 || n % 10 > 4) {
    return 'many'
  } else if (n % 10 === 1) {
    return 'one'
  } else {
    return 'few'
  }
}

export default { translations, pluralize }
