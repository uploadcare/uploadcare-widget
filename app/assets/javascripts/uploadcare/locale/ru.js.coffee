uploadcare.namespace 'uploadcare.locale.translations', (ns) ->
  ns.ru =
    ready: 'Выберите файл'
    uploading: 'Идет загрузка'
    loadingInfo: 'Загрузка информации...'
    errors:
      default: 'Ошибка'
      baddata: 'Некорректные данные'
      size: 'Слишком большой файл'
      upload: 'Ошибка при загрузке'
      user: 'Загрузка прервана'
      info: 'Ошибка при загрузке информации'
      image: 'Разрешены только изображения'
      createGroup: 'Не удалось создать группу файлов'
      deleted: 'Файл удалён'
    draghere: 'Перетащите файл сюда'
    file:
      one: '%1 файл'
      few: '%1 файла'
      many: '%1 файлов'
      other: '%1 файла'
    buttons:
      cancel: 'Отмена'
      remove: 'Удалить'
      file: 'Компьютер'
    dialog:
      done: 'Готово'
      showFiles: 'Показать файлы'
      tabs:
        file:
          drag: 'Перетащите файл сюда'
          nodrop: 'Загрузка файлов с вашего компьютера'
          or: 'или'
          button: 'Выберите файл с компьютера'
          also: 'Вы также можете загрузить файлы, используя:'
          tabNames:
            facebook: 'Facebook'
            dropbox: 'Dropbox'
            gdrive: 'Google Drive'
            instagram: 'Instagram'
            vk: 'ВКонтакте'
            evernote: 'Evernote'
            url: 'Произвольную ссылку'
        url:
          title: 'Файлы с других сайтов'
          line1: 'Загрузите любой файл из сети.'
          line2: ''
          input: 'Укажите здесь ссылку...'
          button: 'Загрузить'
        preview:
          unknownName: 'неизвестно'
          change: 'Отмена'
          back: 'Назад'
          done: 'Добавить'
          unknown:
            title: 'Загрузка... Пожалуйста подождите.'
            done: 'Пропустить предварительный просмотр'
          regular:
            title: 'Загрузить этот файл?'
            line1: 'Вы собираетесь добавить этот файл:'
            line2: 'Пожалуйста, подтвердите.'
          image:
            title: 'Добавить это изображение?'
            change: 'Отмена'
          crop:
            title: 'Обрезать и добавить это изображение'
            done: 'Готово'
          error:
            default:
              title: 'Ой!'
              text: 'Что-то пошло не так во время загрузки.'
              back: 'Пожалуйста, попробуйте ещё раз'
            image:
              title: 'Можно загружать только изображения.'
              text: 'Попробуйте загрузить другой файл.'
              back: 'Выберите изображение'
            size:
              title: 'Размер выбранного файла превышает лимит.'
              text: 'Попробуйте загрузить другой файл.'
          multiple:
            title: 'Вы выбрали'
            question: 'Вы хотите добавить все эти файлы?'
            clear: 'Удалить все'
            done: 'Готово'
      footer:
        text: 'Для загрузки, хранения и обработки файлов используется'
        link: 'Uploadcare.com'
    crop:
      error:
        title: 'Ошибка'
        text: 'Изображение не удалось загрузить'
      done: 'ОК'


uploadcare.namespace 'uploadcare.locale.pluralize', (ns) ->
  ns.ru = (n) ->
    return 'one' if (n % 10 == 1) && (n % 100 != 11)
    return 'few' if (n % 10 in [2..4]) && (n % 100 not in [12..14])
    return 'many' if (n % 10 == 0) || (n % 10 in [5..9]) || (n % 100 in [11..14])
    'other'
