uploadcare.whenReady ->
  uploadcare.namespace 'uploadcare.locale.translations', (ns) ->
    ns.ru = 
      'ready': 'Выберите файл'
      'uploading': 'Загрузка, пожалуйста, подождите'
      'error': 'Ошибка'
      'buttons':
        'cancel': 'Отмена'
        'remove': 'Удалить'