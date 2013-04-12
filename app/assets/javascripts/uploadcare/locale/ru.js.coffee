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
    draghere: 'Перетащите файл сюда'
    file:
      one: '1 файл'
      few: '%1 файла'
      many: '%1 файлов'
      other: '%1 файла'
    buttons:
      cancel: 'Отмена'
      remove: 'Удалить'
      file: 'Компьютер'
    dialog:
      tabs:
        file:
          drag: 'Перетащите файл сюда'
          nodrop: 'Загрузка файлов с вашего компьютера'
          or: 'или'
          button: 'Выберите файл c компьютера'
          also: 'Вы также можете загрузить файлы используя'
          tabNames:
            facebook: 'Facebook'
            dropbox: 'Dropbox'
            gdrive: 'Google Drive'
            instagram: 'Instagram'
            url: 'Внешнюю ссылку'
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
          done: 'Загрузить'
          unknown:
            title: 'Загрузка. Пожалуйста подождите.'
            done: 'Пропустить предварительный просмотр'
          regular:
            title: 'Загрузить этот файл?'
            line1: 'Вы собираетесь загрузить представленный файл.'
            line2: 'Пожалуйста, подтвердите.'
          image:
            title: 'Загрузить это изображение?'
            change: 'Отмена'
          crop:
            title: 'Обрезать и загрузить это изображение'
          error:
            default:
              title: 'Ошибка загрузки'
              line1: 'Что-то пошло не так во время загрузки.'
              line2: 'Пожалуйста, попробуйте ещё раз.'
            image:
              title: 'Только изображения'
              line1: 'Можно загружать только изображения.'
              line2: 'Попробуйте загрузить другой файл.'
            size:
              title: 'Файл слишком большой'
              line1: 'Размер выбранного файла превышает 100 Мб.'
              line2: 'Попробуйте загрузить другой файл.'
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
