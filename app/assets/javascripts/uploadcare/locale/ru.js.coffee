uploadcare.namespace 'uploadcare.locale.translations', (ns) ->
  ns.ru =
    ready: 'Выберите файл'
    uploading: 'Идет загрузка'
    errors:
      default: 'Ошибка'
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
      title: 'Загрузите что угодно, откуда угодно'
      poweredby: 'Предоставлено'
      support:
        images: 'Изображения'
        audio: 'Аудио'
        video: 'Видео'
        documents: 'Документы'
      tabs:
        file:
          title: 'Мой компьютер'
          line1: 'Загрузите любой файл со своего компьютера.'
          line2: 'Выберите его через окно поиска или перетащите.'
          button: 'Поиск файлов'
        url:
          title: 'Файлы с других сайтов'
          line1: 'Загрузите любой файл из сети.'
          line2: ''
          input: 'Укажите здесь ссылку...'
          button: 'Загрузить'


uploadcare.namespace 'uploadcare.locale.pluralize', (ns) ->
  ns.ru = (n) ->
    return 'one' if (n % 10 == 1) && (n % 100 != 11)
    return 'few' if (n % 10 in [2..4]) && (n % 100 not in [12..14])
    return 'many' if (n % 10 == 0) || (n % 10 in [5..9]) || (n % 100 in [11..14])
    'other'
