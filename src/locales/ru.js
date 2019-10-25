// #
// # Please, do not use this locale as a reference for new translations.
// # It could be outdated or incomplete. Always use the latest English versions:
// # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
// #
// # Any fixes are welcome.
// #
const translations = {
  uploading: 'Идет загрузка',
  loadingInfo: 'Загрузка информации...',
  errors: {
    default: 'Ошибка',
    baddata: 'Некорректные данные',
    size: 'Слишком большой файл',
    upload: 'Ошибка при загрузке',
    user: 'Загрузка прервана',
    info: 'Ошибка при загрузке информации',
    image: 'Разрешены только изображения',
    createGroup: 'Не удалось создать группу файлов',
    deleted: 'Файл удалён'
  },
  draghere: 'Перетащите файл сюда',
  file: {
    one: '%1 файл',
    few: '%1 файла',
    many: '%1 файлов'
  },
  buttons: {
    cancel: 'Отмена',
    remove: 'Удалить',
    choose: {
      files: {
        one: 'Выбрать файл',
        other: 'Выбрать файлы'
      },
      images: {
        one: 'Выбрать изображение',
        other: 'Выбрать изображения'
      }
    }
  },
  dialog: {
    done: 'Готово',
    showFiles: 'Показать файлы',
    tabs: {
      names: {
        preview: 'Предпросмотр',
        'empty-pubkey': 'Приветствие',
        file: 'Локальные файлы',
        vk: 'ВКонтакте',
        url: 'Ссылка',
        camera: 'Камера'
      },
      file: {
        drag: 'Перетащите файл сюда',
        nodrop: 'Загрузка файлов с вашего компьютера',
        cloudsTip: 'Облачные хранилища<br>и социальные сети',
        or: 'или',
        button: 'Выберите локальный файл',
        also: 'Вы также можете загрузить файлы, используя:'
      },
      url: {
        title: 'Файлы с других сайтов',
        line1: 'Загрузите любой файл из сети.',
        line2: '',
        input: 'Укажите здесь ссылку...',
        button: 'Загрузить'
      },
      camera: {
        capture: 'Сделать снимок',
        mirror: 'Отразить',
        retry: 'Повторно запросить разрешение',
        pleaseAllow: {
          title: 'Пожалуйста, разрешите доступ к камере',
          text:
            'Для того, чтобы сделать снимок, мы запросили разрешение ' +
            'на доступ к камере с этого сайта.'
        },
        notFound: {
          title: 'Камера не найдена',
          text: 'Скорее всего камера не подключена или не настроена.'
        }
      },
      preview: {
        unknownName: 'неизвестно',
        change: 'Отмена',
        back: 'Назад',
        done: 'Добавить',
        unknown: {
          title: 'Загрузка... Пожалуйста подождите.',
          done: 'Пропустить предварительный просмотр'
        },
        regular: {
          title: 'Загрузить этот файл?',
          line1: 'Вы собираетесь добавить этот файл:',
          line2: 'Пожалуйста, подтвердите.'
        },
        image: {
          title: 'Добавить это изображение?',
          change: 'Отмена'
        },
        video: {
          title: 'Добавить это видео?',
          change: 'Отмена'
        },
        crop: {
          title: 'Обрезать и добавить это изображение',
          done: 'Готово',
          free: 'произв.'
        },
        error: {
          default: {
            title: 'Ой!',
            text: 'Что-то пошло не так во время загрузки.',
            back: 'Пожалуйста, попробуйте ещё раз'
          },
          image: {
            title: 'Можно загружать только изображения.',
            text: 'Попробуйте загрузить другой файл.',
            back: 'Выберите изображение'
          },
          size: {
            title: 'Размер выбранного файла превышает лимит.',
            text: 'Попробуйте загрузить другой файл.'
          },
          loadImage: {
            title: 'Ошибка',
            text: 'Изображение не удалось загрузить'
          }
        },
        multiple: {
          title: 'Вы выбрали %files%',
          question: 'Добавить все эти файлы?',
          tooManyFiles: 'Вы выбрали слишком много файлов. %max% максимум.',
          tooFewFiles: 'Вы выбрали %files%. Нужно не меньше %min%.',
          clear: 'Удалить все',
          done: 'Добавить',
          file: {
            preview: 'Предпросмотр %file%',
            remove: 'Удалить %file%'
          }
        }
      }
    }
  }
}

// Pluralization rules taken from:
// http://unicode.org/repos/cldr-tmp/trunk/diff/supplemental/language_plural_rules.html
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
