const path = require('path')
const stylesheetsPath = path.join(__dirname, 'app', 'assets', 'stylesheets', 'uploadcare')

module.exports = {
  'input': path.join(stylesheetsPath, 'styles.pcss'),
  'output': path.join(stylesheetsPath, 'styles.css'),
  'local-plugins': true,
  'use': [
    'postcss-import',
    'postcss-each',
    'postcss-inline-svg',
    'postcss-custom-media',
    'postcss-nested',
    'postcss-css-variables',
    'postcss-calc',
    'postcss-color-function',
    'postcss-flexbugs-fixes',
    'postcss-input-style',
    'autoprefixer',
    'css-mqpacker',
    'cssnano',
    'postcss-reporter',
  ],
  'postcss-import': {
    path: stylesheetsPath,
    plugins: [
      require('stylelint'),
      require('postcss-apply'),
      require('postcss-prefixer')('uploadcare--', {
        ignore: [
          /^\.uploadcare-/,
          /^\.ord-/,
          '.bottom',
          '.right',
        ],
      }),
    ],
  },
  'postcss-inline-svg': {path: path.join(__dirname, 'app', 'assets', 'images', 'uploadcare', 'svg')},
  'postcss-reporter': {
    clearMessages: true,
    filter: message => message.type !== 'dependency',
  },
  'autoprefixer': {browsers: ['> .4%', 'ie >= 10']},
}
