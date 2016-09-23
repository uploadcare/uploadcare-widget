const path = require('path')
const stylesheetsPath = path.join(__dirname, 'app', 'assets', 'stylesheets', 'uploadcare')

module.exports = {
	'input': path.join(stylesheetsPath, 'widget.pcss'),
	'output': path.join(stylesheetsPath, 'widget.css'),
	'local-plugins': true,
	'use': [
		'postcss-import',
		'postcss-custom-media',
		'postcss-nested',
		'postcss-css-variables',
		'postcss-calc',
		'postcss-color-function',
		'autoprefixer',
		'postcss-reporter',
	],
	'postcss-import': {
		path: stylesheetsPath,
		plugins: [
			require('stylelint'),
			require('postcss-apply'),
			require('postcss-prefixer')('uploadcare--', {ignore: [/uploadcare-/]}),
		],
	},
	'postcss-reporter': {clearMessages: true},
}
