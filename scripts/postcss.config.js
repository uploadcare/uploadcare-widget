const path = require('path')
const stylesheetsPath = path.join(__dirname, 'app', 'assets', 'stylesheets', 'uploadcare')

module.exports = (ctx) => ({
  plugins: {
    'postcss-import': {
      path: stylesheetsPath,
      plugins: [require('stylelint')]
    },
    'postcss-prefixer': {
      prefix: 'uploadcare--',
      ignore: [
        /^\.uploadcare-/,
        /^\.ord-/,
        '.bottom',
        '.right'
      ]
    },
    'postcss-custom-media': {},
    'postcss-nested': {},
    'postcss-css-variables': {},
    'postcss-calc': {},
    'postcss-color-function': {},
    'postcss-flexbugs-fixes': {},
    autoprefixer: {},
    cssnano: ctx.env === 'production' ? { zindex: false } : false,
    'postcss-reporter': {}
  }
})
