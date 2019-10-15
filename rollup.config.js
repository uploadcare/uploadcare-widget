import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import { string } from 'rollup-plugin-string'
import license from 'rollup-plugin-license'

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
    babel({
      exclude: 'node_modules/**',
      presets: [['@babel/env', { modules: false }]],
      plugins: [
        '@babel/plugin-proposal-export-namespace-from',
        'babel-plugin-html-tag'
      ]
    }),

    string({
      include: [
        'src/stylesheets/styles.css',
        'src/svgs/icons.html'
      ]
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
  bundle('uploadcare.api.js', 'uploadcare.api.js'),
  bundle('uploadcare.api.js', 'uploadcare.api.min.js'),

  bundle('uploadcare.js', 'uploadcare.js'),
  bundle('uploadcare.js', 'uploadcare.min.js'),

  bundle('uploadcare.lang.en.js', 'uploadcare.lang.en.js'),
  bundle('uploadcare.lang.en.js', 'uploadcare.lang.en.min.js'),

  bundle('uploadcare.full.js', 'uploadcare.full.js', { includeJquery: true }),
  bundle('uploadcare.full.js', 'uploadcare.full.min.js', { includeJquery: true })
]
