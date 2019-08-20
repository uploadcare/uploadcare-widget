import coffee from 'rollup-plugin-coffee-script';
import jst from 'rollup-plugin-jst';

import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/index.coffee',

  output: {
    name: 'uploadcare',
    format: 'umd',
    file: 'dist/index.js'
  },

  plugins: [
    coffee(),
    jst({
      templateOptions: {
        variable: 'ext'
      },

      minify: true,
      minifyOptions: {
        collapseWhitespace: true
      },

      escapeModule: 'escape-html'
    }),

    resolve(),
    commonjs()
  ]
}
