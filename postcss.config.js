const path = require('path')
const stylesheetsPath = path.join(__dirname, 'app', 'assets', 'stylesheets', 'uploadcare')

module.exports = {
	'input': path.join(stylesheetsPath, 'widget.pcss'),
	'output': path.join(stylesheetsPath, 'widget.css'),
	'local-plugins': true,
	'use': [
		'postcss-import',
		'postcss-custom-media',
		'postcss-apply',
		'postcss-nested',
		'postcss-css-variables',
		'postcss-calc',
		'autoprefixer',
	],
	'postcss-import': {path: stylesheetsPath},
}
