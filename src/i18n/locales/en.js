const translations = {
  hello: 'Hello!',
  uploading: 'Uploading... Please wait.',
  loadingInfo: 'Loading info...',
  file: {
    one: '%1 file',
    other: '%1 files',
  },
}

const pluralize = number => (number === 1 ? 'one' : 'other')

export default {
  name: 'en',
  translations,
  pluralize,
}
