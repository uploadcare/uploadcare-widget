uploadcare.whenReady ->
  uploadcare.namespace 'uploadcare.locale.translations', (ns) ->
    ns.ru =
      ready: 'Выберите файл'
      uploading: 'Загрузка, пожалуйста, подождите'
      error: 'Ошибка'
      draghere: 'Перетащите файл сюда'
      buttons:
        cancel: 'Отмена'
        remove: 'Удалить'
        file: 'Загрузить с компьютера'
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
