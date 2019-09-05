import coffee from 'rollup-plugin-coffee-script'
import jst from 'rollup-plugin-jst'

import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

const bundle = (input, output, options = {}) => ({
  input: `app/assets/javascripts/uploadcare/build/${input}`,

  output: {
    name: 'uploadcare',
    format: 'umd',
    file: `dist/${output}`,
    globals: options.includeJquery
      ? undefined
      : {
        jquery: '$'
      }
  },

  external: options.includeJquery ? undefined : ['jquery'],

  plugins: [
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
    json(),

    resolve(),
    commonjs(),

    terser({
      compress: {
        // https://github.com/terser/terser/issues/453
        evaluate: false
      },
      include: [/^.+\.min\.js$/]
    })
  ]
})

export default [
  bundle('uploadcare.api.js', 'uploadcare.api.js'),
  bundle('uploadcare.api.js', 'uploadcare.api.min.js'),

  bundle('uploadcare.js', 'uploadcare.js'),
  bundle('uploadcare.js', 'uploadcare.min.js'),

  bundle('uploadcare.lang.en.js', 'uploadcare.lang.en.js'),
  bundle('uploadcare.lang.en.js', 'uploadcare.lang.en.min.js'),

  bundle('uploadcare.full.js', 'uploadcare.full.js', { includeJquery: true }),
  bundle('uploadcare.full.js', 'uploadcare.full.min.js', { includeJquery: true })
]
