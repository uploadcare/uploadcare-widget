uploadcare.whenReady ->
  uploadcare.namespace 'uploadcare.locale.translations', (ns) ->
    ns.ru =
      ready: 'Выберите файл'
      uploading: 'Загрузка, пожалуйста, подождите'
      error: 'Ошибка'
      draghere: 'Перетащите файл сюда'
      file:
        0: 'Нет файлов'
        1: '1 файл'
        2: '%1 файла'
        n: '%1 файлов'
      buttons:
        cancel: 'Отмена'
        remove: 'Удалить'
        file: 'Компьютер'
      dialog:
        title: 'Загрузите что угодно откуда угодно'
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
            line2: 'Просто укажите ссылку.'
            input: 'Укажите ссылку здесь...'
            button: 'Загрузить'


  uploadcare.namespace 'uploadcare.locale.pluralize', (ns) ->
    ns.ru = (n) ->
      return 0 if n == 0
      return 1 if (n % 10 == 1) && (n % 100 != 11)
      return 2 if (n % 10 >= 2) && (n % 10 <= 4) && (n % 100 < 10 || n % 100 >= 20)
      'n'
