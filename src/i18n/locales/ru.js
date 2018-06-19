const translations = {
  uploading: 'Загрузка',
  loadingInfo: 'Загрузка инфы',
  file: {
    one: '%1 файлы',
    other: '%1 файлов',
  },
}

const pluralize = number => (number === 1 ? 'one' : 'other')

export default {
  name: 'ru',
  translations,
  pluralize,
}
