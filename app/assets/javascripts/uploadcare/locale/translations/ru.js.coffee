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
      tabs:
        file: 'Мой компьютер'
        url: 'Файлы с других сайтов'
