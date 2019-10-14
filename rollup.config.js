import babel from 'rollup-plugin-babel'
import jst from 'rollup-plugin-jst'

import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import license from 'rollup-plugin-license'
import replace from 'rollup-plugin-replace'

const bundle = (input, output, options = {}) => ({
  input: `src/bundles/${input}`,

  output: {
    name: 'uploadcare',
    format: 'umd',
    file: `${output}`,
    globals: options.includeJquery
      ? undefined
      : {
        jquery: '$'
      }
  },

  external: options.includeJquery ? undefined : ['jquery'],

  plugins: [
    options.enOnly && replace({
      include: 'src/locales/index.js',
      values: {
        all: 'enOnly'
      }
    }),
    babel({
      exclude: 'node_modules/**',
      presets: [['@babel/env', { modules: false }]],
      plugins: ['@babel/plugin-proposal-export-namespace-from']
    }),
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
    commonjs({
      namedExports: { './src/vendor/pusher.js': ['Pusher'] }
    }),

    terser({
      compress: {
        passes: 2 // https://github.com/terser/terser/issues/453
      },
      include: [/^.+\.min\.js$/]
    }),

    license({
      banner: `
<%= pkg.name %> <%= pkg.version %>
Date: <%= moment().format('YYYY-MM-DD') %>`
    })
  ]
})

export default [
  bundle('uploadcare.api.js', 'uploadcare.api.js', { enOnly: true }),
  bundle('uploadcare.api.js', 'uploadcare.api.min.js', { enOnly: true }),

  bundle('uploadcare.js', 'uploadcare.js'),
  bundle('uploadcare.js', 'uploadcare.min.js'),

  bundle('uploadcare.lang.en.js', 'uploadcare.lang.en.js', { enOnly: true }),
  bundle('uploadcare.lang.en.js', 'uploadcare.lang.en.min.js', { enOnly: true }),

  bundle('uploadcare.full.js', 'uploadcare.full.js', { includeJquery: true }),
  bundle('uploadcare.full.js', 'uploadcare.full.min.js', { includeJquery: true })
]
